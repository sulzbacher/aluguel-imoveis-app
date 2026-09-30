import { Apple, ChefHat, ShoppingBag, UtensilsCrossed } from 'lucide-react'
// =============================================================================
// 1. MINI COMPONENTE: NAVEGAÇÃO DE ABAS
// =============================================================================
export function NavegacaoAbas({ abaAtiva, setAbaAtiva }) {
  const abas = [
    { id: 'mercado', label: '🛒 Lista no Mercado', icon: ShoppingBag },
    { id: 'cardapio', label: '📅 Cardápio Semanal', icon: UtensilsCrossed },
    { id: 'receitas', label: '🧑‍🍳 Banco de Receitas', icon: ChefHat },
    { id: 'alimentos', label: '🥦 Alimentos Base (100g)', icon: Apple },
  ]

  return (
    <div className="flex flex-wrap gap-2 bg-slate-900 border border-slate-700/80 p-2 rounded-2xl">
      {abas.map(a => {
        const Icon = a.icon
        const isActive = abaAtiva === a.id
        return (
          <button
            key={a.id}
            onClick={() => setAbaAtiva(a.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              isActive
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Icon className="w-4 h-4" /> {a.label}
          </button>
        )
      })}
    </div>
  )
}
