import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { DetalhesImovel } from './pages/DetalhesImovel'
import { Listagem } from './pages/Listagem'
import { NovoImovel } from './pages/NovoImovel'

export function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Listagem />} />
          <Route path="/imovel/:id" element={<DetalhesImovel />} />
          <Route path="/novo" element={<NovoImovel />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
