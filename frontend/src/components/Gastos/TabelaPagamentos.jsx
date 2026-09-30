// =============================================================================
// 5. MINI COMPONENTE: Tabela Unificada de Pagamentos do Mês
// =============================================================================
export function TabelaPagamentos({ contas, onTogglePago, onDeleteGasto }) {
  const renderGrupo = (prioridadeNumero, titulo, corTexto, corBorda) => {
    const contasFiltradas = contas?.filter(g => Number(g.prioridade || 2) === prioridadeNumero) || []

    return (
      <>
        <tr
          className={`bg-slate-900/90 font-bold ${corTexto} border-t border-b ${corBorda} text-[11px] uppercase tracking-wider`}
        >
          <td colSpan="6" className="px-4 py-2">
            {titulo}
          </td>
        </tr>
        {contasFiltradas.map(gasto => (
          <tr
            key={gasto.gasto_id || gasto.id}
            className={`transition ${gasto.pago ? 'bg-emerald-950/20 hover:bg-emerald-950/30' : 'hover:bg-slate-700/20'}`}
          >
            <td className="p-3.5 text-center cursor-pointer" onClick={() => onTogglePago(gasto)}>
              {gasto.pago ? (
                <CheckSquare className="w-5 h-5 text-emerald-400 mx-auto" />
              ) : (
                <Square className="w-5 h-5 text-slate-500 hover:text-slate-300 mx-auto" />
              )}
            </td>
            <td className={`p-3.5 font-medium ${gasto.pago ? 'line-through text-slate-500' : 'text-slate-100'}`}>
              {gasto.descricao}
            </td>
            <td className="p-3.5 text-slate-400">{gasto.categoria}</td>
            <td className="p-3.5">
              {gasto.substituidoNaMudanca ? (
                <span className="bg-amber-950/60 text-amber-300 border border-amber-700/40 px-2 py-0.5 rounded font-semibold text-[10px]">
                  Substituído
                </span>
              ) : (
                <span className="bg-slate-700/60 text-slate-300 px-2 py-0.5 rounded font-semibold text-[10px]">
                  Fixo
                </span>
              )}
            </td>
            <td className="p-3.5 font-bold text-slate-100">
              R${' '}
              {Number(gasto.valor_previsto ?? gasto.valor ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </td>
            <td className="p-3.5 text-right">
              <button
                onClick={() => onDeleteGasto(gasto.gasto_id || gasto.id)}
                className="p-1 text-rose-400 hover:bg-rose-950/40 rounded transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </td>
          </tr>
        ))}
      </>
    )
  }

  return (
    <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-700/60 bg-slate-900/60 text-slate-400 text-xs uppercase font-semibold">
            <th className="p-3.5 text-center w-12">Pago</th>
            <th className="p-3.5">Descrição</th>
            <th className="p-3.5">Categoria</th>
            <th className="p-3.5">Status na Mudança</th>
            <th className="p-3.5">Valor Previsto</th>
            <th className="p-3.5 text-right">Ação</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/40 text-xs text-slate-200">
          {renderGrupo(1, '💳 1. Cartões de Crédito & Dívidas Imediatas', 'text-amber-400', 'border-amber-500/30')}
          {renderGrupo(
            2,
            '🏠 2. Contas Essenciais da Casa, Habitação & Fixos',
            'text-indigo-400',
            'border-indigo-500/30'
          )}
          {renderGrupo(3, '🛒 3. Outros Gastos & Despesas Flexíveis', 'text-slate-400', 'border-slate-700/50')}
        </tbody>
      </table>
    </div>
  )
}
