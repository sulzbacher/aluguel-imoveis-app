// Coordenadas fixas de referência
export const PONTOS_DE_INTERESSE = {
  DIVINA_COMEDIA: {
    nome: 'Bar Divina Comédia',
    lat: -30.0381,
    lng: -51.2222,
  },
  AEROPORTO: {
    nome: 'Aeroporto Salgado Filho',
    lat: -29.9939,
    lng: -51.1711,
  },
}

/**
 * Calcula a distância em Quilômetros entre dois pontos geográficos
 * utilizando a Fórmula de Haversine.
 */
export function calcularDistanciaKM(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0

  const R = 6371 // Raio da Terra em km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distancia = R * c

  return parseFloat(distancia.toFixed(1))
}

/**
 * Calcula todas as distâncias relevantes a partir das coordenadas do imóvel.
 */
export function calcularDistanciasImovel(lat, lng) {
  const distDivina = calcularDistanciaKM(
    lat,
    lng,
    PONTOS_DE_INTERESSE.DIVINA_COMEDIA.lat,
    PONTOS_DE_INTERESSE.DIVINA_COMEDIA.lng
  )

  const distAero = calcularDistanciaKM(lat, lng, PONTOS_DE_INTERESSE.AEROPORTO.lat, PONTOS_DE_INTERESSE.AEROPORTO.lng)

  return {
    distancia_divina_comedia_km: distDivina,
    distancia_aeroporto_km: distAero,
  }
}
