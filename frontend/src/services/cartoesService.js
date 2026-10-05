import { apiRequest } from './api.js'

export const getCartoes = () => apiRequest({ method: 'get', url: '/cartoes' })

export const updateLimiteCartao = (cartaoId, limite) =>
  apiRequest({ method: 'put', url: `/cartoes/${cartaoId}/limite`, data: { limite } })

export const createCompra = compraData => apiRequest({ method: 'post', url: '/cartoes/compra', data: compraData })

export const deleteCompra = id => apiRequest({ method: 'delete', url: `/cartoes/compra/${id}` })
