// Coordenadas fixas de referência
export const PONTOS_DE_INTERESSE = {
  DIVINA_COMEDIA: {
    nome: 'Bar Divina Comédia',
    lat: -30.0381,
    lng: -51.2222,
    peso: 0.3, // Frequência noturna alta
  },
  MANDY_STUDIO: {
    nome: 'Mandy Studio',
    endereco: 'Rua João Abbott, 503, Petrópolis, Porto Alegre',
    lat: -30.0375,
    lng: -51.1895,
    peso: 0.2,
  },
  CASA_ANDRESSA_LUCAS: {
    nome: 'Andressa & Lucas',
    endereco: 'Rua Jansen, 600, Gravataí',
    lat: -29.9405,
    lng: -50.998,
    peso: 0.1,
  },
  AEROPORTO: {
    nome: 'Aeroporto Salgado Filho',
    lat: -29.9939,
    lng: -51.1711,
    peso: 0.1,
  },
}

/**
 * Estima o tempo de deslocamento em minutos de carro.
 * Considera velocidade média urbana (~25 km/h) e rodoviária/metropolitana (~60 km/h).
 */
export function estimarTempoMinutos(distanciaKm, ehRegiaoMetropolitana = false) {
  const velocidadeMedia = ehRegiaoMetropolitana ? 55 : 28 // km/h
  const tempoHoras = distanciaKm / velocidadeMedia
  const tempoMinutos = Math.round(tempoHoras * 60)
  return Math.max(3, tempoMinutos) // Mínimo de 3 min
}

export function calcularDistanciasImovel(lat, lng) {
  const distDivina = calcularDistanciaKM(
    lat,
    lng,
    PONTOS_DE_INTERESSE.DIVINA_COMEDIA.lat,
    PONTOS_DE_INTERESSE.DIVINA_COMEDIA.lng
  )
  const distMandy = calcularDistanciaKM(
    lat,
    lng,
    PONTOS_DE_INTERESSE.MANDY_STUDIO.lat,
    PONTOS_DE_INTERESSE.MANDY_STUDIO.lng
  )
  const distAndressa = calcularDistanciaKM(
    lat,
    lng,
    PONTOS_DE_INTERESSE.CASA_ANDRESSA_LUCAS.lat,
    PONTOS_DE_INTERESSE.CASA_ANDRESSA_LUCAS.lng
  )
  const distAero = calcularDistanciaKM(lat, lng, PONTOS_DE_INTERESSE.AEROPORTO.lat, PONTOS_DE_INTERESSE.AEROPORTO.lng)

  return {
    divina_comedia: { km: distDivina, tempo_min: estimarTempoMinutos(distDivina, false) },
    mandy_studio: { km: distMandy, tempo_min: estimarTempoMinutos(distMandy, false) },
    andressa_lucas: { km: distAndressa, tempo_min: estimarTempoMinutos(distAndressa, true) },
    aeroporto: { km: distAero, tempo_min: estimarTempoMinutos(distAero, true) },
  }
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
