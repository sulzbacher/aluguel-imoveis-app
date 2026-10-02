import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { DetalhesImovel } from './pages/DetalhesImovel'
import { GastosMensais } from './pages/GastosMensais'
import { ListagemImoveis } from './pages/ListagemImoveis'
import { NovoImovel } from './pages/NovoImovel'

import { Navbar } from './components/Navbar'
import { Agenda } from './pages/Agenda'
import { Cartoes } from './pages/Cartoes'
import { Dashboard } from './pages/Dashboard'
import { Mercado } from './pages/Mercado'
import { Metas } from './pages/Metas'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col">
        {/* Menu Global Fixado no Topo */}
        <Navbar />

        {/* Conteúdo Principal */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/imoveis" element={<ListagemImoveis />} />
            <Route path="/imovel/:id" element={<DetalhesImovel />} />
            <Route path="/novo" element={<NovoImovel />} />
            <Route path="/gastos" element={<GastosMensais />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/cartoes" element={<Cartoes />} />
            <Route path="/mercado" element={<Mercado />} />
            <Route path="/metas" element={<Metas />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
