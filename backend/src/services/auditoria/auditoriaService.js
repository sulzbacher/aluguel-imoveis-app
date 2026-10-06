import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function lerJSON(relPath, padrao) {
  try {
    const fullPath = path.join(__dirname, '../../data', relPath)
    if (fs.existsSync(fullPath)) return JSON.parse(fs.readFileSync(fullPath, 'utf8'))
  } catch (e) {
    console.error(`Erro ao ler ${relPath}:`, e)
  }
  return padrao
}

export function auditarSistema() {
  const gastosMestre = lerJSON('gastos_mensais.json', [])
  const cartoes = lerJSON('cartoes_credito.json', { cartoes: [] })
  const faturas = lerJSON('faturas_cartoes.json', {})
  const renda = lerJSON('renda_casal.json', { carol: { entradas: [] }, neno: { entradas_variaveis: [] } })
  const imoveis = lerJSON('imoveis.json', [])
  const historico = lerJSON('historico_pagamentos.json', {})

  const divergencias = []
  const alertas = []

  const comprasMensais = Object.values(faturas)
    .flatMap(mes => Array.isArray(mes?.compras) ? mes.compras : [])

  // 1. Renda Total do Casal
  const rendaCarol = (renda.carol?.entradas || []).reduce((acc, e) => acc + Number(e.valor || 0), 0)
  const rendaNeno = (renda.neno?.entradas_variaveis || []).reduce((acc, e) => acc + Number(e.valor || 0), 0)
  const rendaTotal = rendaCarol + rendaNeno

  // 2. Gastos Mestre (Fixos vs Substituídos)
  const gastosContinuam = gastosMestre
    .filter(g => !g.substituidoNaMudanca)
    .reduce((acc, g) => acc + Number(g.valor || 0), 0)

  // 3. Auditoria de Cartões de Crédito vs Planilha
  (cartoes.cartoes || []).forEach(cartao => {
    const faturaCalculada = comprasMensais
      .filter(c => c.cartao_id === cartao.id)
      .reduce((acc, c) => acc + Number(c.valor_parcela || c.valor_total || c.valor || 0), 0)
    const itemNaPlanilha = gastosMestre.find(g => new RegExp(cartao.nome, 'i').test(g.descricao))

    if (itemNaPlanilha && Number(itemNaPlanilha.valor) !== parseFloat(faturaCalculada.toFixed(2))) {
      divergencias.push({
        modulo: 'Cartões vs Gastos',
        item: cartao.nome,
        mensagem: `Fatura calculada no cartão (R$ ${faturaCalculada.toFixed(2)}) não bate com o valor na planilha (R$ ${itemNaPlanilha.valor}).`,
      })
    }
  })

  // 4. Auditoria do Calculo de Imóveis (Sobra Líquida)
  imoveis.forEach(imovel => {
    const aluguel = Number(imovel.valorAluguel || 0)
    const condominio = Number(imovel.valorCondominio || 0)
    const iptu = Number(imovel.valorIptu || 0)
    const seguro = Number(imovel.seguroFiancaMensal || 0)

    const custoTotalImovel = aluguel + condominio + iptu + seguro
    const sobraCalculada = rendaTotal - (gastosContinuam + custoTotalImovel)

    if (imovel.calculos?.sobraLiquidaComSeguro !== undefined) {
      const diferenca = Math.abs(imovel.calculos.sobraLiquidaComSeguro - sobraCalculada)
      if (diferenca > 0.5) {
        divergencias.push({
          modulo: 'Imóveis (Sobra Líquida)',
          item: imovel.titulo,
          mensagem: `Sobra calculada (R$ ${sobraCalculada.toFixed(2)}) difere da salva no imóvel (R$ ${imovel.calculos.sobraLiquidaComSeguro}).`,
        })
      }
    }
  })

  return {
    status: divergencias.length === 0 ? 'SAUDÁVEL' : 'ATENÇÃO',
    resumoCalculado: {
      rendaTotal: parseFloat(rendaTotal.toFixed(2)),
      gastosQueContinuam: parseFloat(gastosContinuam.toFixed(2)),
      sobraDisponivelParaImovel: parseFloat((rendaTotal - gastosContinuam).toFixed(2)),
    },
    divergencias,
    alertas,
  }
}
