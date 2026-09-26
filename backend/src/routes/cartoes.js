import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const cartoesPath = path.join(__dirname, '../../data/cartoes_credito.json')
const gastosPath = path.join(__dirname, '../../data/gastos_mensais.json')

function lerJSON(caminho, padrao) {
  try {
    if (fs.existsSync(caminho)) {
      return JSON.parse(fs.readFileSync(caminho, 'utf8'))
    }
  } catch (err) {
    console.error(`Erro ao ler ${caminho}:`, err)
  }
  return padrao
}

function salvarJSON(caminho, dados) {
  try {
    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2), 'utf8')
  } catch (err) {
    console.error(`Erro ao salvar ${caminho}:`, err)
  }
}

// GET: Retorna cartões, compras e resumo de faturas/limite usado
router.get('/', (req, res) => {
  const data = lerJSON(cartoesPath, { cartoes: [], compras: [] })

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
  const data = lerJSON(cartoesPath, { cartoes: [], compras: [] })

  const cartao = data.cartoes.find(c => c.id === id)
  if (cartao) {
    cartao.limite = Number(limite || 0)
    salvarJSON(cartoesPath, data)
  }

  res.json({ message: 'Limite atualizado com sucesso!' })
})

// POST: Adicionar nova compra / assinatura parcelada
router.post('/compra', (req, res) => {
  const { cartao_id, descricao, categoria, valor_total, parcelas_totais, tipo, valor_parcela } = req.body
  const data = lerJSON(cartoesPath, { cartoes: [], compras: [] })

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
  salvarJSON(cartoesPath, data)

  // Sincroniza faturas com a planilha de gastos
  sincronizarComGastosMensais()

  res.status(201).json(novaCompra)
})

// DELETE: Remover uma compra do cartão
router.delete('/compra/:id', (req, res) => {
  const { id } = req.params
  const data = lerJSON(cartoesPath, { cartoes: [], compras: [] })

  data.compras = data.compras.filter(c => c.id !== id)
  salvarJSON(cartoesPath, data)

  sincronizarComGastosMensais()
  res.json({ message: 'Compra removida com sucesso!' })
})

// Função auxiliar: Sincroniza a fatura dos cartões com o gastos_mensais.json
function sincronizarComGastosMensais() {
  const dataCartoes = lerJSON(cartoesPath, { cartoes: [], compras: [] })
  const gastos = lerJSON(gastosPath, [])

  // Calcula fatura atual de cada cartão
  const faturaCaixa = dataCartoes.compras
    .filter(c => c.cartao_id === 'cartao_caixa_mulher')
    .reduce((a, b) => a + Number(b.valor_parcela || 0), 0)

  const faturaNeon = dataCartoes.compras
    .filter(c => c.cartao_id === 'cartao_neon_neno')
    .reduce((a, b) => a + Number(b.valor_parcela || 0), 0)

  const faturaNubank = dataCartoes.compras
    .filter(c => c.cartao_id === 'cartao_nubank_neno')
    .reduce((a, b) => a + Number(b.valor_parcela || 0), 0)

  // Atualiza no gastos_mensais.json se o item existir
  const gCaixa = gastos.find(g => /caixa mulher/i.test(g.descricao))
  if (gCaixa) gCaixa.valor = faturaCaixa

  const gNeon = gastos.find(g => /neon/i.test(g.descricao))
  if (gNeon) gNeon.valor = faturaNeon

  const gNubank = gastos.find(g => /nubank/i.test(g.descricao))
  if (gNubank) gNubank.valor = faturaNubank

  salvarJSON(gastosPath, gastos)
}

export default router
