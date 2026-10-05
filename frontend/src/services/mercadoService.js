import { apiRequest } from './api.js'

export const getDadosMercado = () => apiRequest({ method: 'get', url: '/mercado' })

export const createAlimentoBase = alimento => apiRequest({ method: 'post', url: '/mercado/alimentos', data: alimento })

export const createReceita = receita => apiRequest({ method: 'post', url: '/mercado/receitas', data: receita })

export const gerarListaMercadoAuto = () => apiRequest({ method: 'post', url: '/mercado/gerar-lista-mercado' })

export const toggleItemCarrinho = (id, no_carrinho) =>
  apiRequest({ method: 'patch', url: `/mercado/lista-mercado/${id}/carrinho`, data: { no_carrinho } })
