import express from 'express'
import {
  atualizarEventoAgenda,
  criarEventoAgenda,
  deletarEventoAgenda,
  garantirAuthAgenda,
  getAuthUrl,
  handleOAuthCallback,
  listarCalendariosAgenda,
  listarEventosAgenda,
} from '../services/agenda/agendaService.js'

const router = express.Router()

router.get('/auth-url', (req, res) => {
  res.json({ url: getAuthUrl() })
})

router.get('/callback', async (req, res) => {
  const { code } = req.query

  try {
    await handleOAuthCallback(code)
    res.redirect('http://192.168.100.23:5173/agenda?conectado=true')
  } catch (err) {
    res.status(500).send('Erro na autenticação com o Google Agenda.')
  }
})

router.get('/calendarios', async (req, res) => {
  if (!garantirAuthAgenda(res)) return

  try {
    const calendarios = await listarCalendariosAgenda()
    res.json(calendarios)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/eventos', async (req, res) => {
  if (!garantirAuthAgenda(res)) return

  try {
    const calendarId = req.query.calendarId || 'primary'
    const eventos = await listarEventosAgenda(calendarId)
    res.json(eventos)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/eventos', async (req, res) => {
  if (!garantirAuthAgenda(res)) return

  try {
    const evento = await criarEventoAgenda(req.body)
    res.status(201).json(evento)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/eventos/:id', async (req, res) => {
  if (!garantirAuthAgenda(res)) return

  try {
    const { id } = req.params
    const calendarId = req.query.calendarId || req.body.calendarId || 'primary'
    const eventoAtualizado = await atualizarEventoAgenda(id, calendarId, req.body)
    res.json(eventoAtualizado)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/eventos/:id', async (req, res) => {
  if (!garantirAuthAgenda(res)) return

  try {
    const { id } = req.params
    const calendarId = req.query.calendarId || 'primary'
    await deletarEventoAgenda(id, calendarId)
    res.json({ message: 'Evento deletado com sucesso!' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
