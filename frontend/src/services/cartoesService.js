import { apiRequest } from './api.js'

export const getCartoes = mes => apiRequest({ method: 'get', url: '/cartoes', params: mes ? { mes } : undefined })

export const updateLimiteCartao = (cartaoId, limite) =>
  apiRequest({ method: 'put', url: `/cartoes/${cartaoId}/limite`, data: { limite } })

export const createCompra = compraData => apiRequest({ method: 'post', url: '/cartoes/compra', data: compraData })

export const deleteCompra = (id, mes) =>
  apiRequest({ method: 'delete', url: `/cartoes/compra/${id}`, params: mes ? { mes } : undefined })
