import { Calendar as CalendarIcon } from 'lucide-react'

export function Agenda() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/40 p-6 rounded-2xl border border-slate-700/60">
        <div>
          <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-indigo-400" /> Agenda, Shows & Vencimentos
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Módulo preparado para sincronização de datas dos freelas do Neno e lembretes financeiros.
          </p>
        </div>
      </div>

      <div className="bg-slate-800/20 border border-slate-800 border-dashed rounded-3xl p-12 text-center space-y-3">
        <CalendarIcon className="w-12 h-12 text-slate-600 mx-auto" />
        <h3 className="text-lg font-bold text-slate-300">Integração com o Google Calendar</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Em breve conectaremos com os eventos do Google Agenda para puxar automaticamente os cachês e datas dos shows.
        </p>
      </div>
    </div>
  )
}
