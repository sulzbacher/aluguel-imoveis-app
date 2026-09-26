import axios from 'axios'

const api = axios.create({
  baseURL: 'http://192.168.100.23:3001/api',
})

// Rotas de Imóveis
export const getImoveis = async () => {
  const res = await api.get('/imoveis')
  return res.data
}

export const getImovel = async id => {
  const res = await api.get(`/imoveis/${id}`)
  return res.data
}

export const createImovel = async data => {
  const res = await api.post('/imoveis', data)
  return res.data
}

export const updateImovel = async (id, data) => {
  const res = await api.put(`/imoveis/${id}`, data)
  return res.data
}

export const deleteImovel = async id => {
  const res = await api.delete(`/imoveis/${id}`)
  return res.data
}

export const reavaliarImovel = async id => {
  const res = await api.post(`/imoveis/${id}/reavaliar`)
  return res.data
}

export const reavaliarTodosImoveis = async () => {
  const res = await api.post('/imoveis/reavaliar-todos')
  return res.data
}

// Rotas de Gastos
export const getGastosERendas = async () => {
  const res = await api.get('/gastos')
  return res.data
}

export const createGasto = async gastoData => {
  const res = await api.post('/gastos', gastoData)
  return res.data
}

export const deleteGasto = async id => {
  const res = await api.delete(`/gastos/${id}`)
  return res.data
}

export const createRenda = async (pessoa, rendaData) => {
  const res = await api.post(`/gastos/renda/${pessoa}`, rendaData)
  return res.data
}

export const deleteRenda = async (pessoa, id) => {
  const res = await api.delete(`/gastos/renda/${pessoa}/${id}`)
  return res.data
}

// Rotas de Cartões
export const getCartoes = async () => {
  const res = await api.get('/cartoes')
  return res.data
}

export const updateLimiteCartao = async (cartaoId, limite) => {
  const res = await api.put(`/cartoes/${cartaoId}/limite`, { limite })
  return res.data
}

export const createCompra = async compraData => {
  const res = await api.post('/cartoes/compra', compraData)
  return res.data
}

export const deleteCompra = async id => {
  const res = await api.delete(`/cartoes/compra/${id}`)
  return res.data
}

export default api
