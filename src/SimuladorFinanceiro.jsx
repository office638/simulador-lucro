import { useState } from 'react';

export default function SimuladorFinanceiro() {
  const [receita, setReceita] = useState(30000);
  const [custos, setCustos] = useState(5000);
  const [despesas, setDespesas] = useState(18000);
  const [investimentos, setInvestimentos] = useState(0);

  const [receitaVar, setReceitaVar] = useState(0);
  const [custosVar, setCustosVar] = useState(0);
  const [despesasVar, setDespesasVar] = useState(0);

  const calcularResultados = (base, variacao) => base * (1 + variacao / 100);

  const receitaNova = calcularResultados(receita, receitaVar);
  const custosNovos = calcularResultados(custos, custosVar);
  const despesasNovas = calcularResultados(despesas, despesasVar);

  const margemOriginal = receita - custos;
  const loaiOriginal = margemOriginal - despesas;
  const lucroOriginal = loaiOriginal + investimentos;

  const margemNova = receitaNova - custos;
  const lucroReceita = margemNova - despesas + investimentos;

  const margemComCustos = receita - custosNovos;
  const lucroCustos = margemComCustos - despesas + investimentos;

  const loaiComDespesas = receita - custos - despesasNovas;
  const lucroDespesas = loaiComDespesas + investimentos;

  const margemFinal = receitaNova - custosNovos;
  const loaiNovo = margemFinal - despesasNovas;
  const lucroNovo = loaiNovo + investimentos;

  const diferencaLucro = (((lucroNovo - lucroOriginal) / lucroOriginal) * 100).toFixed(1);

  const formatCurrency = value => isFinite(value) ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00';

  const impactoReceita = receitaVar !== 0 ? lucroReceita - lucroOriginal : 0;
  const impactoCustos = custosVar !== 0 ? lucroCustos - lucroOriginal : 0;
  const impactoDespesas = despesasVar !== 0 ? lucroDespesas - lucroOriginal : 0;

  const percentual = (valor) => ((valor / receitaNova) * 100).toFixed(1);
  const diferenca = (novo, antigo) => (((novo - antigo) / antigo) * 100).toFixed(1);

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h2>Resumo do Fluxo de Caixa</h2>
      <div>
        <label>Receita (R$): <input type="number" value={receita} onChange={e => setReceita(Number(e.target.value))} /></label>
        <label>Custos Variáveis (R$): <input type="number" value={custos} onChange={e => setCustos(Number(e.target.value))} /></label>
        <label>Despesas Fixas (R$): <input type="number" value={despesas} onChange={e => setDespesas(Number(e.target.value))} /></label>
        <label>Investimentos (R$): <input type="number" value={investimentos} onChange={e => setInvestimentos(Number(e.target.value))} /></label>
      </div>
      <hr />
      <p>Lucro atual: {formatCurrency(lucroOriginal)}</p>
      <p>Lucro após simulação: {formatCurrency(lucroNovo)}</p>
      <p>Diferença: {diferencaLucro}%</p>
    </div>
  );
}