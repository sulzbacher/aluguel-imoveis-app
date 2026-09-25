import axios from 'axios'

const api = axios.create({
  baseURL: 'http://192.168.100.23:3001/api',
})

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

export default api
