import { apiRequest } from './api.js'

export const getMetasECofres = () => apiRequest({ method: 'get', url: '/metas' })

export const createCaixinha = caixinha => apiRequest({ method: 'post', url: '/metas', data: caixinha })

export const realizarAporteCaixinha = (id, dadosAporte) =>
  apiRequest({ method: 'post', url: `/metas/${id}/aporte`, data: dadosAporte })

export const deleteCaixinha = id => apiRequest({ method: 'delete', url: `/metas/${id}` })
