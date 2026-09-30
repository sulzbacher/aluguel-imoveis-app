// =============================================================================
// 1. MINI COMPONENTE: Cabeçalho & Seletor de Mês
// =============================================================================
export function HeaderMes({ mesAnoAtual, setMesAnoAtual, mesesDisponiveis }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/40 p-6 rounded-2xl border border-slate-700/60">
      <div>
        <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
          <Wallet className="w-6 h-6 text-emerald-400" /> Controle de Pagamentos Mensais
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Marque os pagamentos conforme efetuados. O histórico permanece preservado mês a mês.
        </p>
      </div>

      <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 p-2 rounded-xl">
        <Calendar className="w-4 h-4 text-indigo-400 ml-1" />
        <select
          value={mesAnoAtual}
          onChange={e => setMesAnoAtual(e.target.value)}
          className="bg-transparent text-sm font-bold text-slate-100 focus:outline-none cursor-pointer"
        >
          {mesesDisponiveis?.map(m => (
            <option key={m} value={m} className="bg-slate-900 text-slate-100">
              Mês: {m}
            </option>
          ))}
          <option value="2026-11" className="bg-slate-900 text-slate-100">
            + Iniciar 2026-11
          </option>
        </select>
      </div>
    </div>
  )
}
