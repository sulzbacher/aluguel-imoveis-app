import api from './api'

export const getMetasECofres = async () => {
  const res = await api.get('/metas')
  return res.data
}

export const createCaixinha = async caixinha => {
  const res = await api.post('/metas', caixinha)
  return res.data
}

export const realizarAporteCaixinha = async (id, dadosAporte) => {
  const res = await api.post(`/metas/${id}/aporte`, dadosAporte)
  return res.data
}

export const deleteCaixinha = async id => {
  const res = await api.delete(`/metas/${id}`)
  return res.data
}
