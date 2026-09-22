import * as turf from '@turf/turf'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const geojsonPath = path.join(__dirname, '../../data/mancha_enchentes.geojson')

let geojsonEnchentes = null

// Carrega o arquivo GeoJSON para memória na inicialização do serviço
function carregarGeoJSON() {
  try {
    if (fs.existsSync(geojsonPath)) {
      const rawData = fs.readFileSync(geojsonPath, 'utf8')
      geojsonEnchentes = JSON.parse(rawData)
    }
  } catch (error) {
    console.warn('Aviso [enchente.js]: Não foi possível ler o arquivo mancha_enchentes.geojson.')
  }
}

carregarGeoJSON()

/**
 * Verifica se um par de coordenadas (lat, lng) está localizado dentro
 * de alguma área de inundação/mancha de enchente do arquivo GeoJSON.
 */
export function verificarRiscoEnchente(lat, lng) {
  if (!lat || !lng) return false

  if (!geojsonEnchentes || !geojsonEnchentes.features || geojsonEnchentes.features.length === 0) {
    return false
  }

  try {
    // No GeoJSON e Turf.js a ordem é sempre [Longitude, Latitude]
    const ponto = turf.point([lng, lat])

    for (const feature of geojsonEnchentes.features) {
      if (turf.booleanPointInPolygon(ponto, feature)) {
        return true // Imóvel está dentro do polígono de enchente!
      }
    }
  } catch (err) {
    console.error('Erro ao verificar interseção geográfica:', err.message)
  }

  return false
}
