import { DollarSign } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CardProgresso } from '../components/Gastos/CardProgresso'
import { FormNovoGasto } from '../components/Gastos/FormNovoGasto'
import { HeaderMes } from '../components/Gastos/HeaderMes'
import { SecaoRendas } from '../components/Gastos/SecaoRendas'
import { TabelaPagamentos } from '../components/Gastos/TabelaPagamentos'
import {
  createGasto,
  createRenda,
  deleteGasto,
  deleteRenda,
  getGastosERendas,
  getHistoricoGastosMes,
  toggleMarcarPago,
} from '../services/gastosService'

// =============================================================================
// COMPONENTE PRINCIPAL (ORQUESTRADOR)
// =============================================================================
export function GastosMensais() {
  const [data, setData] = useState({
    renda: {},
    resumoRenda: {},
    historicoContas: [],
    resumoHistorico: {},
    mesesDisponiveis: [],
  })
  const [loading, setLoading] = useState(true)
  const [mesAnoAtual, setMesAnoAtual] = useState('2026-10')

  useEffect(() => {
    carregar(mesAnoAtual)
  }, [mesAnoAtual])

  const carregar = async mes => {
    setLoading(true)
    try {
      const [resHistorico, resData] = await Promise.all([getHistoricoGastosMes(mes), getGastosERendas()])

      setData({
        renda: resData.renda,
        resumoRenda: resData.resumo,
        historicoContas: resHistorico.contas || [],
        resumoHistorico: resHistorico.resumo || {},
        mesesDisponiveis: resHistorico.mesesDisponiveis || ['2026-10'],
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleTogglePago = async conta => {
    try {
      await toggleMarcarPago({
        mesAno: mesAnoAtual,
        gasto_id: conta.gasto_id || conta.id,
        pago: !conta.pago,
        valor_pago: conta.valor_previsto || conta.valor,
        pago_por: 'Carol',
      })
      carregar(mesAnoAtual)
    } catch (err) {
      alert(`Erro ao atualizar status: ${err.message}`)
    }
  }

  const handleAddGasto = async formGasto => {
    try {
      await createGasto({ ...formGasto, valor: Number(formGasto.valor) })
      carregar(mesAnoAtual)
    } catch (err) {
      alert(`Erro ao salvar gasto: ${err.message}`)
    }
  }

  const handleDeleteGasto = async id => {
    if (confirm('Remover esta despesa?')) {
      await deleteGasto(id)
      carregar(mesAnoAtual)
    }
  }

  const handleAddRendaNeno = async formRenda => {
    try {
      await createRenda('neno', { ...formRenda, valor: Number(formRenda.valor) })
      carregar(mesAnoAtual)
    } catch (err) {
      alert(`Erro ao adicionar renda: ${err.message}`)
    }
  }

  const handleDeleteRenda = async (pessoa, id) => {
    if (confirm('Remover esta entrada de renda?')) {
      await deleteRenda(pessoa, id)
      carregar(mesAnoAtual)
    }
  }

  if (loading) return <div className="text-center py-12 text-slate-400">Carregando painel financeiro...</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* 1. Topo & Seletor */}
      <HeaderMes mesAnoAtual={mesAnoAtual} setMesAnoAtual={setMesAnoAtual} mesesDisponiveis={data.mesesDisponiveis} />

      {/* 2. Barra de Progresso do Mês */}
      <CardProgresso resumo={data.resumoHistorico} />

      {/* 3. Seção de Rendas */}
      <SecaoRendas
        renda={data.renda}
        resumo={data.resumoRenda}
        onAddRendaNeno={handleAddRendaNeno}
        onDeleteRenda={handleDeleteRenda}
      />

      {/* 4. Planilha de Gastos Mensais */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2">
          <DollarSign className="w-5 h-5 text-rose-400" /> Planilha de Contas do Mês ({mesAnoAtual})
        </h2>

        <FormNovoGasto onAddGasto={handleAddGasto} />

        <TabelaPagamentos
          contas={data.historicoContas}
          onTogglePago={handleTogglePago}
          onDeleteGasto={handleDeleteGasto}
        />
      </div>
    </div>
  )
}
