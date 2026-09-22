import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import imoveisRoutes from './routes/imoveis.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Rotas principais
app.use('/api/imoveis', imoveisRoutes)

// Rota de Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend rodando perfeitamente!' })
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando em http://localhost:${PORT}`)
})
