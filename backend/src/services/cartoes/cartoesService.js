import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const cartoesPath = path.join(__dirname, '../../../data/cartoes_credito.json')
const gastosPath = path.join(__dirname, '../../../data/gastos_mensais.json')

export function lerJSON(caminho, padrao) {
  try {
    if (fs.existsSync(caminho)) {
      return JSON.parse(fs.readFileSync(caminho, 'utf8'))
    }
  } catch (err) {
    console.error(`Erro ao ler ${caminho}:`, err)
  }
  return padrao
}

export function salvarJSON(caminho, dados) {
  try {
    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2), 'utf8')
  } catch (err) {
    console.error(`Erro ao salvar ${caminho}:`, err)
  }
}

export function lerDadosCartoes() {
  return lerJSON(cartoesPath, { cartoes: [], compras: [] })
}

export function salvarDadosCartoes(dados) {
  salvarJSON(cartoesPath, dados)
}

export function sincronizarComGastosMensais() {
  const dataCartoes = lerDadosCartoes()
  const gastos = lerJSON(gastosPath, [])

  const faturaCaixa = dataCartoes.compras
    .filter(c => c.cartao_id === 'cartao_caixa_mulher')
    .reduce((a, b) => a + Number(b.valor_parcela || 0), 0)

  const faturaNeon = dataCartoes.compras
    .filter(c => c.cartao_id === 'cartao_neon_neno')
    .reduce((a, b) => a + Number(b.valor_parcela || 0), 0)

  const faturaNubank = dataCartoes.compras
    .filter(c => c.cartao_id === 'cartao_nubank_neno')
    .reduce((a, b) => a + Number(b.valor_parcela || 0), 0)

  const gCaixa = gastos.find(g => /caixa mulher/i.test(g.descricao))
  if (gCaixa) gCaixa.valor = faturaCaixa

  const gNeon = gastos.find(g => /neon/i.test(g.descricao))
  if (gNeon) gNeon.valor = faturaNeon

  const gNubank = gastos.find(g => /nubank/i.test(g.descricao))
  if (gNubank) gNubank.valor = faturaNubank

  salvarJSON(gastosPath, gastos)
}

export function fecharEAvancarFaturaCartao(cartaoId, mesPago) {
  const cartoes = lerDadosCartoes()
  const cartao = cartoes.find(c => c.id === cartaoId)

  if (!cartao) return

  const comprasAtuais = cartao.compras || []
  const novasCompras = []

  comprasAtuais.forEach(compra => {
    if (compra.totalParcelas && compra.totalParcelas > 1) {
      const proximaParcela = Number(compra.parcelaAtual || 1) + 1

      if (proximaParcela <= compra.totalParcelas) {
        novasCompras.push({
          ...compra,
          parcelaAtual: proximaParcela,
        })
      }
    }
  })

  cartao.compras = novasCompras

  const novaFatura = novasCompras.reduce((acc, c) => acc + Number(c.valorParcela || c.valor || 0), 0)
  cartao.faturaAtual = parseFloat(novaFatura.toFixed(2))

  const totalComprometido = novasCompras.reduce((acc, c) => {
    const parcelasRestantes = (c.totalParcelas || 1) - (c.parcelaAtual - 1)
    return acc + Number(c.valorParcela || c.valor) * parcelasRestantes
  }, 0)

  cartao.limiteComprometido = parseFloat(totalComprometido.toFixed(2))
  cartao.limiteDisponivel = parseFloat((Number(cartao.limite || 0) - totalComprometido).toFixed(2))

  salvarDadosCartoes(cartoes)
}

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

    if (compra.tipo === 'Recorrente') {
      comprasProximaFatura.push({
        ...compra,
        id: `cmp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        parcela_atual: 1,
      })
    } else if (compra.tipo === 'Parcelado') {
      if (compra.parcelas_totais > 1 && compra.parcela_atual < compra.parcelas_totais) {
        comprasProximaFatura.push({
          ...compra,
          id: `cmp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          parcela_atual: compra.parcela_atual + 1,
        })
      }
    }
  })

  if (!faturasData[mesProximoKey]) {
    faturasData[mesProximoKey] = { compras: [] }
  }

  faturasData[mesProximoKey].compras = comprasProximaFatura

  fs.writeFileSync(dataPath, JSON.stringify(faturasData, null, 2), 'utf8')

  return comprasProximaFatura
}
