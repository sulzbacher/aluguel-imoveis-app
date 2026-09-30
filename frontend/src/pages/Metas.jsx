import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CardCaixinha } from '../components/Metas/CardCaixinha'
import { CardResumoCofres } from '../components/Metas/CardResumoCofres'
import { ModalAporte } from '../components/Metas/ModalAporte'
import { ModalNovaCaixinha } from '../components/Metas/ModalNovaCaixinha'
import { createCaixinha, deleteCaixinha, getMetasECofres, realizarAporteCaixinha } from '../services/metasService'

// =============================================================================
// COMPONENTE PRINCIPAL (ORQUESTRADOR)
// =============================================================================
export function Metas() {
  const [data, setData] = useState({ caixinhas: [], resumo: {}, config_cdi: {} })
  const [loading, setLoading] = useState(true)
  const [caixinhaParaAporte, setCaixinhaParaAporte] = useState(null)
  const [modalNovaAberto, setModalNovaAberto] = useState(false)

  useEffect(() => {
    carregar()
  }, [])

  const carregar = async () => {
    setLoading(true)
    try {
      const res = await getMetasECofres()
      setData(res || {})
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCriarCaixinha = async nova => {
    try {
      await createCaixinha(nova)
      setModalNovaAberto(false)
      carregar()
    } catch (err) {
      alert(`Erro ao criar caixinha: ${err.message}`)
    }
  }

  const handleConfirmarAporte = async (id, dadosAporte) => {
    try {
      await realizarAporteCaixinha(id, dadosAporte)
      setCaixinhaParaAporte(null)
      carregar()
    } catch (err) {
      alert(`Erro ao registrar aporte: ${err.message}`)
    }
  }

  const handleDeleteCaixinha = async id => {
    if (confirm('Remover esta caixinha de metas?')) {
      try {
        await deleteCaixinha(id)
        carregar()
      } catch (err) {
        alert(`Erro ao remover caixinha: ${err.message}`)
      }
    }
  }

  if (loading) return <div className="text-center py-12 text-slate-400">Carregando planejador de metas e cofres...</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* 1. Header & Patrimônio */}
      <CardResumoCofres resumo={data.resumo} configCdi={data.config_cdi} />

      {/* 2. Barra de Ações */}
      <div className="flex justify-between items-center bg-slate-800/40 p-4 rounded-2xl border border-slate-700/60">
        <h2 className="text-sm font-bold text-slate-200">Suas Caixinhas Ativas</h2>
        <button
          onClick={() => setModalNovaAberto(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" /> Criar Nova Caixinha
        </button>
      </div>

      {/* 3. Grid de Caixinhas */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.caixinhas?.map(caixinha => (
          <CardCaixinha
            key={caixinha.id}
            caixinha={caixinha}
            onAportarClick={setCaixinhaParaAporte}
            onDeleteClick={handleDeleteCaixinha}
          />
        ))}
      </div>

      {/* 4. Modais */}
      {caixinhaParaAporte && (
        <ModalAporte
          caixinha={caixinhaParaAporte}
          onClose={() => setCaixinhaParaAporte(null)}
          onConfirmarAporte={handleConfirmarAporte}
        />
      )}

      {modalNovaAberto && <ModalNovaCaixinha onClose={() => setModalNovaAberto(false)} onCriar={handleCriarCaixinha} />}
    </div>
  )
}
