import express from 'express'
import { lerDadosCartoes, lerComprasDoMes, salvarComprasDoMes, salvarDadosCartoes, sincronizarComGastosMensais } from '../services/cartoes/cartoesService.js'

const router = express.Router()

// GET: Retorna cartões, compras e resumo de faturas/limite usado
router.get('/', (req, res) => {
  const data = lerDadosCartoes()
  const cartoes = Array.isArray(data?.cartoes) ? data.cartoes : []
  const compras = lerComprasDoMes()

  const cartoesComFatura = cartoes.map(cartao => {
    const comprasDoCartao = compras.filter(c => c.cartao_id === cartao.id)

    const faturaAtual = comprasDoCartao.reduce((acc, c) => acc + Number(c.valor_parcela || 0), 0)

    const limiteComprometido = comprasDoCartao.reduce((acc, c) => {
      if (c.tipo === 'Parcelado') {
        const parcelasRestantes = Number(c.parcelas_totais) - Number(c.parcela_atual) + 1
        return acc + parcelasRestantes * Number(c.valor_parcela || 0)
      }
      return acc + Number(c.valor_parcela || 0)
    }, 0)

    const limiteDisponivel = Math.max(0, Number(cartao.limite || 0) - limiteComprometido)

    return {
      ...cartao,
      faturaAtual: parseFloat(faturaAtual.toFixed(2)),
      limiteComprometido: parseFloat(limiteComprometido.toFixed(2)),
      limiteDisponivel: parseFloat(limiteDisponivel.toFixed(2)),
      compras: comprasDoCartao,
    }
  })

  const totalFaturasGeral = cartoesComFatura.reduce((acc, c) => acc + c.faturaAtual, 0)

  res.json({
    cartoes: cartoesComFatura,
    totalFaturasGeral: parseFloat(totalFaturasGeral.toFixed(2)),
  })
})

// POST: Atualizar limite de um cartão
router.put('/:id/limite', (req, res) => {
  const { id } = req.params
  const { limite } = req.body
  const data = lerDadosCartoes()

  const cartao = (data.cartoes || []).find(c => c.id === id)
  if (cartao) {
    cartao.limite = Number(limite || 0)
    salvarDadosCartoes(data)
  }

  res.json({ message: 'Limite atualizado com sucesso!' })
})

// POST: Adicionar nova compra / assinatura parcelada
router.post('/compra', (req, res) => {
  const { cartao_id, descricao, categoria, valor_total, parcelas_totais, tipo, valor_parcela } = req.body
  const compras = lerComprasDoMes()

  const numParcelas = Number(parcelas_totais || 1)
  const total = Number(valor_total || 0)
  const vParcela = valor_parcela ? Number(valor_parcela) : Math.round((total / numParcelas) * 100) / 100

  const novaCompra = {
    id: `cmp_${Date.now()}`,
    cartao_id,
    descricao: descricao || 'Compra no Cartão',
    categoria: categoria || 'Geral',
    valor_total: total,
    parcelas_totais: numParcelas,
    parcela_atual: 1,
    valor_parcela: vParcela,
    tipo: tipo || 'Parcelado',
  }

  compras.push(novaCompra)
  salvarComprasDoMes(compras)

  sincronizarComGastosMensais()

  res.status(201).json(novaCompra)
})

// DELETE: Remover uma compra do cartão
router.delete('/compra/:id', (req, res) => {
  const { id } = req.params
  const compras = lerComprasDoMes().filter(c => c.id !== id)

  salvarComprasDoMes(compras)

  sincronizarComGastosMensais()
  res.json({ message: 'Compra removida com sucesso!' })
})

export default router
