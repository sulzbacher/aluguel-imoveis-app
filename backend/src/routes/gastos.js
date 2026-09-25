import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gastosPath = path.join(__dirname, '../../data/gastos_mensais.json')

function lerGastos() {
  try {
    if (fs.existsSync(gastosPath)) {
      const data = fs.readFileSync(gastosPath, 'utf8')
      return JSON.parse(data)
    }
  } catch (err) {
    console.error('Erro ao ler gastos_mensais.json:', err)
  }
  return []
}

function salvarGastos(gastos) {
  try {
    fs.writeFileSync(gastosPath, JSON.stringify(gastos, null, 2), 'utf8')
  } catch (err) {
    console.error('Erro ao salvar gastos_mensais.json:', err)
  }
}

// GET: Lista todos os gastos e calcula os totais
router.get('/', (req, res) => {
  const gastos = lerGastos()
  const totalGeral = gastos.reduce((acc, curr) => acc + Number(curr.valor || 0), 0)
  const totalFixos = gastos.filter(g => g.tipo === 'Fixo').reduce((acc, curr) => acc + Number(curr.valor || 0), 0)
  const totalVariaveis = gastos
    .filter(g => g.tipo === 'Variável')
    .reduce((acc, curr) => acc + Number(curr.valor || 0), 0)

  res.json({
    gastos,
    resumo: {
      totalGeral: parseFloat(totalGeral.toFixed(2)),
      totalFixos: parseFloat(totalFixos.toFixed(2)),
      totalVariaveis: parseFloat(totalVariaveis.toFixed(2)),
    },
  })
})

// POST: Adiciona um novo gasto
router.post('/', (req, res) => {
  const { descricao, categoria, valor, tipo } = req.body
  const gastos = lerGastos()

  const novoGasto = {
    id: `gasto_${Date.now()}`,
    descricao: descricao || 'Gasto sem nome',
    categoria: categoria || 'Geral',
    valor: Number(valor || 0),
    tipo: tipo || 'Fixo',
  }

  gastos.push(novoGasto)
  salvarGastos(gastos)

  res.status(201).json(novoGasto)
})

// DELETE: Remove um gasto pelo ID
router.delete('/:id', (req, res) => {
  let gastos = lerGastos()
  gastos = gastos.filter(g => g.id !== req.params.id)
  salvarGastos(gastos)
  res.json({ message: 'Gasto removido com sucesso!' })
})

export default router
