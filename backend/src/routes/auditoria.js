import express from 'express'
import { auditarSistema } from '../services/auditoriaService.js'

const router = express.Router()

router.get('/', (req, res) => {
  const relatorio = auditarSistema()
  res.json(relatorio)
})

export default router
