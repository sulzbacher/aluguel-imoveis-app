import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dataPath = path.join(__dirname, '../../data/dieta_mercado.json')

function lerDados() {
  try {
    if (fs.existsSync(dataPath)) {
      return JSON.parse(fs.readFileSync(dataPath, 'utf8'))
    }
  } catch (err) {
    console.error('Erro ao ler dieta_mercado.json:', err)
  }
  return { alimentos_base: [], receitas: [], cardapio_semanal: { dias: {} }, lista_mercado: [] }
}

function salvarDados(dados) {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(dados, null, 2), 'utf8')
  } catch (err) {
    console.error('Erro ao salvar dieta_mercado.json:', err)
  }
}

// 1. GET: Retorna o estado completo da dieta e mercado
router.get('/', (req, res) => {
  const dados = lerDados()
  res.json(dados)
})

// 2. POST: Cadastrar Alimento Base (Tabela de Macros por 100g)
router.post('/alimentos', (req, res) => {
  const dados = lerDados()
  const { nome, categoria, proteina_100g, carbo_100g, gordura_100g, calorias_100g, preco_unidade, unidade } = req.body

  const novoAlimento = {
    id: `ali_${Date.now()}`,
    nome: nome || 'Novo Alimento',
    categoria: categoria || 'Geral',
    proteina_100g: Number(proteina_100g || 0),
    carbo_100g: Number(carbo_100g || 0),
    gordura_100g: Number(gordura_100g || 0),
    calorias_100g: Number(calorias_100g || 0),
    preco_unidade: Number(preco_unidade || 0),
    unidade: unidade || 'kg',
  }

  dados.alimentos_base.push(novoAlimento)
  salvarDados(dados)
  res.status(201).json(novoAlimento)
})

// 3. POST: Criar Receita / Preparação
router.post('/receitas', (req, res) => {
  const dados = lerDados()
  const { nome, categoria, porcoes, ingredientes } = req.body

  const novaReceita = {
    id: `rec_${Date.now()}`,
    nome: nome || 'Nova Receita',
    categoria: categoria || 'Geral',
    porcoes: Number(porcoes || 1),
    ingredientes: ingredientes || [], // [{ alimento_id, gramas }]
  }

  dados.receitas.push(novaReceita)
  salvarDados(dados)
  res.status(201).json(novaReceita)
})

// 4. POST: Gerar Lista de Mercado Automática a partir do Cardápio Semanal
router.post('/gerar-lista-mercado', (req, res) => {
  const dados = lerDados()
  const acumuladorIngredientes = {} // { alimento_id: total_gramas }

  const cardapio = dados.cardapio_semanal?.dias || {}

  // Percorre cada dia do cardápio e acumula as gramas necessárias
  Object.values(cardapio).forEach(dia => {
    const receitasDia = [...(dia.carol || []), ...(dia.neno || [])]
    receitasDia.forEach(recId => {
      const receita = dados.receitas.find(r => r.id === recId)
      if (receita) {
        receita.ingredientes.forEach(ing => {
          acumuladorIngredientes[ing.alimento_id] =
            (acumuladorIngredientes[ing.alimento_id] || 0) + Number(ing.gramas || 0)
        })
      }
    })
  })

  // Converte as gramas acumuladas na nova lista de compras
  const novaLista = Object.entries(acumuladorIngredientes).map(([alimentoId, totalGramas]) => {
    const alimento = dados.alimentos_base.find(a => a.id === alimentoId)
    const qtdFormatada = alimento?.unidade === 'kg' ? totalGramas / 1000 : totalGramas
    const custoEst = qtdFormatada * Number(alimento?.preco_unidade || 0)

    return {
      id: `item_mer_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      alimento_id: alimentoId,
      nome: alimento ? alimento.nome : 'Item Desconhecido',
      quantidade: parseFloat(qtdFormatada.toFixed(2)),
      unidade: alimento ? alimento.unidade : 'un',
      custo_estimado: parseFloat(custoEst.toFixed(2)),
      no_carrinho: false,
    }
  })

  dados.lista_mercado = novaLista
  salvarDados(dados)
  res.json({ message: 'Lista de mercado gerada com sucesso!', lista_mercado: novaLista })
})

// 5. PATCH: Alternar item no carrinho de compras
router.patch('/lista-mercado/:id/carrinho', (req, res) => {
  const dados = lerDados()
  const { id } = req.params
  const { no_carrinho } = req.body

  const item = dados.lista_mercado.find(i => i.id === id)
  if (item) {
    item.no_carrinho = Boolean(no_carrinho)
    salvarDados(dados)
    return res.json(item)
  }

  res.status(404).json({ message: 'Item não encontrado na lista.' })
})

export default router
