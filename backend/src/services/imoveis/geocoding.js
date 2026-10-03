import axios from 'axios'
import { calcularDistanciasImovel } from './distance.js'
import { verificarRiscoEnchente } from './enchente.js'

/**
 * Limpa o texto do endereço removendo traços, complementos e abreviações
 */
function limparEndereco(texto) {
  if (!texto) return ''

  return texto
    .replace(/\bR\.\b/gi, 'Rua')
    .replace(/\bAv\.\b/gi, 'Avenida')
    .replace(/\bTv\.\b/gi, 'Travessa')
    .replace(/-/g, ',') // Substitui hífens por vírgulas para separar trechos
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Tenta buscar coordenadas no Nominatim em múltiplos níveis de fallback.
 */
async function buscarCoordenadasNominatim(enderecoOriginal) {
  const limpo = limparEndereco(enderecoOriginal)
  const partes = limpo
    .split(',')
    .map(p => p.trim())
    .filter(Boolean)

  // Identifica a cidade no texto (ex: Esteio, Porto Alegre, Gravatai, Canoas)
  // Se não encontrar, assume a cidade que estiver no final ou 'Esteio'
  let cidade = 'Esteio'
  if (/esteio/i.test(enderecoOriginal)) cidade = 'Esteio'
  else if (/porto alegre/i.test(enderecoOriginal)) cidade = 'Porto Alegre'
  else if (/gravata/i.test(enderecoOriginal)) cidade = 'Gravataí'
  else if (/canoas/i.test(enderecoOriginal)) cidade = 'Canoas'
  else if (partes.length >= 2) cidade = partes[partes.length - 2]

  const rua = partes[0] ? partes[0].replace(/\d+/g, '').trim() : ''
  const numero = partes.find(p => /^\d+$/.test(p)) || ''

  // Monta tentativas OBRIGATORIAMENTE amarradas à cidade correta
  const tentativas = []

  if (rua) {
    if (numero) {
      tentativas.push(`${rua}, ${numero}, ${cidade}, RS`)
    }
    tentativas.push(`${rua}, ${cidade}, RS`)
  }
  tentativas.push(`${limpo}`)

  const queriesUnicas = [...new Set(tentativas)]

  for (const query of queriesUnicas) {
    try {
      console.log(`[Geocoding] Tentando buscar: "${query}"...`)
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: query,
          format: 'json',
          limit: 1,
          countrycodes: 'br',
        },
        headers: {
          'User-Agent': 'AluguelImoveisApp/1.0',
        },
      })

      if (response.data && response.data.length > 0) {
        console.log(`[Geocoding] Sucesso para "${query}": lat ${response.data[0].lat}, lon ${response.data[0].lon}`)
        return {
          lat: parseFloat(response.data[0].lat),
          lng: parseFloat(response.data[0].lon),
        }
      }
    } catch (err) {
      console.error(`[Geocoding] Erro ao consultar "${query}":`, err.message)
    }
  }

  return null
}

export async function analisarEndereco(enderecoTexto) {
  const coords = await buscarCoordenadasNominatim(enderecoTexto)

  if (!coords) {
    console.warn(`[Geocoding] Não foi possível encontrar coordenadas para: "${enderecoTexto}"`)
    return {
      coordenadas: { lat: 0, lng: 0 },
      analise_geo: {
        divina_comedia: { km: 0, tempo_min: 0 },
        mandy_studio: { km: 0, tempo_min: 0 },
        andressa_lucas: { km: 0, tempo_min: 0 },
        aeroporto: { km: 0, tempo_min: 0 },
        em_zona_enchente_2024: false,
      },
    }
  }

  const { lat, lng } = coords

  // Cross-reference com o mapa de enchentes
  const emZonaEnchente = verificarRiscoEnchente(lat, lng)

  // Cálculo das distâncias e tempos estimados
  const distancias = calcularDistanciasImovel(lat, lng)

  return {
    coordenadas: { lat, lng },
    analise_geo: {
      ...distancias,
      em_zona_enchente_2024: emZonaEnchente,
    },
  }
}
