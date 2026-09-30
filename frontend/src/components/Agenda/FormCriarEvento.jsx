// =============================================================================
// 4. MINI COMPONENTE: Form Apenas para Criação de Evento
// =============================================================================
export function FormCriarEvento({ onCriar, calendarId }) {
  const [form, setForm] = useState({
    summary: '',
    description: '',
    location: '',
    startDateTime: '',
    endDateTime: '',
  })

  const handleSubmit = e => {
    e.preventDefault()
    if (!form.summary || !form.startDateTime || !form.endDateTime) return
    onCriar({ ...form, calendarId })
    setForm({ summary: '', description: '', location: '', startDateTime: '', endDateTime: '' })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl space-y-4">
      <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
        <Plus className="w-4 h-4 text-indigo-400" /> Agendar Novo Show / Evento
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
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 font-semibold block">Início</label>
          <input
            type="datetime-local"
            required
            value={form.startDateTime}
            onChange={e => setForm({ ...form, startDateTime: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 font-semibold block">Término</label>
          <input
            type="datetime-local"
            required
            value={form.endDateTime}
            onChange={e => setForm({ ...form, endDateTime: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl p-2.5 transition h-10"
          >
            Agendar no Google Agenda
          </button>
        </div>
      </div>
    </form>
  )
}
