import dotenv from 'dotenv'
import express from 'express'
import fs from 'fs'
import { google } from 'googleapis'
import path from 'path'
import { fileURLToPath } from 'url'
dotenv.config()

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const tokensPath = path.join(__dirname, '../../data/google_tokens.json')

// Suba estas variáveis para o seu .env
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URI = 'http://192.168.100.23:3001/api/agenda/callback'

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ ERRO: GOOGLE_CLIENT_ID ou GOOGLE_CLIENT_SECRET não foram carregados do .env!')
} else {
  console.log('✅ Credenciais OAuth do Google carregadas com sucesso.')
}

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)

function lerTokens() {
  try {
    if (fs.existsSync(tokensPath)) {
      const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'))
      oauth2Client.setCredentials(tokens)
      return tokens
    }
  } catch (err) {
    console.error('Erro ao ler tokens:', err)
  }
  return null
}

function salvarTokens(tokens) {
  fs.writeFileSync(tokensPath, JSON.stringify(tokens, null, 2), 'utf8')
}

// 1. Rota para iniciar login com o Google
router.get('/auth-url', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/calendar'],
  })
  res.json({ url })
})

// 2. Callback OAuth do Google
router.get('/callback', async (req, res) => {
  const { code } = req.query
  try {
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)
    salvarTokens(tokens)
    res.redirect('http://192.168.100.23:5173/agenda?conectado=true')
  } catch (err) {
    res.status(500).send('Erro na autenticação com o Google Agenda.')
  }
})

// Helper para validar autenticação antes das chamadas
function garantirAuth(res) {
  if (!lerTokens()) {
    res.status(401).json({ error: 'Não autenticado no Google Agenda.' })
    return false
  }
  return true
}

// 1. GET: Lista todas as agendas/calendários inscritos na conta
router.get('/calendarios', async (req, res) => {
  if (!garantirAuth(res)) return

  try {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
    const response = await calendar.calendarList.list()

    // Retorna lista com ID, Nome e Cor de cada calendário
    const calendarios = (response.data.items || []).map(item => ({
      id: item.id,
      summary: item.summary,
      primary: item.primary || false,
      backgroundColor: item.backgroundColor,
    }))

    res.json(calendarios)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 2. GET: Listar eventos de um calendário específico (ou 'primary' por padrão)
router.get('/eventos', async (req, res) => {
  if (!garantirAuth(res)) return

  const calendarId = req.query.calendarId || 'primary'

  try {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
    const response = await calendar.events.list({
      calendarId: calendarId,
      timeMin: new Date().toISOString(),
      maxResults: 30,
      singleEvents: true,
      orderBy: 'startTime',
    })
    res.json(response.data.items || [])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 3. POST: Criar evento no calendário selecionado
router.post('/eventos', async (req, res) => {
  if (!garantirAuth(res)) return

  const { calendarId, summary, description, location, startDateTime, endDateTime } = req.body
  const targetCalendarId = calendarId || 'primary'

  try {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
    const response = await calendar.events.insert({
      calendarId: targetCalendarId,
      requestBody: {
        summary,
        description,
        location,
        start: { dateTime: new Date(startDateTime).toISOString() },
        end: { dateTime: new Date(endDateTime).toISOString() },
      },
    })
    res.status(201).json(response.data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 4. DELETE: Deletar evento
router.delete('/eventos/:id', async (req, res) => {
  if (!garantirAuth(res)) return

  const { id } = req.params
  const calendarId = req.query.calendarId || 'primary'

  try {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
    await calendar.events.delete({
      calendarId,
      eventId: id,
    })
    res.json({ message: 'Evento deletado com sucesso!' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
