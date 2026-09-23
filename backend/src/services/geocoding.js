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

  // Extrai trechos separados por vírgula (Ex: ["Rua Padre Felipe", "1580", "Parque Amador", "Esteio", "RS"])
  const partes = limpo
    .split(',')
    .map(p => p.trim())
    .filter(Boolean)

  // Monta tentativas de query gradualmente mais genéricas
  const tentativas = []

  // 1. Tenta "Rua + Número + Cidade + Estado" (Descarta bairro/complementos no meio)
  if (partes.length >= 3) {
    const rua = partes[0]
    const numero = partes.find(p => /^\d+$/.test(p)) || ''
    const cidade = partes[partes.length - 2] || partes[partes.length - 1]
    const estado = 'RS'

    tentativas.push(`${rua} ${numero}, ${cidade}, ${estado}`)
    tentativas.push(`${rua}, ${cidade}, ${estado}`)
  }

  // 2. Tenta o texto limpo direto com vírgulas
  tentativas.push(limpo)

  // 3. Tenta apenas "Rua, Cidade" (Ex: "Rua Padre Felipe, Esteio")
  if (partes.length > 0) {
    tentativas.push(`${partes[0]}, Esteio, RS`)
  }

  // Remove duplicados da lista de tentativas
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
