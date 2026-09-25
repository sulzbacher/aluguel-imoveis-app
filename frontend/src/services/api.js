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
export const getGastos = async () => {
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

export default api
