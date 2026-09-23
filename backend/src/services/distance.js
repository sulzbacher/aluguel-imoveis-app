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
 * Calcula a distância em Quilômetros entre dois pontos geográficos
 * utilizando a Fórmula de Haversine (linha reta).
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
 * Estima a distância real de rodagem (de carro) e o tempo em minutos.
 * Corrige a distância em linha reta (Haversine) aplicando o fator de malha viária (~1.18x)
 * e usa velocidades médias dinâmicas dependendo se o trajeto é urbano ou de via expressa/BR.
 */
export function estimarTrajetoCarro(distanciaLinhaRetaKm) {
  if (!distanciaLinhaRetaKm || distanciaLinhaRetaKm <= 0) {
    return { km: 0, tempo_min: 0 }
  }

  // 1. Converte distância em linha reta para trajeto real aproximado de rua/estrada (+18%)
  const kmRodado = parseFloat((distanciaLinhaRetaKm * 1.18).toFixed(1))

  // 2. Define velocidade média realista conforme a distância:
  // - Curtas distâncias (< 6 km): Trânsito estritamente urbano (~26 km/h)
  // - Médias distâncias (6 a 12 km): Misto de bairro e avenidas (~38 km/h)
  // - Longas distâncias (> 12 km): Vias expressas / BR-116 / BR-448 (~60 km/h)
  let velocidadeMediaKmH = 26

  if (kmRodado > 12) {
    velocidadeMediaKmH = 60 // Tráfego de rodovia/via rápida (BR-116/Castelo Branco)
  } else if (kmRodado >= 6) {
    velocidadeMediaKmH = 38 // Avenidas de fluxo rápido (Ex: Ipiranga, Bento, Carlos Gomes)
  }

  // 3. Calcula o tempo estimado em minutos
  const tempoMinutos = Math.round((kmRodado / velocidadeMediaKmH) * 60)

  return {
    km: kmRodado,
    tempo_min: Math.max(3, tempoMinutos), // Mínimo de 3 minutos
  }
}

/**
 * Calcula todas as distâncias e tempos estimados de trajeto
 * para os locais de interesse do casal.
 */
export function calcularDistanciasImovel(lat, lng) {
  const distDivinaLinhaReta = calcularDistanciaKM(
    lat,
    lng,
    PONTOS_DE_INTERESSE.DIVINA_COMEDIA.lat,
    PONTOS_DE_INTERESSE.DIVINA_COMEDIA.lng
  )

  const distMandyLinhaReta = calcularDistanciaKM(
    lat,
    lng,
    PONTOS_DE_INTERESSE.MANDY_STUDIO.lat,
    PONTOS_DE_INTERESSE.MANDY_STUDIO.lng
  )

  const distAndressaLinhaReta = calcularDistanciaKM(
    lat,
    lng,
    PONTOS_DE_INTERESSE.CASA_ANDRESSA_LUCAS.lat,
    PONTOS_DE_INTERESSE.CASA_ANDRESSA_LUCAS.lng
  )

  const distAeroLinhaReta = calcularDistanciaKM(
    lat,
    lng,
    PONTOS_DE_INTERESSE.AEROPORTO.lat,
    PONTOS_DE_INTERESSE.AEROPORTO.lng
  )

  return {
    divina_comedia: estimarTrajetoCarro(distDivinaLinhaReta),
    mandy_studio: estimarTrajetoCarro(distMandyLinhaReta),
    andressa_lucas: estimarTrajetoCarro(distAndressaLinhaReta),
    aeroporto: estimarTrajetoCarro(distAeroLinhaReta),
  }
}
