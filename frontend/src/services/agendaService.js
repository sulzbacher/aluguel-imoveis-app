import api from './api'

//Rotas Agenda
export const getAuthUrlGoogle = async () => {
  const res = await api.get('/agenda/auth-url')
  return res.data
}

export const getCalendariosAgenda = async () => {
  const res = await api.get('/agenda/calendarios')
  return res.data
}

export const getEventosAgenda = async (calendarId = 'primary') => {
  const res = await api.get(`/agenda/eventos?calendarId=${encodeURIComponent(calendarId)}`)
  return res.data
}

export const createEventoAgenda = async evento => {
  const res = await api.post('/agenda/eventos', evento)
  return res.data
}

export const updateEventoAgenda = async (id, evento) => {
  const res = await api.put(`/agenda/eventos/${id}`, evento)
  return res.data
}

export const deleteEventoAgenda = async (id, calendarId = 'primary') => {
  const res = await api.delete(`/agenda/eventos/${id}?calendarId=${encodeURIComponent(calendarId)}`)
  return res.data
}
