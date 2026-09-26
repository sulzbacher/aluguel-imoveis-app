import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const gastosPath = path.join(__dirname, '../../data/gastos_mensais.json')
const rendaPath = path.join(__dirname, '../../data/renda_casal.json')

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

// GET: Retorna Gastos, Rendas e Resumo Financeiro
router.get('/', (req, res) => {
  const gastos = lerJSON(gastosPath, [])
  const renda = lerJSON(rendaPath, { carol: { entradas: [] }, neno: { entradas: [] } })

  // Totais de Renda
  const rendaCarol = (renda.carol?.entradas || []).reduce((acc, c) => acc + Number(c.valor || 0), 0)
  const rendaNeno = (renda.neno?.entradas || []).reduce((acc, c) => acc + Number(c.valor || 0), 0)
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

// POST: Adiciona novo gasto
router.post('/', (req, res) => {
  const { descricao, categoria, valor, tipo, substituidoNaMudanca } = req.body
  const gastos = lerJSON(gastosPath, [])

  const novoGasto = {
    id: `gsto_${Date.now()}`,
    descricao: descricao || 'Novo Gasto',
    categoria: categoria || 'Geral',
    valor: Number(valor || 0),
    tipo: tipo || 'Fixo Pessoal',
    substituidoNaMudanca: Boolean(substituidoNaMudanca),
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
  const { descricao, valor, dia, data, tipo } = req.body
  const renda = lerJSON(rendaPath, { carol: { entradas: [] }, neno: { entradas: [] } })

  if (!renda[pessoa]) {
    renda[pessoa] = { entradas: [] }
  }

  const novaEntrada = {
    id: `rnd_${Date.now()}`,
    descricao: descricao || 'Entrada Renda',
    valor: Number(valor || 0),
    dia: dia ? Number(dia) : null,
    data: data || null,
    tipo: tipo || 'Flexível / Freela',
  }

  renda[pessoa].entradas.push(novaEntrada)
  salvarJSON(rendaPath, renda)
  res.status(201).json(novaEntrada)
})

// DELETE: Remove uma entrada de renda pelo ID
router.delete('/renda/:pessoa/:id', (req, res) => {
  const { pessoa, id } = req.params
  const renda = lerJSON(rendaPath, { carol: { entradas: [] }, neno: { entradas: [] } })

  if (renda[pessoa]?.entradas) {
    renda[pessoa].entradas = renda[pessoa].entradas.filter(e => e.id !== id)
    salvarJSON(rendaPath, renda)
  }

  res.json({ message: 'Entrada removida com sucesso!' })
})

export default router
