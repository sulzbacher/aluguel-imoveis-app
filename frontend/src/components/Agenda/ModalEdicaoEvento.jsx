import { Edit3, X } from 'lucide-react'
import { useState } from 'react'
// =============================================================================
// 5. MINI COMPONENTE: Modal para Edição Isolada
// =============================================================================
export function ModalEdicaoEvento({ evento, onClose, onSalvar, calendarId }) {
  const [form, setForm] = useState({
    summary: evento?.summary || '',
    description: evento?.description || '',
    location: evento?.location || '',
    startDateTime: evento?.start?.dateTime ? evento.start.dateTime.slice(0, 16) : '',
    endDateTime: evento?.end?.dateTime ? evento.end.dateTime.slice(0, 16) : '',
  })

  const handleSubmit = e => {
    e.preventDefault()
    onSalvar(evento.id, { ...form, calendarId })
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-indigo-400" /> Editar Evento
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Título</label>
            <input
              type="text"
              required
              value={form.summary}
              onChange={e => setForm({ ...form, summary: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Local</label>
            <input
              type="text"
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Início</label>
              <input
                type="datetime-local"
                required
                value={form.startDateTime}
                onChange={e => setForm({ ...form, startDateTime: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Término</label>
              <input
                type="datetime-local"
                required
                value={form.endDateTime}
                onChange={e => setForm({ ...form, endDateTime: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-800 text-slate-300 font-semibold text-xs px-4 py-2 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2 rounded-xl"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
