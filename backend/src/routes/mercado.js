import express from 'express'
import {
  alternarItemCarrinho,
  criarAlimentoBase,
  criarReceita,
  gerarListaMercado,
  getDadosMercado,
} from '../services/mercado/mercadoService.js'

const router = express.Router()

router.get('/', (req, res) => {
  res.json(getDadosMercado())
})

router.post('/alimentos', (req, res) => {
  const novoAlimento = criarAlimentoBase(req.body)
  res.status(201).json(novoAlimento)
})

router.post('/receitas', (req, res) => {
  const novaReceita = criarReceita(req.body)
  res.status(201).json(novaReceita)
})

router.post('/gerar-lista-mercado', (req, res) => {
  const listaMercado = gerarListaMercado()
  res.json({ message: 'Lista de mercado gerada com sucesso!', lista_mercado: listaMercado })
})

router.patch('/lista-mercado/:id/carrinho', (req, res) => {
  const { id } = req.params
  const { no_carrinho } = req.body
  const item = alternarItemCarrinho(id, no_carrinho)

  if (!item) {
    return res.status(404).json({ message: 'Item não encontrado na lista.' })
  }

  return res.json(item)
})

export default router
