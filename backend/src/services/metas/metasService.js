import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataPath = path.join(__dirname, '../../../data/cofres_metas.json')

export function lerDadosMetas() {
  try {
    if (fs.existsSync(dataPath)) {
      return JSON.parse(fs.readFileSync(dataPath, 'utf8'))
    }
  } catch (err) {
    console.error('Erro ao ler cofres_metas.json:', err)
  }

  return { config_cdi: { taxa_cdi_anual: 10.5, percentual_rendimento_conta: 120 }, caixinhas: [] }
}

export function salvarDadosMetas(dados) {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(dados, null, 2), 'utf8')
  } catch (err) {
    console.error('Erro ao salvar cofres_metas.json:', err)
  }
}

export function simularAportes(valorAlvo, valorAtual, aporteMensal, taxaCdiAnual = 10.5, percentualCdi = 120) {
  const cdiEfetivoAnual = (taxaCdiAnual * (percentualCdi / 100)) / 100
  const taxaMensal = Math.pow(1 + cdiEfetivoAnual, 1 / 12) - 1

  let saldo = Number(valorAtual || 0)
  let meses = 0
  const alvo = Number(valorAlvo || 0)
  const aporte = Number(aporteMensal || 0)

  if (saldo >= alvo) return { mesesEstimados: 0, rendimentoJurosEst: 0 }
  if (aporte <= 0) return { mesesEstimados: Infinity, rendimentoJurosEst: 0 }

  let totalInvestidoSemJuros = saldo

  while (saldo < alvo && meses < 360) {
    saldo += aporte
    totalInvestidoSemJuros += aporte
    saldo += saldo * taxaMensal
    meses++
  }

  const rendimentoJurosEst = Math.max(0, saldo - totalInvestidoSemJuros)

  return {
    mesesEstimados: meses,
    rendimentoJurosEst: parseFloat(rendimentoJurosEst.toFixed(2)),
  }
}

export function listarCaixinhas() {
  const dados = lerDadosMetas()
  const { taxa_cdi_anual, percentual_rendimento_conta } = dados.config_cdi || {}

  const caixinhasComSimulacao = (dados.caixinhas || []).map(c => {
    const simulacao = simularAportes(
      c.valor_alvo,
      c.valor_atual,
      c.aporte_mensal_sugerido,
      taxa_cdi_anual,
      percentual_rendimento_conta
    )

    const percentualConcluido = c.valor_alvo > 0 ? Math.min(100, Math.round((c.valor_atual / c.valor_alvo) * 100)) : 0

    return {
      ...c,
      percentualConcluido,
      mesesEstimados: simulacao.mesesEstimados,
      rendimentoJurosEst: simulacao.rendimentoJurosEst,
    }
  })

  const totalEmCofres = (dados.caixinhas || []).reduce((acc, c) => acc + Number(c.valor_atual || 0), 0)
  const totalMetas = (dados.caixinhas || []).reduce((acc, c) => acc + Number(c.valor_alvo || 0), 0)

  return {
    config_cdi: dados.config_cdi,
    resumo: {
      totalEmCofres: parseFloat(totalEmCofres.toFixed(2)),
      totalMetas: parseFloat(totalMetas.toFixed(2)),
      qtdCaixinhas: (dados.caixinhas || []).length,
    },
    caixinhas: caixinhasComSimulacao,
  }
}

export function criarCaixinha(payload = {}) {
  const dados = lerDadosMetas()
  const {
    titulo,
    categoria,
    valor_original_divida,
    percentual_desconto,
    valor_alvo,
    aporte_mensal_sugerido,
    data_alvo,
    cor_badge,
  } = payload

  const novaCaixinha = {
    id: `meta_${Date.now()}`,
    titulo: titulo || 'Nova Meta',
    categoria: categoria || 'Conquista Pessoal',
    valor_original_divida: Number(valor_original_divida || 0),
    percentual_desconto: Number(percentual_desconto || 0),
    valor_alvo: Number(valor_alvo || 0),
    valor_atual: 0,
    aporte_mensal_sugerido: Number(aporte_mensal_sugerido || 0),
    data_alvo: data_alvo || null,
    status: 'Em Progresso',
    cor_badge: cor_badge || 'indigo',
    historico_aportes: [],
  }

  dados.caixinhas.push(novaCaixinha)
  salvarDadosMetas(dados)

  return novaCaixinha
}

export function registrarAporteCaixinha(id, payload = {}) {
  const dados = lerDadosMetas()
  const { valor, observacao } = payload
  const caixinha = dados.caixinhas.find(c => c.id === id)

  if (!caixinha) return null

  const valorNum = Number(valor || 0)
  caixinha.valor_atual = parseFloat((caixinha.valor_atual + valorNum).toFixed(2))

  caixinha.historico_aportes.push({
    id: `apt_${Date.now()}`,
    valor: valorNum,
    data: new Date().toISOString(),
    observacao: observacao || 'Aporte manual',
  })

  if (caixinha.valor_atual >= caixinha.valor_alvo && caixinha.valor_alvo > 0) {
    caixinha.status = 'Concluído'
  }

  salvarDadosMetas(dados)
  return caixinha
}

export function removerCaixinha(id) {
  const dados = lerDadosMetas()
  dados.caixinhas = dados.caixinhas.filter(c => c.id !== id)
  salvarDadosMetas(dados)
  return true
}
