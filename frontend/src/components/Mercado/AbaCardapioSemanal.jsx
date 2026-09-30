import { RefreshCw } from 'lucide-react'
// =============================================================================
// 3. MINI COMPONENTE: ABA 2 - CARDÁPIO SEMANAL
// =============================================================================
export function AbaCardapioSemanal({ cardapio, receitas, onGerarListaAuto }) {
  const diasSemana = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo']

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-slate-800/40 p-4 rounded-2xl border border-slate-700/60">
        <div>
          <h3 className="text-sm font-bold text-slate-200">Planejamento da Dieta do Casal</h3>
          <p className="text-xs text-slate-400">Atribua refeições para os dias da semana de Carol e Neno.</p>
        </div>
        <button
          onClick={onGerarListaAuto}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg shadow-emerald-600/20"
        >
          <RefreshCw className="w-4 h-4" /> Gerar Lista de Mercado (7 Dias)
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {diasSemana.map(dia => {
          const refeicoesCarol = cardapio?.dias?.[dia]?.carol || []
          const refeicoesNeno = cardapio?.dias?.[dia]?.neno || []

          return (
            <div key={dia} className="bg-slate-800/40 border border-slate-700/60 p-4 rounded-2xl space-y-3">
              <span className="text-xs font-black uppercase text-indigo-400 block tracking-wider border-b border-slate-700/50 pb-1">
                {dia}
              </span>

              {/* Carol */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400">Carol:</span>
                {refeicoesCarol.length > 0 ? (
                  refeicoesCarol.map((recId, idx) => {
                    const rec = receitas.find(r => r.id === recId)
                    return (
                      <div key={idx} className="bg-slate-900 p-2 rounded-lg text-xs text-slate-200 font-medium">
                        {rec ? rec.nome : 'Receita'}
                      </div>
                    )
                  })
                ) : (
                  <p className="text-[10px] text-slate-600 italic">Sem refeições registradas</p>
                )}
              </div>

              {/* Neno */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-bold text-slate-400">Neno:</span>
                {refeicoesNeno.length > 0 ? (
                  refeicoesNeno.map((recId, idx) => {
                    const rec = receitas.find(r => r.id === recId)
                    return (
                      <div key={idx} className="bg-slate-900 p-2 rounded-lg text-xs text-slate-200 font-medium">
                        {rec ? rec.nome : 'Receita'}
                      </div>
                    )
                  })
                ) : (
                  <p className="text-[10px] text-slate-600 italic">Sem refeições registradas</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
