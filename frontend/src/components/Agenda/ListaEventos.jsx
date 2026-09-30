import { Clock, MapPin } from 'lucide-react'
// =============================================================================
// 6. MINI COMPONENTE: Listagem em Cards
// =============================================================================
export function ListaEventos({ eventos, onEdit, onDelete }) {
  if (!eventos || eventos.length === 0) {
    return <div className="text-center py-8 text-xs text-slate-500">Nenhum evento próximo encontrado nesta agenda.</div>
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Próximos Compromissos</h2>
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
              <button
                onClick={() => onEdit(e)}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700/40 rounded transition"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(e.id)}
                className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
