import { CalendarIcon } from 'lucide-react'
// =============================================================================
// 1. MINI COMPONENTE: Header & Conexão
// =============================================================================
export function HeaderAgenda({ conectado, onConectar }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/40 p-6 rounded-2xl border border-slate-700/60">
      <div>
        <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-indigo-400" /> Agenda de Shows & Eventos
        </h1>
        <p className="text-xs text-slate-400 mt-1">Sincronização em tempo real com a conta do Google Agenda.</p>
      </div>

      {!conectado && (
        <button
          onClick={onConectar}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/20"
        >
          Conectar Google Agenda
        </button>
      )}
    </div>
  )
}
