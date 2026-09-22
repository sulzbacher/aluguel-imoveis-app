{
  /* Card de Orçamento Real e Bônus */
}
;<div
  className={`p-4 rounded-xl border ${
    imovel.calculos?.dentroDoOrcamento ? 'bg-emerald-950/20 border-emerald-800/60' : 'bg-rose-950/20 border-rose-800/60'
  }`}
>
  <div className="flex justify-between items-center mb-2">
    <span className="text-xs text-slate-400 font-semibold uppercase">Orçamento Total Estimado</span>
    <span
      className={`text-xs font-bold px-2 py-0.5 rounded ${
        imovel.calculos?.dentroDoOrcamento ? 'bg-emerald-900/60 text-emerald-300' : 'bg-rose-900/60 text-rose-300'
      }`}
    >
      {imovel.calculos?.dentroDoOrcamento ? 'Dentro do Limite (+20 pts)' : 'Acima do Limite'}
    </span>
  </div>

  <p className="text-2xl font-black text-slate-100">
    R$ {imovel.calculos?.custoTotalReal?.toLocaleString('pt-BR')}{' '}
    <span className="text-xs text-slate-400 font-normal">/ mês</span>
  </p>

  <p className="text-xs text-slate-400 mt-2">
    Imobiliária: R$ {imovel.calculos?.custoImobiliaria} | Contas (Luz/Net/Água/Gás/Tel): R${' '}
    {imovel.calculos?.totalDespesasPessoais}
  </p>
</div>
