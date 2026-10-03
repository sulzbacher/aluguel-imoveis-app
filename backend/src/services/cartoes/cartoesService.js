import fs from 'fs'
import path from 'path'
// Exemplo da rota/função ao registrar pagamento de fatura de cartão:
export function fecharEAvancarFaturaCartao(cartaoId, mesPago) {
  // 1. Carrega os dados dos cartões
  const cartoes = lerJSON('cartoes_credito.json')
  const cartao = cartoes.find(c => c.id === cartaoId)

  if (!cartao) return

  const comprasAtuais = cartao.compras || []
  const novasCompras = []

  comprasAtuais.forEach(compra => {
    // Se for uma compra parcelada (ex: parcelaAtual: 2, totalParcelas: 4)
    if (compra.totalParcelas && compra.totalParcelas > 1) {
      const proximaParcela = Number(compra.parcelaAtual || 1) + 1

      // Se ainda restam parcelas a pagar para os próximos meses
      if (proximaParcela <= compra.totalParcelas) {
        novasCompras.push({
          ...compra,
          parcelaAtual: proximaParcela,
        })
      }
      // Se era a última parcela (ex: 4 de 4), NÃO entra em novasCompras (finalizou!)
    }
    // Se for compra à vista do mês, ela já foi paga nesta fatura -> NÃO entra na nova fatura!
  })

  // 2. Atualiza as compras do cartão para o novo ciclo/fatura
  cartao.compras = novasCompras

  // 3. Recalcula a fatura e o limite disponível
  const novaFatura = novasCompras.reduce((acc, c) => acc + Number(c.valorParcela || c.valor || 0), 0)
  cartao.faturaAtual = parseFloat(novaFatura.toFixed(2))

  const totalComprometido = novasCompras.reduce((acc, c) => {
    const parcelasRestantes = (c.totalParcelas || 1) - (c.parcelaAtual - 1)
    return acc + Number(c.valorParcela || c.valor) * parcelasRestantes
  }, 0)

  cartao.limiteComprometido = parseFloat(totalComprometido.toFixed(2))
  cartao.limiteDisponivel = parseFloat((Number(cartao.limite || 0) - totalComprometido).toFixed(2))

  // 4. Salva as alterações
  salvarJSON('cartoes_credito.json', cartoes)
}

// Função para avançar a fatura do cartão para o próximo mês
export function processarViradaFatura(
  mesAtualKey = '01-09-2026',
  mesProximoKey = '01-10-2026',
  cartaoId = 'cartao_caixa_mulher'
) {
  const dataPath = path.join(process.cwd(), 'data', 'faturas_cartoes.json')

  if (!fs.existsSync(dataPath)) return

  const faturasData = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
  const faturaAtual = faturasData[mesAtualKey]?.compras || []

  const comprasProximaFatura = []

  faturaAtual.forEach(compra => {
    if (compra.cartao_id !== cartaoId) return

    // 1. Se for RECORRENTE: Repete no próximo mês com os mesmos dados
    if (compra.tipo === 'Recorrente') {
      comprasProximaFatura.push({
        ...compra,
        id: `cmp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        parcela_atual: 1,
      })
    }
    // 2. Se foi PARCELADO:
    else if (compra.tipo === 'Parcelado') {
      // Se tinha mais de 1 parcela e ainda restam parcelas a pagar
      if (compra.parcelas_totais > 1 && compra.parcela_atual < compra.parcelas_totais) {
        comprasProximaFatura.push({
          ...compra,
          id: `cmp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          parcela_atual: compra.parcela_atual + 1,
        })
      }
      // NOTA: Se parcelas_totais === 1 (à vista) ou se parcela_atual === parcelas_totais (última parcela),
      // a compra é quitada e NÃO é adicionada na comprasProximaFatura!
    }
  })

  // Salva no objeto faturasData na chave do próximo mês
  if (!faturasData[mesProximoKey]) {
    faturasData[mesProximoKey] = { compras: [] }
  }

  // Substitui ou mescla a fatura do próximo mês
  faturasData[mesProximoKey].compras = comprasProximaFatura

  fs.writeFileSync(dataPath, JSON.stringify(faturasData, null, 2), 'utf8')

  return comprasProximaFatura
}
