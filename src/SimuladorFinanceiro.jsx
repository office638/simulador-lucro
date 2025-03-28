import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <div className="p-6 grid grid-cols-1 gap-6 max-w-5xl mx-auto">
      <Card>
        <CardContent className="space-y-4 pt-6">
          <h2 className="text-xl font-bold">Resumo do Fluxo de Caixa do Período</h2>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label>Receita (R$)</Label>
              <Input type="number" value={receita} onChange={e => setReceita(Number(e.target.value))} />
            </div>
            <div>
              <Label>Custos Variáveis (R$)</Label>
              <Input type="number" value={custos} onChange={e => setCustos(Number(e.target.value))} />
            </div>
            <div>
              <Label>Despesas Fixas (R$)</Label>
              <Input type="number" value={despesas} onChange={e => setDespesas(Number(e.target.value))} />
            </div>
            <div>
              <Label>Investimentos (R$)</Label>
              <Input type="number" value={investimentos} onChange={e => setInvestimentos(Number(e.target.value))} />
            </div>
          </div>
          <table className="w-full text-left border-separate border-spacing-y-2 mt-6">
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Média mensal</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Receita</td><td>+ {formatCurrency(receita)}</td><td>100.0%</td></tr>
              <tr><td>Custos variáveis</td><td>- {formatCurrency(custos)}</td><td>{((custos / receita) * 100).toFixed(1)}%</td></tr>
              <tr><td>Margem de contribuição</td><td>+ {formatCurrency(receita - custos)}</td><td>{(((receita - custos) / receita) * 100).toFixed(1)}%</td></tr>
              <tr><td>Despesas fixas</td><td>- {formatCurrency(despesas)}</td><td>{((despesas / receita) * 100).toFixed(1)}%</td></tr>
              <tr><td>LOAI</td><td>+ {formatCurrency(loaiOriginal)}</td><td>{((loaiOriginal / receita) * 100).toFixed(1)}%</td></tr>
              <tr><td>Investimentos</td><td>+ {formatCurrency(investimentos)}</td><td>{((investimentos / receita) * 100).toFixed(1)}%</td></tr>
              <tr><td>Lucro operacional</td><td>+ {formatCurrency(lucroOriginal)}</td><td>{((lucroOriginal / receita) * 100).toFixed(1)}%</td></tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}