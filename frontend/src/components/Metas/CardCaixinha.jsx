import { Plus, Sparkles, Trash2 } from 'lucide-react'
// =============================================================================
// 2. MINI COMPONENTE: Card Individual de Caixinha / Dívida
// =============================================================================
export function CardCaixinha({ caixinha, onAportarClick, onDeleteClick }) {
  const isDivida = caixinha.categoria === 'Dívidas'
  const temDesconto = caixinha.percentual_desconto > 0

  return (
    <div className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl space-y-4 flex flex-col justify-between hover:border-slate-600 transition">
      <div className="space-y-3">
        {/* Topo do Card */}
        <div className="flex justify-between items-start gap-2">
          <div>
            <span
              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                isDivida
                  ? 'bg-amber-950/80 text-amber-300 border-amber-700/50'
                  : 'bg-indigo-950/80 text-indigo-300 border-indigo-700/50'
              }`}
            >
              {caixinha.categoria}
            </span>
            <h3 className="font-bold text-slate-100 text-sm mt-1.5">{caixinha.titulo}</h3>
          </div>

          <button
            onClick={() => onDeleteClick(caixinha.id)}
            className="text-slate-500 hover:text-rose-400 transition p-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Destaque para Dívidas com Desconto Serasa */}
        {isDivida && temDesconto && (
          <div className="bg-emerald-950/40 border border-emerald-800/40 p-2.5 rounded-xl text-[11px] space-y-0.5">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Desconto Serasa: {caixinha.percentual_desconto}% OFF
            </span>
            <div className="flex justify-between text-slate-400 text-[10px]">
              <span>
                Valor Original:{' '}
                <span className="line-through">R$ {caixinha.valor_original_divida?.toLocaleString('pt-BR')}</span>
              </span>
              <span className="text-emerald-300 font-bold">
                Acordo: R$ {caixinha.valor_alvo?.toLocaleString('pt-BR')}
              </span>
            </div>
          </div>
        )}

        {/* Valores & Progresso */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">
              Guardado: R$ {caixinha.valor_atual?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <span className="font-bold text-slate-200">{caixinha.percentualConcluido}%</span>
          </div>

          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${isDivida ? 'bg-amber-500' : 'bg-indigo-500'}`}
              style={{ width: `${caixinha.percentualConcluido}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-slate-400 pt-1">
            <span>Alvo: R$ {caixinha.valor_alvo?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            <span>Aporte: R$ {caixinha.aporte_mensal_sugerido}/mês</span>
          </div>
        </div>

        {/* Estimativa de Tempo com CDI */}
        <div className="bg-slate-900/80 p-2.5 rounded-xl text-[11px] space-y-1 text-slate-300 border border-slate-700/50">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Tempo estimado no ritmo atual:</span>
            <span className="font-bold text-indigo-300">
              {caixinha.mesesEstimados === 0
                ? 'Meta atingida!'
                : caixinha.mesesEstimados === Infinity
                  ? 'Defina um aporte'
                  : `~${caixinha.mesesEstimados} meses`}
            </span>
          </div>
          {caixinha.rendimentoJurosEst > 0 && (
            <span className="text-[10px] text-emerald-400 block text-right font-medium">
              + R$ {caixinha.rendimentoJurosEst.toLocaleString('pt-BR')} estimados em juros do CDI
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => onAportarClick(caixinha)}
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
      >
        <Plus className="w-3.5 h-3.5" /> Depositar na Caixinha
      </button>
    </div>
  )
}
