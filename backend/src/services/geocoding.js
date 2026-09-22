import axios from 'axios'
import { calcularDistanciasImovel } from './distance.js'
import { verificarRiscoEnchente } from './enchente.js'

export async function analisarEndereco(enderecoTexto) {
  let lat = null
  let lng = null

  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: enderecoTexto,
        format: 'json',
        limit: 1,
      },
      headers: {
        'User-Agent': 'AluguelImoveisApp/1.0',
      },
    })

    if (response.data && response.data.length > 0) {
      lat = parseFloat(response.data[0].lat)
      lng = parseFloat(response.data[0].lon)
    }
  } catch (err) {
    console.error('Erro na geocodificação do endereço:', err.message)
  }

  if (!lat || !lng) {
    return {
      coordenadas: { lat: 0, lng: 0 },
      analise_geo: {
        distancia_divina_comedia_km: 0,
        distancia_aeroporto_km: 0,
        em_zona_enchente_2024: false,
      },
    }
  }

  // Cross-reference com o mapa de enchentes
  const emZonaEnchente = verificarRiscoEnchente(lat, lng)

  // Cálculo das distâncias
  const distancias = calcularDistanciasImovel(lat, lng)

  return {
    coordenadas: { lat, lng },
    analise_geo: {
      ...distancias,
      em_zona_enchente_2024: emZonaEnchente,
    },
  }
}
