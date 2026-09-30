import { PiggyBank } from 'lucide-react'
// =============================================================================
// 1. MINI COMPONENTE: Resumo do Patrimônio nos Cofres
// =============================================================================
export function CardResumoCofres({ resumo, configCdi }) {
  return (
    <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-800/40 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
      <div className="space-y-1">
        <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase flex items-center gap-1.5">
          <PiggyBank className="w-4 h-4" /> Caixinhas Mercado Pago (Rendimento {configCdi?.percentual_rendimento_conta}%
          CDI)
        </span>
        <h1 className="text-2xl font-black text-slate-100">Metas & Planejador de Dívidas</h1>
        <p className="text-xs text-slate-400 max-w-xl">
          Reserve valores mensais para quitar dívidas com propostas de desconto ou juntar para suas conquistas.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 bg-slate-900/90 border border-slate-700/80 p-4 rounded-2xl min-w-[280px]">
        <div>
          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Total Acumulado</span>
          <p className="text-xl font-black text-emerald-400">
            R$ {(resumo?.totalEmCofres || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Meta Total</span>
          <p className="text-xl font-black text-slate-200">
            R$ {(resumo?.totalMetas || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  )
}
