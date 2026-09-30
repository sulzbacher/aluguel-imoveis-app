import { CheckSquare, RefreshCw, Square } from 'lucide-react'
// =============================================================================
// 2. MINI COMPONENTE: ABA 1 - LISTA DE MERCADO (MODO CARRINHO)
// =============================================================================
export function AbaListaMercado({ lista, onToggleCarrinho, onGerarListaAuto }) {
  const totalEstimado = lista.reduce((acc, i) => acc + Number(i.custo_estimado || 0), 0)
  const totalNoCarrinho = lista.filter(i => i.no_carrinho).reduce((acc, i) => acc + Number(i.custo_estimado || 0), 0)
  const concluidas = lista.filter(i => i.no_carrinho).length

  return (
    <div className="space-y-6">
      {/* Resumo do Carrinho */}
      <div className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-200">Progresso das Compras</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {concluidas} de {lista.length} itens no carrinho
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <div>
            <span className="text-slate-400 block">Total Est.:</span>
            <span className="font-black text-slate-200 text-base">
              R$ {totalEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">No Carrinho:</span>
            <span className="font-black text-emerald-400 text-base">
              R$ {totalNoCarrinho.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <button
            onClick={onGerarListaAuto}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Sincronizar Dieta
          </button>
        </div>
      </div>

      {/* Lista Interativa */}
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl overflow-hidden divide-y divide-slate-700/40 text-xs">
        {lista.length > 0 ? (
          lista.map(item => (
            <div
              key={item.id}
              onClick={() => onToggleCarrinho(item.id, !item.no_carrinho)}
              className={`p-4 flex items-center justify-between cursor-pointer transition ${
                item.no_carrinho ? 'bg-emerald-950/20 hover:bg-emerald-950/30' : 'hover:bg-slate-700/20'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.no_carrinho ? (
                  <CheckSquare className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Square className="w-5 h-5 text-slate-500" />
                )}
                <span
                  className={`font-semibold ${item.no_carrinho ? 'line-through text-slate-500' : 'text-slate-100'}`}
                >
                  {item.nome}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-slate-400 font-medium">
                  {item.quantidade} {item.unidade}
                </span>
                <span className="font-bold text-slate-200 min-w-[70px] text-right">
                  R$ {Number(item.custo_estimado || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-slate-500">
            Sua lista está vazia. Clique em "Sincronizar Dieta" para puxar o cardápio semanal!
          </div>
        )}
      </div>
    </div>
  )
}
