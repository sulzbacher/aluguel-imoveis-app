import axios from 'axios'

const api = axios.create({
  baseURL: 'http://192.168.100.23:3001/api',
})

export const apiRequest = async ({ method = 'get', url = '', data = undefined, params = undefined }) => {
  try {
    const response = await api.request({ method, url, data, params })
    return response.data
  } catch (error) {
    const message =
      error?.response?.data?.message || error?.response?.data?.error || error.message || 'Erro na requisição.'
    throw new Error(message)
  }
}

export default api
