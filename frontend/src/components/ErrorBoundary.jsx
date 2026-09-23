import { AlertTriangle, RefreshCw } from 'lucide-react'
import React from 'react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Erro capturado pelo ErrorBoundary:', error, errorInfo)
    this.setState({ errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="m-4 p-6 bg-rose-950/80 border border-rose-700/80 rounded-2xl text-rose-100 font-sans shadow-2xl">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-8 h-8 text-rose-400 shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-rose-200">Ops! Ocorreu um erro na renderização</h2>
              <p className="text-xs text-rose-300/80">O React capturou um erro no componente visual.</p>
            </div>
          </div>

          <div className="bg-slate-950/90 p-4 rounded-xl border border-rose-900/50 mb-4 overflow-x-auto text-xs font-mono text-rose-300">
            <p className="font-bold text-rose-400 mb-1">{this.state.error?.toString()}</p>
            <pre className="text-[11px] opacity-75 whitespace-pre-wrap">{this.state.errorInfo?.componentStack}</pre>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs px-4 py-2 rounded-lg transition"
          >
            <RefreshCw className="w-4 h-4" /> Recarregar Página
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
