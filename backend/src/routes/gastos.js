import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { sincronizarComGastosMensais } from '../services/cartoes/cartoesService.js'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const gastosPath = path.join(__dirname, '../../data/gastos_mensais.json')
const rendaPath = path.join(__dirname, '../../data/renda_casal.json')
const historicoPath = path.join(__dirname, '../../data/historico_pagamentos.json')

function lerJSON(caminho, padrao) {
  try {
    if (fs.existsSync(caminho)) {
      return JSON.parse(fs.readFileSync(caminho, 'utf8'))
    }
  } catch (err) {
    console.error(`Erro ao ler ${caminho}:`, err)
  }
  return padrao
}

function salvarJSON(caminho, dados) {
  try {
    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2), 'utf8')
  } catch (err) {
    console.error(`Erro ao salvar ${caminho}:`, err)
  }
}

// GET: Retorna gastos ordenados pela prioridade (1 -> 2 -> 3)
router.get('/', (req, res) => {
  // 🚀 Sincroniza as faturas dos cartões ANTES de ler o arquivo de gastos
  sincronizarComGastosMensais()

  const gastos = lerJSON(gastosPath, [])
  const renda = lerJSON(rendaPath, { carol: { entradas: [] }, neno: { entradas_variaveis: [] } })

  // Ordena estritamente pelo campo de prioridade
  gastos.sort((a, b) => Number(a.prioridade || 2) - Number(b.prioridade || 2))

  // Totais de Renda
  const rendaCarol = (renda.carol?.entradas || []).reduce((acc, c) => acc + Number(c.valor || 0), 0)
  const rendaNeno = (renda.neno?.entradas_variaveis || []).reduce((acc, c) => acc + Number(c.valor || 0), 0)
  const rendaTotalCasal = rendaCarol + rendaNeno

  // Totais de Gastos
  const totalGeralGastos = gastos.reduce((acc, curr) => acc + Number(curr.valor || 0), 0)
  const gastosQueContinuam = gastos
    .filter(g => !g.substituidoNaMudanca)
    .reduce((acc, curr) => acc + Number(curr.valor || 0), 0)
  const gastosSubstituidos = gastos
    .filter(g => g.substituidoNaMudanca)
    .reduce((acc, curr) => acc + Number(curr.valor || 0), 0)

  res.json({
    gastos,
    renda,
    resumo: {
      rendaCarol: parseFloat(rendaCarol.toFixed(2)),
      rendaNeno: parseFloat(rendaNeno.toFixed(2)),
      rendaTotalCasal: parseFloat(rendaTotalCasal.toFixed(2)),
      totalGeralGastos: parseFloat(totalGeralGastos.toFixed(2)),
      gastosQueContinuam: parseFloat(gastosQueContinuam.toFixed(2)),
      gastosSubstituidos: parseFloat(gastosSubstituidos.toFixed(2)),
      sobraSemImovelNovo: parseFloat((rendaTotalCasal - totalGeralGastos).toFixed(2)),
    },
  })
})

// POST: Adicionar novo gasto com prioridade
router.post('/', (req, res) => {
  const { descricao, categoria, valor, tipo, substituidoNaMudanca, prioridade } = req.body
  const gastos = lerJSON(gastosPath, [])

  const novoGasto = {
    id: `gsto_${Date.now()}`,
    descricao: descricao || 'Novo Gasto',
    categoria: categoria || 'Geral',
    valor: Number(valor || 0),
    tipo: tipo || 'Fixo Pessoal',
    substituidoNaMudanca: Boolean(substituidoNaMudanca),
    prioridade: Number(prioridade || 2),
  }

  gastos.push(novoGasto)
  salvarJSON(gastosPath, gastos)
  res.status(201).json(novoGasto)
})

// DELETE: Remove um gasto pelo ID
router.delete('/:id', (req, res) => {
  let gastos = lerJSON(gastosPath, [])
  gastos = gastos.filter(g => g.id !== req.params.id)
  salvarJSON(gastosPath, gastos)
  res.json({ message: 'Gasto removido com sucesso!' })
})

// POST: Adiciona nova entrada de renda (para Carol ou Neno)
router.post('/renda/:pessoa', (req, res) => {
  const { pessoa } = req.params // 'carol' ou 'neno'
  const { descricao, valor, dia, data, data_estimada, tipo, confirmado } = req.body
  const renda = lerJSON(rendaPath, { carol: { entradas: [] }, neno: { entradas_variaveis: [] } })

  if (!renda[pessoa]) {
    renda[pessoa] = {}
  }

  const chaveEntradas = Array.isArray(renda[pessoa].entradas_variaveis)
    ? 'entradas_variaveis'
    : Array.isArray(renda[pessoa].entradas)
      ? 'entradas'
      : pessoa === 'neno'
        ? 'entradas_variaveis'
        : 'entradas'

  if (!renda[pessoa][chaveEntradas]) {
    renda[pessoa][chaveEntradas] = []
  }

  const novaEntrada = {
    id: `rnd_${Date.now()}`,
    descricao: descricao || 'Entrada Renda',
    valor: Number(valor || 0),
    dia: dia ? Number(dia) : null,
    data_estimada: data_estimada || data || null,
    tipo: tipo || 'Flexível / Freela',
    confirmado: confirmado !== undefined ? Boolean(confirmado) : false,
  }

  renda[pessoa][chaveEntradas].push(novaEntrada)
  salvarJSON(rendaPath, renda)
  res.status(201).json(novaEntrada)
})

// DELETE: Remove uma entrada de renda pelo ID (ou por correspondência de índice/descrição)
router.delete('/renda/:pessoa/:id', (req, res) => {
  const { pessoa, id } = req.params
  const renda = lerJSON(rendaPath, { carol: { entradas: [] }, neno: { entradas_variaveis: [] } })

  if (renda[pessoa]) {
    const chaveEntradas = Array.isArray(renda[pessoa].entradas_variaveis) ? 'entradas_variaveis' : 'entradas'

    if (renda[pessoa][chaveEntradas]) {
      renda[pessoa][chaveEntradas] = renda[pessoa][chaveEntradas].filter(e => e.id !== id && e.descricao !== id)
      salvarJSON(rendaPath, renda)
    }
  }

  res.json({ message: 'Entrada removida com sucesso!' })
})

//Rotas Pagamentos
// Helper: Garante que um mês exista no histórico. Se não existir, clona as contas mestre.
function inicializarMesHistorico(mesAno) {
  sincronizarComGastosMensais()

  const historico = lerJSON(historicoPath, {})
  const gastosMestre = lerJSON(gastosPath, [])

  if (!historico[mesAno]) {
    historico[mesAno] = {
      status: 'Em Aberto',
      contas: gastosMestre.map(gasto => ({
        gasto_id: gasto.id,
        descricao: gasto.descricao,
        categoria: gasto.categoria,
        prioridade: gasto.prioridade || 2,
        dia_vencimento: gasto.dia_vencimento || 10,
        tipo: gasto.tipo,
        substituidoNaMudanca: Boolean(gasto.substituidoNaMudanca),
        valor_previsto: Number(gasto.valor || 0),
        valor_pago: 0,
        pago: false,
        data_pagamento: null,
        pago_por: null,
      })),
    }
    salvarJSON(historicoPath, historico)
  } else {
    // Sincroniza o valor de cartões/gastos para contas ainda não pagas no mês
    let alterado = false
    historico[mesAno].contas.forEach(conta => {
      const mestre = gastosMestre.find(g => g.id === conta.gasto_id || g.descricao === conta.descricao)
      if (mestre && !conta.pago && conta.valor_previsto !== mestre.valor) {
        conta.valor_previsto = Number(mestre.valor || 0)
        alterado = true
      }
    })
    if (alterado) salvarJSON(historicoPath, historico)
  }

  return historico
}

// GET: Retorna gastos e histórico do mês selecionado (ex: ?mesAno=2026-10)
router.get('/historico/:mesAno', (req, res) => {
  const { mesAno } = req.params
  const historico = inicializarMesHistorico(mesAno)
  const renda = lerJSON(rendaPath, { carol: { entradas: [] }, neno: {} })

  const dadosMes = historico[mesAno] || { status: 'Em Aberto', contas: [] }

  // Resumos do mês
  const totalPrevisto = dadosMes.contas.reduce((acc, c) => acc + Number(c.valor_previsto || 0), 0)
  const totalEfetivamentePago = dadosMes.contas
    .filter(c => c.pago)
    .reduce((acc, c) => acc + Number(c.valor_pago || c.valor_previsto || 0), 0)
  const totalPendente = totalPrevisto - totalEfetivamentePago

  const qtdPagas = dadosMes.contas.filter(c => c.pago).length
  const qtdTotal = dadosMes.contas.length

  res.json({
    mesAno,
    status: dadosMes.status,
    contas: dadosMes.contas.sort((a, b) => {
      if (a.prioridade !== b.prioridade) return a.prioridade - b.prioridade
      return (a.dia_vencimento || 31) - (b.dia_vencimento || 31)
    }),
    renda,
    resumo: {
      totalPrevisto: parseFloat(totalPrevisto.toFixed(2)),
      totalEfetivamentePago: parseFloat(totalEfetivamentePago.toFixed(2)),
      totalPendente: parseFloat(Math.max(0, totalPendente).toFixed(2)),
      qtdPagas,
      qtdTotal,
      percentualConcluido: qtdTotal > 0 ? Math.round((qtdPagas / qtdTotal) * 100) : 0,
    },
    mesesDisponiveis: Object.keys(historico).sort().reverse(),
  })
})

// POST: Alternar/Marcar Status de Pagamento de uma Conta
router.post('/historico/marcar-pago', (req, res) => {
  const { mesAno, gasto_id, pago, valor_pago, pago_por } = req.body
  const historico = lerJSON(historicoPath, {})

  if (!historico[mesAno]) {
    return res.status(404).json({ message: 'Mês não encontrado no histórico.' })
  }

  const conta = historico[mesAno].contas.find(c => c.gasto_id === gasto_id || c.descricao === gasto_id)
  console.log(conta)
  if (conta) {
    conta.pago = Boolean(pago)
    if (conta.pago) {
      conta.valor_pago = valor_pago !== undefined ? Number(valor_pago) : Number(conta.valor_previsto)
      conta.data_pagamento = new Date().toISOString()
      conta.pago_por = pago_por || 'Carol'
    } else {
      conta.valor_pago = 0
      ;((conta.data_pagamento = null), (conta.pago_por = null))
    }

    salvarJSON(historicoPath, historico)
    return res.json({ message: 'Status atualizado!', conta })
  }

  res.status(404).json({ message: 'Gasto não encontrado neste mês.' })
})

export default router
