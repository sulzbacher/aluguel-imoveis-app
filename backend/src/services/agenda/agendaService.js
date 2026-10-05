import dotenv from 'dotenv'
import fs from 'fs'
import { google } from 'googleapis'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const tokensPath = path.join(__dirname, '../../../data/google_tokens.json')

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URI = 'http://192.168.100.23:3001/api/agenda/callback'

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ ERRO: GOOGLE_CLIENT_ID ou GOOGLE_CLIENT_SECRET não foram carregados do .env!')
}

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)

export function lerTokensAgenda() {
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

export function salvarTokensAgenda(tokens) {
  fs.writeFileSync(tokensPath, JSON.stringify(tokens, null, 2), 'utf8')
}

export function getAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/calendar'],
  })
}

export async function handleOAuthCallback(code) {
  const { tokens } = await oauth2Client.getToken(code)
  oauth2Client.setCredentials(tokens)
  salvarTokensAgenda(tokens)
  return tokens
}

export function garantirAuthAgenda(res) {
  if (!lerTokensAgenda()) {
    res.status(401).json({ error: 'Não autenticado no Google Agenda.' })
    return false
  }

  return true
}

export async function listarCalendariosAgenda() {
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
  const response = await calendar.calendarList.list()

  return (response.data.items || []).map(item => ({
    id: item.id,
    summary: item.summary,
    primary: item.primary || false,
    backgroundColor: item.backgroundColor,
  }))
}

export async function listarEventosAgenda(calendarId = 'primary') {
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
  const response = await calendar.events.list({
    calendarId,
    timeMin: new Date().toISOString(),
    maxResults: 30,
    singleEvents: true,
    orderBy: 'startTime',
  })

  return response.data.items || []
}

export async function criarEventoAgenda(payload = {}) {
  const { calendarId = 'primary', summary, description, location, startDateTime, endDateTime } = payload
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

  const response = await calendar.events.insert({
    calendarId,
    requestBody: {
      summary,
      description,
      location,
      start: { dateTime: new Date(startDateTime).toISOString() },
      end: { dateTime: new Date(endDateTime).toISOString() },
    },
  })

  return response.data
}

export async function atualizarEventoAgenda(id, calendarId = 'primary', payload = {}) {
  const { summary, description, location, startDateTime, endDateTime } = payload
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

  const response = await calendar.events.update({
    calendarId,
    eventId: id,
    requestBody: {
      summary,
      description,
      location,
      start: { dateTime: new Date(startDateTime).toISOString() },
      end: { dateTime: new Date(endDateTime).toISOString() },
    },
  })

  return response.data
}

export async function deletarEventoAgenda(id, calendarId = 'primary') {
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
  await calendar.events.delete({
    calendarId,
    eventId: id,
  })
}
