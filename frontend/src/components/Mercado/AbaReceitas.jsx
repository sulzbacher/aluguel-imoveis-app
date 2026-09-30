import { Plus, X } from 'lucide-react'
import { useState } from 'react'
// =============================================================================
// 4. MINI COMPONENTE: ABA 3 - BANCO DE RECEITAS
// =============================================================================
export function AbaReceitas({ receitas, alimentosBase, onAddReceita }) {
  const [modalAberto, setModalAberto] = useState(false)
  const [nome, setNome] = useState('')
  const [porcoes, setPorcoes] = useState(1)
  const [ingredientesForm, setIngredientesForm] = useState([{ alimento_id: '', gramas: 100 }])

  const handleAddIngredienteLinha = () => {
    setIngredientesForm([...ingredientesForm, { alimento_id: '', gramas: 100 }])
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (!nome) return
    onAddReceita({
      nome,
      categoria: 'Geral',
      porcoes: Number(porcoes),
      ingredientes: ingredientesForm.filter(i => i.alimento_id && i.gramas > 0),
    })
    setModalAberto(false)
    setNome('')
    setIngredientesForm([{ alimento_id: '', gramas: 100 }])
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-slate-800/40 p-4 rounded-2xl border border-slate-700/60">
        <div>
          <h3 className="text-sm font-bold text-slate-200">Minhas Receitas & Preparações</h3>
          <p className="text-xs text-slate-400">Monte receitas e os macronutrientes serão somados automaticamente.</p>
        </div>
        <button
          onClick={() => setModalAberto(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Nova Receita
        </button>
      </div>

      {/* Grid de Receitas */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {receitas.map(rec => {
          // Calcula macros acumulados da receita
          let protTotal = 0,
            carboTotal = 0,
            gordTotal = 0,
            calTotal = 0

          rec.ingredientes?.forEach(ing => {
            const ali = alimentosBase.find(a => a.id === ing.alimento_id)
            if (ali) {
              const fator = Number(ing.gramas || 0) / 100
              protTotal += Number(ali.proteina_100g || 0) * fator
              carboTotal += Number(ali.carbo_100g || 0) * fator
              gordTotal += Number(ali.gordura_100g || 0) * fator
              calTotal += Number(ali.calorias_100g || 0) * fator
            }
          })

          const porc = rec.porcoes || 1

          return (
            <div
              key={rec.id}
              className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-100 text-sm">{rec.nome}</h4>
                  <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded font-bold">
                    {porc} {porc === 1 ? 'porção' : 'porções'}
                  </span>
                </div>

                {/* Macros Badge */}
                <div className="grid grid-cols-4 gap-1.5 text-center bg-slate-900/80 p-2 rounded-xl text-[10px]">
                  <div>
                    <span className="text-slate-500 block">Prot</span>
                    <span className="font-bold text-emerald-400">{(protTotal / porc).toFixed(1)}g</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Carb</span>
                    <span className="font-bold text-indigo-400">{(carboTotal / porc).toFixed(1)}g</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Gord</span>
                    <span className="font-bold text-amber-400">{(gordTotal / porc).toFixed(1)}g</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Kcal</span>
                    <span className="font-bold text-rose-400">{(calTotal / porc).toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal Criar Receita */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-sm">Cadastrar Nova Receita</h3>
              <button onClick={() => setModalAberto(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Nome da Receita (Ex: Strogonoff Fit)"
                required
                value={nome}
                onChange={e => setNome(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
              />

              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-400 block">Ingredientes:</span>
                {ingredientesForm.map((ing, idx) => (
                  <div key={idx} className="grid grid-cols-5 gap-2">
                    <select
                      value={ing.alimento_id}
                      onChange={e => {
                        const novoArr = [...ingredientesForm]
                        novoArr[idx].alimento_id = e.target.value
                        setIngredientesForm(novoArr)
                      }}
                      className="col-span-3 bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-slate-100"
                    >
                      <option value="">Selecione o alimento...</option>
                      {alimentosBase.map(a => (
                        <option key={a.id} value={a.id}>
                          {a.nome}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Gramas"
                      value={ing.gramas}
                      onChange={e => {
                        const novoArr = [...ingredientesForm]
                        novoArr[idx].gramas = Number(e.target.value)
                        setIngredientesForm(novoArr)
                      }}
                      className="col-span-2 bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-slate-100"
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddIngredienteLinha}
                  className="text-xs text-indigo-400 font-semibold hover:underline"
                >
                  + Adicionar mais ingrediente
                </button>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="bg-slate-800 text-slate-300 font-semibold text-xs px-4 py-2 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2 rounded-xl"
                >
                  Salvar Receita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
