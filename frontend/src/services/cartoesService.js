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
