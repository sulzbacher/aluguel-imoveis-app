import { Building2, Calendar, LayoutDashboard, Wallet } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export function Navbar() {
  const location = useLocation()

  const isActive = path => location.pathname === path

  return (
    <header className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo / Marca */}
        <Link
          to="/"
          className="flex items-center gap-2.5 font-black text-lg text-slate-100 hover:text-indigo-400 transition"
        >
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-600/30">
            <Building2 className="w-5 h-5" />
          </div>
          <span>
            Casal<span className="text-indigo-400">Home</span>
          </span>
        </Link>

        {/* Links de Navegação */}
        <nav className="flex items-center gap-1 md:gap-2">
          <Link
            to="/"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              isActive('/')
                ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-700/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <Link
            to="/ranking"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              isActive('/ranking')
                ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-700/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Ranking Imóveis</span>
          </Link>

          <Link
            to="/gastos"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              isActive('/gastos')
                ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-700/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Gastos & Rendas</span>
          </Link>

          <Link
            to="/agenda"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              isActive('/agenda')
                ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-700/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Agenda & Shows</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
