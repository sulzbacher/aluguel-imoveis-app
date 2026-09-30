import { LayoutGrid, List } from 'lucide-react'
// =============================================================================
// 2. MINI COMPONENTE: Seletor de Agenda & Modos de Visualização
// =============================================================================
export function BarraFerramentasAgenda({ calendarios, selectedCalendarId, onChangeCalendar, modoVisao, setModoVisao }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-700/80 p-3 rounded-2xl">
      {/* Seletor de Agenda */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-400">Agenda Ativa:</span>
        <select
          value={selectedCalendarId}
          onChange={e => onChangeCalendar(e.target.value)}
          className="bg-slate-800 text-xs font-bold text-slate-100 border border-slate-700 rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer"
        >
          {calendarios.map(cal => (
            <option key={cal.id} value={cal.id}>
              {cal.summary} {cal.primary ? '(Principal)' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Alternador de Visão (Mês vs Lista) */}
      <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700/60">
        <button
          onClick={() => setModoVisao('iframe')}
          className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition ${
            modoVisao === 'iframe' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" /> Visão Mês (Google)
        </button>
        <button
          onClick={() => setModoVisao('lista')}
          className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition ${
            modoVisao === 'lista' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <List className="w-3.5 h-3.5" /> Lista de Eventos
        </button>
      </div>
    </div>
  )
}
