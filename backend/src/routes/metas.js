import express from 'express'
import {
  criarCaixinha,
  listarCaixinhas,
  registrarAporteCaixinha,
  removerCaixinha,
} from '../services/metas/metasService.js'

const router = express.Router()

router.get('/', (req, res) => {
  res.json(listarCaixinhas())
})

router.post('/', (req, res) => {
  const novaCaixinha = criarCaixinha(req.body)
  res.status(201).json(novaCaixinha)
})

router.post('/:id/aporte', (req, res) => {
  const { id } = req.params
  const caixinha = registrarAporteCaixinha(id, req.body)

  if (!caixinha) {
    return res.status(404).json({ message: 'Caixinha não encontrada.' })
  }

  return res.json(caixinha)
})

router.delete('/:id', (req, res) => {
  const { id } = req.params
  removerCaixinha(id)
  res.json({ message: 'Caixinha removida com sucesso!' })
})

export default router
