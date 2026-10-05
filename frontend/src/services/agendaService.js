import { apiRequest } from './api.js'

export const getAuthUrlGoogle = () => apiRequest({ method: 'get', url: '/agenda/auth-url' })

export const getCalendariosAgenda = () => apiRequest({ method: 'get', url: '/agenda/calendarios' })

export const getEventosAgenda = (calendarId = 'primary') =>
  apiRequest({ method: 'get', url: '/agenda/eventos', params: { calendarId } })

export const createEventoAgenda = evento => apiRequest({ method: 'post', url: '/agenda/eventos', data: evento })

export const updateEventoAgenda = (id, evento, calendarId = 'primary') =>
  apiRequest({ method: 'put', url: `/agenda/eventos/${id}`, data: { ...evento, calendarId }, params: { calendarId } })

export const deleteEventoAgenda = (id, calendarId = 'primary') =>
  apiRequest({ method: 'delete', url: `/agenda/eventos/${id}`, params: { calendarId } })
