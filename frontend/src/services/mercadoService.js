import { api } from './api'

export const getDadosMercado = async () => {
  const res = await api.get('/mercado')
  return res.data
}

export const createAlimentoBase = async alimento => {
  const res = await api.post('/mercado/alimentos', alimento)
  return res.data
}

export const createReceita = async receita => {
  const res = await api.post('/mercado/receitas', receita)
  return res.data
}

export const gerarListaMercadoAuto = async () => {
  const res = await api.post('/mercado/gerar-lista-mercado')
  return res.data
}

export const toggleItemCarrinho = async (id, no_carrinho) => {
  const res = await api.patch(`/mercado/lista-mercado/${id}/carrinho`, { no_carrinho })
  return res.data
}
