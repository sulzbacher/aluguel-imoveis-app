import express from 'express'
import {
  lerDadosCartoes,
  salvarDadosCartoes,
  sincronizarComGastosMensais,
} from '../services/cartoes/cartoesService.js'

const router = express.Router()

// GET: Retorna cartões, compras e resumo de faturas/limite usado
router.get('/', (req, res) => {
  const data = lerDadosCartoes()

  // Processa a fatura de cada cartão e o limite disponível
  const cartoesComFatura = data.cartoes.map(cartao => {
    const comprasDoCartao = data.compras.filter(c => c.cartao_id === cartao.id)

    // Fatura mensal atual (Soma das parcelas ativas + assinaturas)
    const faturaAtual = comprasDoCartao.reduce((acc, c) => acc + Number(c.valor_parcela || 0), 0)

    // Total comprometido das compras parceladas no limite
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

  const cartao = data.cartoes.find(c => c.id === id)
  if (cartao) {
    cartao.limite = Number(limite || 0)
    salvarDadosCartoes(data)
  }

  res.json({ message: 'Limite atualizado com sucesso!' })
})

// POST: Adicionar nova compra / assinatura parcelada
router.post('/compra', (req, res) => {
  const { cartao_id, descricao, categoria, valor_total, parcelas_totais, tipo, valor_parcela } = req.body
  const data = lerDadosCartoes()

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

  data.compras.push(novaCompra)
  salvarDadosCartoes(data)

  // Sincroniza faturas com a planilha de gastos
  sincronizarComGastosMensais()

  res.status(201).json(novaCompra)
})

// DELETE: Remover uma compra do cartão
router.delete('/compra/:id', (req, res) => {
  const { id } = req.params
  const data = lerDadosCartoes()

  data.compras = data.compras.filter(c => c.id !== id)
  salvarDadosCartoes(data)

  sincronizarComGastosMensais()
  res.json({ message: 'Compra removida com sucesso!' })
})

export default router
