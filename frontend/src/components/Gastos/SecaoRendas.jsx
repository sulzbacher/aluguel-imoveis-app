// =============================================================================
// 3. MINI COMPONENTE: Quadro de Rendas (Carol & Neno)
// =============================================================================
export function SecaoRendas({ renda, resumo, onAddRendaNeno, onDeleteRenda }) {
  const [formRendaNeno, setFormRendaNeno] = useState({
    descricao: '',
    valor: '',
    data: '',
    tipo: 'Flexível / Freela',
  })

  const handleSubmit = e => {
    e.preventDefault()
    if (!formRendaNeno.descricao || !formRendaNeno.valor) return
    onAddRendaNeno(formRendaNeno)
    setFormRendaNeno({ descricao: '', valor: '', data: '', tipo: 'Flexível / Freela' })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2">
        <TrendingUp className="w-5 h-5 text-emerald-400" /> Entradas / Salários do Casal
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Carol */}
        <div className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl space-y-3">
          <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
            <h3 className="font-bold text-slate-100 text-sm">Carol (Ambev)</h3>
            <span className="text-xs font-bold text-emerald-400">
              R$ {(resumo?.rendaCarol || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="space-y-2">
            {renda?.carol?.entradas?.map(e => (
              <div
                key={e.id || e.descricao}
                className="flex justify-between items-center bg-slate-900/60 p-2.5 rounded-xl text-xs"
              >
                <div>
                  <span className="font-semibold text-slate-200 block">{e.descricao}</span>
                  <span className="text-[10px] text-slate-400">Todo dia {e.dia}</span>
                </div>
                <span className="font-bold text-emerald-300">
                  R$ {Number(e.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Neno */}
        <div className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl space-y-3">
          <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
            <h3 className="font-bold text-slate-100 text-sm">Neno (Músico / Shows)</h3>
            <span className="text-xs font-bold text-emerald-400">
              R$ {(resumo?.rendaNeno || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="space-y-2">
            {renda?.neno?.entradas_variaveis?.map(e => (
              <div key={e.id} className="flex justify-between items-center bg-slate-900/60 p-2.5 rounded-xl text-xs">
                <div>
                  <span className="font-semibold text-slate-200 block">{e.descricao}</span>
                  <span className="text-[10px] text-slate-400">{e.data ? `Previsto: ${e.data}` : 'Intermitente'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-emerald-300">
                    R$ {Number(e.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <button onClick={() => onDeleteRenda('neno', e.id)} className="text-rose-400 hover:text-rose-300">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="pt-2 border-t border-slate-700/40 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 block">+ Adicionar Show / Freela</span>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Descrição"
                required
                value={formRendaNeno.descricao}
                onChange={e => setFormRendaNeno({ ...formRendaNeno, descricao: e.target.value })}
                className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Valor R$"
                required
                value={formRendaNeno.valor}
                onChange={e => setFormRendaNeno({ ...formRendaNeno, valor: e.target.value })}
                className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg p-2 transition"
              >
                Adicionar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
