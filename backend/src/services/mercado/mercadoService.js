import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataPath = path.join(__dirname, '../../../data/dieta_mercado.json')

export function lerDadosMercado() {
  try {
    if (fs.existsSync(dataPath)) {
      return JSON.parse(fs.readFileSync(dataPath, 'utf8'))
    }
  } catch (err) {
    console.error('Erro ao ler dieta_mercado.json:', err)
  }

  return { alimentos_base: [], receitas: [], cardapio_semanal: { dias: {} }, lista_mercado: [] }
}

export function salvarDadosMercado(dados) {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(dados, null, 2), 'utf8')
  } catch (err) {
    console.error('Erro ao salvar dieta_mercado.json:', err)
  }
}

export function getDadosMercado() {
  return lerDadosMercado()
}

export function criarAlimentoBase(payload = {}) {
  const dados = lerDadosMercado()
  const { nome, categoria, proteina_100g, carbo_100g, gordura_100g, calorias_100g, preco_unidade, unidade } = payload

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
  salvarDadosMercado(dados)

  return novoAlimento
}

export function criarReceita(payload = {}) {
  const dados = lerDadosMercado()
  const { nome, categoria, porcoes, ingredientes } = payload

  const novaReceita = {
    id: `rec_${Date.now()}`,
    nome: nome || 'Nova Receita',
    categoria: categoria || 'Geral',
    porcoes: Number(porcoes || 1),
    ingredientes: ingredientes || [],
  }

  dados.receitas.push(novaReceita)
  salvarDadosMercado(dados)

  return novaReceita
}

export function gerarListaMercado() {
  const dados = lerDadosMercado()
  const acumuladorIngredientes = {}
  const cardapio = dados.cardapio_semanal?.dias || {}

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
  salvarDadosMercado(dados)

  return novaLista
}

export function alternarItemCarrinho(id, no_carrinho) {
  const dados = lerDadosMercado()
  const item = dados.lista_mercado.find(i => i.id === id)

  if (!item) {
    return null
  }

  item.no_carrinho = Boolean(no_carrinho)
  salvarDadosMercado(dados)

  return item
}
