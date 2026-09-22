import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { DetalhesImovel } from './pages/DetalhesImovel'
import { Listagem } from './pages/Listagem'
import { NovoImovel } from './pages/NovoImovel'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Listagem />} />
        <Route path="/imovel/:id" element={<DetalhesImovel />} />
        <Route path="/novo" element={<NovoImovel />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
