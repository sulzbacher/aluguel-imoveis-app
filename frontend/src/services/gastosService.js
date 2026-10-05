import { apiRequest } from './api.js'

export const getGastosERendas = () => apiRequest({ method: 'get', url: '/gastos' })

export const createGasto = gastoData => apiRequest({ method: 'post', url: '/gastos', data: gastoData })

export const deleteGasto = id => apiRequest({ method: 'delete', url: `/gastos/${id}` })

export const createRenda = (pessoa, rendaData) =>
  apiRequest({ method: 'post', url: `/gastos/renda/${pessoa}`, data: rendaData })

export const deleteRenda = (pessoa, id) => apiRequest({ method: 'delete', url: `/gastos/renda/${pessoa}/${id}` })

export const getHistoricoGastosMes = mesAno => apiRequest({ method: 'get', url: `/gastos/historico/${mesAno}` })

export const toggleMarcarPago = dados =>
  apiRequest({ method: 'post', url: '/gastos/historico/marcar-pago', data: dados })
