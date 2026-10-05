import { apiRequest } from './api.js'

export const getImoveis = () => apiRequest({ method: 'get', url: '/imoveis' })

export const getImovel = id => apiRequest({ method: 'get', url: `/imoveis/${id}` })

export const createImovel = data => apiRequest({ method: 'post', url: '/imoveis', data })

export const updateImovel = (id, data) => apiRequest({ method: 'put', url: `/imoveis/${id}`, data })

export const deleteImovel = id => apiRequest({ method: 'delete', url: `/imoveis/${id}` })

export const reavaliarImovel = id => apiRequest({ method: 'post', url: `/imoveis/${id}/reavaliar` })

export const reavaliarTodosImoveis = () => apiRequest({ method: 'post', url: '/imoveis/reavaliar-todos' })
