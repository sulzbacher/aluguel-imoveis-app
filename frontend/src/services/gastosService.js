import api from './api'

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

//Rotas pagamentos
export const getHistoricoGastosMes = async mesAno => {
  const res = await api.get(`/gastos/historico/${mesAno}`)
  return res.data
}

export const toggleMarcarPago = async dados => {
  const res = await api.post('/gastos/historico/marcar-pago', dados)
  return res.data
}
