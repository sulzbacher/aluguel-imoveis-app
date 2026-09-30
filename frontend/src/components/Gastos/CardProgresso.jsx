// =============================================================================
// 2. MINI COMPONENTE: Progresso Financeiro do Mês
// =============================================================================
export function CardProgresso({ resumo }) {
  const percentual = resumo?.percentualConcluido || 0

  return (
    <div className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl space-y-3">
      <div className="flex justify-between items-center text-xs font-bold text-slate-300">
        <span>
          Progresso de Pagamentos ({resumo?.qtdPagas || 0} de {resumo?.qtdTotal || 0} contas pagas)
        </span>
        <span className="text-emerald-400">{percentual}% Concluído</span>
      </div>

      <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${percentual}%` }} />
      </div>

      <div className="grid md:grid-cols-3 gap-4 pt-2 border-t border-slate-700/40 text-xs">
        <div>
          <span className="text-slate-400 block">Total Previsto:</span>
          <span className="text-base font-bold text-slate-200">
            R$ {(resumo?.totalPrevisto || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block">Já Pago:</span>
          <span className="text-base font-bold text-emerald-400">
            R$ {(resumo?.totalEfetivamentePago || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block">Restante a Pagar:</span>
          <span className="text-base font-bold text-rose-400">
            R$ {(resumo?.totalPendente || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  )
}
