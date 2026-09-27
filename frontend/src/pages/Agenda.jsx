import { Calendar as CalendarIcon, Clock, Edit2, MapPin, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  createEventoAgenda,
  deleteEventoAgenda,
  getAuthUrlGoogle,
  getEventosAgenda,
  updateEventoAgenda,
} from '../services/api'

export function Agenda() {
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)
  const [conectado, setConectado] = useState(false)
  const [editandoId, setEditandoId] = useState(null)
  // No início do componente Agenda.jsx:
  const [calendarios, setCalendarios] = useState([])
  const [selectedCalendarId, setSelectedCalendarId] = useState('primary')

  useEffect(() => {
    carregarCalendarios()
  }, [])

  useEffect(() => {
    if (conectado) {
      carregarEventos(selectedCalendarId)
    }
  }, [selectedCalendarId])

  const carregarCalendarios = async () => {
    try {
      const list = await getCalendariosAgenda()
      setCalendarios(list)

      // Procura automaticamente pelo calendário do Leonardo Melo se existir na lista
      const calNeno = list.find(c => /leonardo/i.test(c.summary) || /melo/i.test(c.summary))
      if (calNeno) {
        setSelectedCalendarId(calNeno.id)
      }
      setConectado(true)
    } catch (err) {
      setConectado(false)
    } finally {
      setLoading(false)
    }
  }

  const carregarEventos = async calId => {
    setLoading(true)
    try {
      const data = await getEventosAgenda(calId)
      setEventos(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const [form, setForm] = useState({
    summary: '',
    description: '',
    location: '',
    startDateTime: '',
    endDateTime: '',
  })

  useEffect(() => {
    carregarEventos()
  }, [])

  const carregarEventos = async () => {
    setLoading(true)
    try {
      const data = await getEventosAgenda()
      setEventos(data)
      setConectado(true)
    } catch (err) {
      setConectado(false)
    } finally {
      setLoading(false)
    }
  }

  const handleConectarGoogle = async () => {
    const { url } = await getAuthUrlGoogle()
    window.location.href = url
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      if (editandoId) {
        await updateEventoAgenda(editandoId, form)
        setEditandoId(null)
      } else {
        await createEventoAgenda(form)
      }
      setForm({ summary: '', description: '', location: '', startDateTime: '', endDateTime: '' })
      carregarEventos()
    } catch (err) {
      alert(`Erro: ${err.message}`)
    }
  }

  const handleEditClick = evento => {
    setEditandoId(evento.id)
    setForm({
      summary: evento.summary || '',
      description: evento.description || '',
      location: evento.location || '',
      startDateTime: evento.start?.dateTime ? evento.start.dateTime.slice(0, 16) : '',
      endDateTime: evento.end?.dateTime ? evento.end.dateTime.slice(0, 16) : '',
    })
  }

  const handleDelete = async id => {
    if (confirm('Deletar este evento da agenda do Google?')) {
      await deleteEventoAgenda(id)
      carregarEventos()
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/40 p-6 rounded-2xl border border-slate-700/60">
        <div>
          <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-indigo-400" /> Agenda de Shows & Eventos
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Sincronização em tempo real com a conta do Google Agenda do Neno.
          </p>
        </div>

        {!conectado && (
          <button
            onClick={handleConectarGoogle}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/20"
          >
            Conectar Google Agenda
          </button>
        )}
      </div>

      {conectado ? (
        <>
          {/* Form Criar / Editar */}
          <form
            onSubmit={handleSubmit}
            className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl space-y-4"
          >
            <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-400" /> {editandoId ? 'Editar Evento' : 'Novo Evento / Show'}
            </h3>

            <div className="grid md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Título do Show / Compromisso"
                required
                value={form.summary}
                onChange={e => setForm({ ...form, summary: e.target.value })}
                className="bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 md:col-span-2"
              />
              <input
                type="text"
                placeholder="Local (Ex: Bar Opinião)"
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
                className="bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
              />
              <input
                type="datetime-local"
                required
                value={form.startDateTime}
                onChange={e => setForm({ ...form, startDateTime: e.target.value })}
                className="bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
              />
              <input
                type="datetime-local"
                required
                value={form.endDateTime}
                onChange={e => setForm({ ...form, endDateTime: e.target.value })}
                className="bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl p-2.5 transition"
              >
                {editandoId ? 'Salvar Alterações' : 'Agendar no Google'}
              </button>
            </div>
          </form>

          {/* Lista de Eventos Próximos */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-200">Próximos Eventos Cadastrados</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {eventos.map(e => (
                <div
                  key={e.id}
                  className="bg-slate-800/40 border border-slate-700/60 p-4 rounded-xl space-y-2 flex justify-between items-start"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-100 text-sm">{e.summary}</h4>
                    {e.location && (
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" /> {e.location}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      {new Date(e.start?.dateTime || e.start?.date).toLocaleString('pt-BR')}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button onClick={() => handleEditClick(e)} className="p-1.5 text-slate-400 hover:text-slate-200">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(e.id)} className="p-1.5 text-rose-400 hover:text-rose-300">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-slate-800/20 border border-slate-800 border-dashed rounded-3xl p-12 text-center space-y-3">
          <CalendarIcon className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-300">Google Agenda Não Conectado</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Clique no botão acima para conectar com a conta do Google e gerenciar os compromissos em tempo real.
          </p>
        </div>
      )}
    </div>
  )
}
