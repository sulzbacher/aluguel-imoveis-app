import { Router } from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { analisarEndereco } from '../services/geocoding.js'
import { calcularScoreImovel } from '../services/score.js'

const router = Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataPath = path.join(__dirname, '../../data/imoveis.json')

// Função auxiliar para ler o JSON
function lerImoveis() {
  if (!fs.existsSync(dataPath)) return []
  const content = fs.readFileSync(dataPath, 'utf8')
  return JSON.parse(content || '[]')
}

// Função auxiliar para salvar o JSON
function salvarImoveis(imoveis) {
  fs.writeFileSync(dataPath, JSON.stringify(imoveis, null, 2), 'utf8')
}

// GET: Listar todos os imóveis ordenados pelo Score Final (Ranking)
router.get('/', (req, res) => {
  const imoveis = lerImoveis()
  const imoveisComScore = imoveis.map(imovel => {
    const scoreData = calcularScoreImovel(imovel)
    return { ...imovel, calculos: scoreData }
  })

  // Ordena da maior para a menor pontuação
  imoveisComScore.sort((a, b) => b.calculos.scoreFinal - a.calculos.scoreFinal)

  res.json(imoveisComScore)
})

// GET: Buscar um único imóvel pelo ID
router.get('/:id', (req, res) => {
  const imoveis = lerImoveis()
  const imovel = imoveis.find(i => i.id === req.params.id)

  if (!imovel) {
    return res.status(404).json({ message: 'Imóvel não encontrado.' })
  }

  const scoreData = calcularScoreImovel(imovel)
  res.json({ ...imovel, calculos: scoreData })
})

// POST: Cadastrar novo imóvel
router.post('/', async (req, res) => {
  try {
    const body = req.body
    const imoveis = lerImoveis()

    // Faz geocodificação e análise do mapa de enchentes
    const geoInfo = await analisarEndereco(body.endereco || '')

    const novoImovel = {
      id: `imovel_${Date.now()}`,
      titulo: body.titulo || 'Novo Imóvel',
      endereco: body.endereco || '',
      link: body.link || '',
      coordenadas: geoInfo.coordenadas,
      financeiro: {
        aluguel: Number(body.financeiro?.aluguel || 0),
        condominio: Number(body.financeiro?.condominio || 0),
        iptu: Number(body.financeiro?.iptu || 0),
      },
      estrutura: {
        quartos: Number(body.estrutura?.quartos || 0),
        metro_quadrado: Number(body.estrutura?.metro_quadrado || 0),
        vagas_garagem: Number(body.estrutura?.vagas_garagem || 0),
        facil_telar_gatos: Boolean(body.estrutura?.facil_telar_gatos),
        quintal_fundos: Boolean(body.estrutura?.quintal_fundos),
      },
      analise_geo: geoInfo.analise_geo,
      avaliacoes_pessoais: {
        caroline: {
          observacoes: body.avaliacoes_pessoais?.caroline?.observacoes || '',
          bonus_manual: Number(body.avaliacoes_pessoais?.caroline?.bonus_manual || 0),
        },
        neno: {
          observacoes: body.avaliacoes_pessoais?.neno?.observacoes || '',
          bonus_manual: Number(body.avaliacoes_pessoais?.neno?.bonus_manual || 0),
        },
      },
    }

    imoveis.push(novoImovel)
    salvarImoveis(imoveis)

    const scoreData = calcularScoreImovel(novoImovel)
    res.status(201).json({ ...novoImovel, calculos: scoreData })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cadastrar imóvel', error: error.message })
  }
})

// PUT: Atualizar observações, bônus e dados do imóvel
router.put('/:id', (req, res) => {
  const imoveis = lerImoveis()
  const index = imoveis.findIndex(i => i.id === req.params.id)

  if (index === -1) {
    return res.status(404).json({ message: 'Imóvel não encontrado.' })
  }

  const imovelAtual = imoveis[index]
  const body = req.body

  const imovelAtualizado = {
    ...imovelAtual,
    ...body,
    avaliacoes_pessoais: {
      caroline: {
        observacoes:
          body.avaliacoes_pessoais?.caroline?.observacoes ??
          imovelAtual.avaliacoes_pessoais?.caroline?.observacoes ??
          '',
        bonus_manual: Number(
          body.avaliacoes_pessoais?.caroline?.bonus_manual ??
            imovelAtual.avaliacoes_pessoais?.caroline?.bonus_manual ??
            0
        ),
      },
      neno: {
        observacoes:
          body.avaliacoes_pessoais?.neno?.observacoes ?? imovelAtual.avaliacoes_pessoais?.neno?.observacoes ?? '',
        bonus_manual: Number(
          body.avaliacoes_pessoais?.neno?.bonus_manual ?? imovelAtual.avaliacoes_pessoais?.neno?.bonus_manual ?? 0
        ),
      },
    },
  }

  imoveis[index] = imovelAtualizado
  salvarImoveis(imoveis)

  const scoreData = calcularScoreImovel(imovelAtualizado)
  res.json({ ...imovelAtualizado, calculos: scoreData })
})

// DELETE: Remover imóvel
router.delete('/:id', (req, res) => {
  let imoveis = lerImoveis()
  imoveis = imoveis.filter(i => i.id !== req.params.id)
  salvarImoveis(imoveis)
  res.json({ message: 'Imóvel removido com sucesso.' })
})

// POST: Reavaliar / Recalcular imóvel existente (atualiza geocodificação, distâncias e scores)
router.post('/:id/reavaliar', async (req, res) => {
  try {
    const imoveis = lerImoveis()
    const index = imoveis.findIndex(i => i.id === req.params.id)

    if (index === -1) {
      return res.status(404).json({ message: 'Imóvel não encontrado.' })
    }

    const imovelAtual = imoveis[index]

    // Refaz análise geográfica (Geocoding + Distâncias + Enchente) com as regras mais recentes
    const geoInfo = await analisarEndereco(imovelAtual.endereco || '')

    const imovelReavaliado = {
      ...imovelAtual,
      coordenadas: geoInfo.coordenadas,
      analise_geo: geoInfo.analise_geo,
    }

    // Recalcula a pontuação
    const scoreData = calcularScoreImovel(imovelReavaliado)

    imoveis[index] = imovelReavaliado
    salvarImoveis(imoveis)

    res.json({ ...imovelReavaliado, calculos: scoreData })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao reavaliar imóvel', error: error.message })
  }
})

export default router
