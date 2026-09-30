import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import agendaRouter from './routes/agenda.js'
import cartoesRouter from './routes/cartoes.js'
import gastosRouter from './routes/gastos.js'
import imoveisRoutes from './routes/imoveis.js'
import mercadoRouter from './routes/mercado.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Rotas principais
app.use('/api/imoveis', imoveisRoutes)

// Rotas de Gastos
app.use('/api/gastos', gastosRouter)

// Rotas de Cartões
app.use('/api/cartoes', cartoesRouter)

// Rotas de Agenda
app.use('/api/agenda', agendaRouter)

// Rotas de Mercado
app.use('/api/mercado', mercadoRouter)

// Rota de Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend rodando perfeitamente!' })
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando em http://192.168.100.23:${PORT}`)
})
