import { useState, useRef } from 'react';
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { CurrencyInput } from "./components/ui/currency-input";
import { PercentageInput } from "./components/ui/percentage-input";
import { CollapsibleCard } from "./components/ui/collapsible-card";
import { PieChartComponent, BarChartComponent } from "./components/ui/charts";
import { PdfButton } from "./components/ui/pdf-button";
import { ResultSection } from "./components/ui/result-section";
import * as XLSX from 'xlsx';

const formatCurrency = (value: number) => 
  isFinite(value) ? 
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 
  'R$ 0,00';

export default function SimuladorFinanceiro() {
  const diagnosticoRef = useRef<HTMLDivElement>(null);
  
  // State variables
  const [receita, setReceita] = useState(30000);
  const [custos, setCustos] = useState(5000);
  const [despesas, setDespesas] = useState(18000);
  const [investimentos, setInvestimentos] = useState(0);
  const [receitaVar, setReceitaVar] = useState(0);
  const [custosVar, setCustosVar] = useState(0);
  const [despesasVar, setDespesasVar] = useState(0);

  // Provisões
  const [folhaPagamento, setFolhaPagamento] = useState(10000);
  const [custoVeiculos, setCustoVeiculos] = useState(2000);
  const [despesaGarantia, setDespesaGarantia] = useState(1600);

  // Depreciações
  const [ativoImobilizado, setAtivoImobilizado] = useState(100000);
  const [taxaDepreciacaoAtivo, setTaxaDepreciacaoAtivo] = useState(10);
  const [investimentoVeiculos, setInvestimentoVeiculos] = useState(500000);
  const [taxaDepreciacaoVeiculos, setTaxaDepreciacaoVeiculos] = useState(4);

  // Custo de Capital
  const [valorInvestido, setValorInvestido] = useState(1000000);
  const [taxaReferencia, setTaxaReferencia] = useState(12);

  // Cálculos
  const calcularResultados = (base: number, variacao: number) => base * (1 + variacao / 100);

  const receitaNova = calcularResultados(receita, receitaVar);
  const custosNovos = calcularResultados(custos, custosVar);
  const despesasNovas = calcularResultados(despesas, despesasVar);

  const margemOriginal = receita - custos;
  const loaiOriginal = margemOriginal - despesas;
  const lucroOriginal = loaiOriginal - investimentos;

  const margemNova = receitaNova - custos;
  const lucroReceita = margemNova - despesas - investimentos;

  const margemComCustos = receita - custosNovos;
  const lucroCustos = margemComCustos - despesas - investimentos;

  const loaiComDespesas = receita - custos - despesasNovas;
  const lucroDespesas = loaiComDespesas - investimentos;

  const margemFinal = receitaNova - custosNovos;
  const loaiNovo = margemFinal - despesasNovas;
  const lucroNovo = loaiNovo - investimentos;

  const diferencaLucro = (((lucroNovo - lucroOriginal) / lucroOriginal) * 100).toFixed(1);

  // Cálculos de Provisões
  const provisaoPessoal = folhaPagamento * (0.0833 + 0.1111 + 0.28);
  const provisaoManutencao = custoVeiculos;
  const provisaoGarantia = despesaGarantia;
  const totalProvisoes = provisaoPessoal + provisaoManutencao + provisaoGarantia;

  // Cálculos de Depreciações
  const depreciacaoAtivo = (ativoImobilizado * (taxaDepreciacaoAtivo / 100)) / 12;
  const depreciacaoVeiculos = (investimentoVeiculos * (taxaDepreciacaoVeiculos / 100)) / 12;
  const totalDepreciacoes = depreciacaoAtivo + depreciacaoVeiculos;

  // Cálculo do Custo de Capital
  const custoCapital = (valorInvestido * (taxaReferencia / 100)) / 12;

  // Resultado Final
  const resultadoFinal = lucroOriginal - totalProvisoes - totalDepreciacoes - custoCapital;

  const ValueCell = ({ value, isProfit = false }: { value: number; isProfit?: boolean }) => {
    const colorClass = value >= 0 ? 'text-green-600' : 'text-red-600';
    const baseClass = "flex items-center justify-end gap-1";
    const finalClass = isProfit ? `${baseClass} ${colorClass} font-bold` : `${baseClass} ${colorClass}`;

    return (
      <td className={finalClass}>
        <span className="font-bold">
          {value >= 0 ? '+' : '-'}
        </span>
        <span>{formatCurrency(Math.abs(value))}</span>
      </td>
    );
  };

  const PercentageCell = ({ value, isColored = true }: { value: number; isColored?: boolean }) => {
    const colorClass = isColored ? (value >= 0 ? 'text-green-600' : 'text-red-600') : '';
    return (
      <td className={`text-right ${colorClass}`}>
        {value.toFixed(1)}%
      </td>
    );
  };

  const ResultRow = ({ 
    label, 
    value, 
    percentage, 
    difference = null,
    isProfit = false 
  }: { 
    label: string; 
    value: number; 
    percentage: string | number;
    difference?: string | null;
    isProfit?: boolean;
  }) => {
    const colorClass = value >= 0 ? 'text-green-600' : 'text-red-600';
    const rowClass = isProfit ? `font-bold ${colorClass}` : '';

    return (
      <tr className={rowClass}>
        <td>{label}</td>
        <td className="text-right">{formatCurrency(value)}</td>
        <td className="text-right">{percentage}%</td>
        {difference !== null && <td className="text-right">{difference}%</td>}
      </tr>
    );
  };

  const impactoReceita = receitaVar !== 0 ? lucroReceita - lucroOriginal : 0;
  const impactoCustos = custosVar !== 0 ? lucroCustos - lucroOriginal : 0;
  const impactoDespesas = despesasVar !== 0 ? lucroDespesas - lucroOriginal : 0;

  const percentual = (valor: number) => ((valor / receitaNova) * 100).toFixed(1);
  const diferenca = (novo: number, antigo: number) => (((novo - antigo) / antigo) * 100).toFixed(1);

  const custosPorcentagem = custos / receita;
  const margemContribuicaoUnitaria = 1 - custosPorcentagem;
  const custosFixosTotais = despesas + investimentos;
  const pontoEquilibrio = custosFixosTotais / margemContribuicaoUnitaria;
  
  const lucroPercentual = ((lucroOriginal / receita) * 100).toFixed(0);

  // Dados para os gráficos
  const pieChartData = [
    { name: 'CV', value: custos },
    { name: 'DF', value: despesas },
    { name: 'LO', value: lucroOriginal }
  ];

  const barChartData = [
    { name: 'Ativo Imobilizado', value: ativoImobilizado },
    { name: 'Veículos', value: investimentoVeiculos },
    { name: 'Estoque + Outros', value: valorInvestido }
  ];

  // Função para exportar para Excel
  const exportarParaExcel = () => {
    const dados = [
      ['Descrição', 'Valor Mensal', '%Receita'],
      ['Receita', receita, '100%'],
      ['Lucro Operacional', lucroOriginal, `${((lucroOriginal/receita)*100).toFixed(1)}%`],
      ['Provisões', '', ''],
      ['- Pessoal', provisaoPessoal, `${((provisaoPessoal/receita)*100).toFixed(1)}%`],
      ['- Manutenção', provisaoManutencao, `${((provisaoManutencao/receita)*100).toFixed(1)}%`],
      ['- Garantias', provisaoGarantia, `${((provisaoGarantia/receita)*100).toFixed(1)}%`],
      ['Total Provisões', totalProvisoes, `${((totalProvisoes/receita)*100).toFixed(1)}%`],
      ['Depreciações', '', ''],
      ['- Ativo Imobilizado', depreciacaoAtivo, `${((depreciacaoAtivo/receita)*100).toFixed(1)}%`],
      ['- Veículos', depreciacaoVeiculos, `${((depreciacaoVeiculos/receita)*100).toFixed(1)}%`],
      ['Total Depreciações', totalDepreciacoes, `${((totalDepreciacoes/receita)*100).toFixed(1)}%`],
      ['Custo de Oportunidade', custoCapital, `${((custoCapital/receita)*100).toFixed(1)}%`],
      ['Resultado Final', resultadoFinal, `${((resultadoFinal/receita)*100).toFixed(1)}%`]
    ];

    const ws = XLSX.utils.aoa_to_sheet(dados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Relatório Financeiro');
    XLSX.writeFile(wb, 'relatorio-financeiro.xlsx');
  };

  return (
    <div className="p-6 grid grid-cols-1 gap-6 max-w-5xl mx-auto" ref={diagnosticoRef}>
      <CollapsibleCard title="Clareza financeira">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Diagnóstico do ISF</h2>
          <PdfButton targetRef={diagnosticoRef} />
        </div>
        
        <div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Receita</p>
              <p className="text-xl font-bold">{formatCurrency(receita)}</p>
              <p className="text-muted-foreground text-xs">Média mensal</p>
            </div>
            <div>
              <p className="text-muted-foreground">Ponto de equilíbrio</p>
              <p className="text-xl font-bold">
                {formatCurrency(pontoEquilibrio)}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-muted-foreground">Lucro</p>
            <div className="flex items-center justify-between">
              <p className={`text-xl font-bold ${lucroOriginal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(lucroOriginal)}
              </p>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Ideal: acima de 13%</p>
                <p className={`text-xl font-bold ${Number(lucroPercentual) >= 13 ? 'text-green-600' : 'text-red-600'}`}>
                  {lucroPercentual}%
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-semibold">Índice de saúde financeira</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-sm">10</div>
              <div className="text-xs text-muted-foreground">Segurança</div>
              <div className="text-xs text-muted-foreground">Eficiência</div>
              <div className="text-xs text-muted-foreground">Tendência</div>
            </div>
          </div>
        </div>
      </CollapsibleCard>

      <CollapsibleCard title="Resumo do Fluxo de Caixa do Período">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <Label>Receita</Label>
            <CurrencyInput value={receita} onChange={setReceita} />
          </div>
          <div>
            <Label>Custos Variáveis</Label>
            <CurrencyInput value={custos} onChange={setCustos} />
          </div>
          <div>
            <Label>Despesas Fixas</Label>
            <CurrencyInput value={despesas} onChange={setDespesas} />
          </div>
          <div>
            <Label>Investimentos</Label>
            <CurrencyInput value={investimentos} onChange={setInvestimentos} />
          </div>
        </div>
        <table className="w-full text-left border-separate border-spacing-y-2 mt-6">
          <thead>
            <tr>
              <th>Descrição</th>
              <th className="text-right">Média mensal</th>
              <th className="text-right">%</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Receita</td>
              <ValueCell value={receita} />
              <PercentageCell value={100} isColored={false} />
            </tr>
            <tr>
              <td>Custos variáveis</td>
              <ValueCell value={-custos} />
              <PercentageCell value={-((custos / receita) * 100)} />
            </tr>
            <tr>
              <td>Margem de contribuição</td>
              <ValueCell value={margemOriginal} />
              <PercentageCell value={(margemOriginal / receita) * 100} />
            </tr>
            <tr>
              <td>Despesas fixas</td>
              <ValueCell value={-despesas} />
              <PercentageCell value={-((despesas / receita) * 100)} />
            </tr>
            <tr>
              <td>LOAI</td>
              <ValueCell value={loaiOriginal} />
              <PercentageCell value={(loaiOriginal / receita) * 100} />
            </tr>
            <tr>
              <td>Investimentos</td>
              <ValueCell value={-investimentos} />
              <PercentageCell value={-((investimentos / receita) * 100)} />
            </tr>
            <tr className={lucroOriginal >= 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
              <td>Lucro operacional</td>
              <ValueCell value={lucroOriginal} isProfit={true} />
              <PercentageCell value={(lucroOriginal / receita) * 100} />
            </tr>
          </tbody>
        </table>
      </CollapsibleCard>

      <CollapsibleCard title="Simular alterações (%)">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Receita</Label>
            <PercentageInput value={receitaVar} onChange={setReceitaVar} />
            <p className={`text-sm mt-1 font-bold ${impactoReceita >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(impactoReceita)}
            </p>
          </div>
          <div>
            <Label>Custos Variáveis</Label>
            <PercentageInput value={custosVar} onChange={setCustosVar} />
            <p className={`text-sm mt-1 font-bold ${impactoCustos >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(impactoCustos)}
            </p>
          </div>
          <div>
            <Label>Despesas Fixas</Label>
            <PercentageInput value={despesasVar} onChange={setDespesasVar} />
            <p className={`text-sm mt-1 font-bold ${impactoDespesas >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(impactoDespesas)}
            </p>
          </div>
        </div>
      </CollapsibleCard>

      <CollapsibleCard title="Resumo do Fluxo de Caixa após as Alterações">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th>Descrição</th>
              <th className="text-right">Média mensal</th>
              <th className="text-right">%</th>
              <th className="text-right">Diferença</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Receita</td>
              <ValueCell value={receitaNova} />
              <PercentageCell value={100} isColored={false} />
              <td className="text-right">{diferenca(receitaNova, receita)}%</td>
            </tr>
            <tr>
              <td>Custos variáveis</td>
              <ValueCell value={-custosNovos} />
              <PercentageCell value={-Number(percentual(custosNovos))} />
              <td className="text-right">{diferenca(custosNovos, custos)}%</td>
            </tr>
            <tr>
              <td>Margem de contribuição</td>
              <ValueCell value={margemFinal} />
              <PercentageCell value={Number(percentual(margemFinal))} />
              <td className="text-right">{diferenca(margemFinal, receita - custos)}%</td>
            </tr>
            <tr>
              <td>Despesas fixas</td>
              <ValueCell value={-despesasNovas} />
              <PercentageCell value={-Number(percentual(despesasNovas))} />
              <td className="text-right">{diferenca(despesasNovas, despesas)}%</td>
            </tr>
            <tr>
              <td>LOAI</td>
              <ValueCell value={loaiNovo} />
              <PercentageCell value={Number(percentual(loaiNovo))} />
              <td className="text-right">{diferenca(loaiNovo, loaiOriginal)}%</td>
            </tr>
            <tr>
              <td>Investimentos</td>
              <ValueCell value={-investimentos} />
              <PercentageCell value={-Number(percentual(investimentos))} />
              <td className="text-right">0.0%</td>
            </tr>
            <tr className={lucroNovo >= 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
              <td>Lucro operacional</td>
              <ValueCell value={lucroNovo} isProfit={true} />
              <PercentageCell value={Number(percentual(lucroNovo))} />
              <td className="text-right">{diferencaLucro}%</td>
            </tr>
          </tbody>
        </table>
        <div className={`font-bold text-right px-4 py-2 text-lg ${Number(diferencaLucro) >= 0 ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          TOTAL DE DIFERENÇA NO LUCRO: {diferencaLucro}%
        </div>
      </CollapsibleCard>

      <CollapsibleCard title="Provisões, Depreciações e Custo de Capital">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Provisões, Depreciações e Custo de Capital</h2>
          <button
            onClick={exportarParaExcel}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Exportar para Excel
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Provisões */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Folha de Pagamento{" "}
              <span className="font-normal text-sm text-muted-foreground">
                (não influencia no custo fixo/variável, apenas como referência para encargos de 13º salário, férias e outros)
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Folha de Pagamento</Label>
                <CurrencyInput value={folhaPagamento} onChange={setFolhaPagamento} />
              </div>
              <div>
                <Label>Despesa Mensal Garantia Serviço</Label>
                <CurrencyInput value={despesaGarantia} onChange={setDespesaGarantia} />
              </div>
              <div>
                <Label>Custo Mensal com Veículos</Label>
                <CurrencyInput value={custoVeiculos} onChange={setCustoVeiculos} />
              </div>
            </div>
          </div>

          {/* Depreciações */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Ativo Imobilizado (CAPEX)</Label>
                <CurrencyInput value={ativoImobilizado} onChange={setAtivoImobilizado} />
              </div>
              <div>
                <Label>Depreciação Ativo Imobilizado</Label>
                <PercentageInput value={taxaDepreciacaoAtivo} onChange={setTaxaDepreciacaoAtivo} />
              </div>
              <div>
                <Label>Investimento em Veículos</Label>
                <CurrencyInput value={investimentoVeiculos} onChange={setInvestimentoVeiculos} />
              </div>
              <div>
                <Label>Depreciação Veículo</Label>
                <PercentageInput value={taxaDepreciacaoVeiculos} onChange={setTaxaDepreciacaoVeiculos} />
              </div>
            </div>
          </div>

          {/* Custo de Capital */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Valor Investido em Estoque + Outros Investimentos na Empresa</Label>
                <CurrencyInput value={valorInvestido} onChange={setValorInvestido} />
              </div>
              <div>
                <Label>Taxa de Referência de Custo de Oportunidade</Label>
                <PercentageInput value={taxaReferencia} onChange={setTaxaReferencia} />
              </div>
            </div>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Distribuição CV, DF e LO</h3>
              <PieChartComponent data={pieChartData} />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Investimentos</h3>
              <BarChartComponent data={barChartData} />
            </div>
          </div>

          <div className="mt-8">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th className="text-right">Valor Mensal</th>
                  <th className="text-right">% Receita</th>
                </tr>
              </thead>
              <tbody>
                <tr className={`font-bold ${lucroOriginal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <td>Lucro Operacional</td>
                  <td className="text-right">{formatCurrency(lucroOriginal)}</td>
                  <td className="text-right">{((lucroOriginal/receita)*100).toFixed(1)}%</td>
                </tr>
                <tr className="text-red-600">
                  <td>Total de Provisões</td>
                  <td className="text-right">{formatCurrency(-totalProvisoes)}</td>
                  <td className="text-right">{((totalProvisoes/receita)*100).toFixed(1)}%</td>
                </tr>
                <tr className="text-red-600">
                  <td>Total de Depreciações</td>
                  <td className="text-right">{formatCurrency(-totalDepreciacoes)}</td>
                  <td className="text-right">{((totalDepreciacoes/receita)*100).toFixed(1)}%</td>
                </tr>
                <tr className="text-red-600">
                  <td>Custo de Oportunidade</td>
                  <td className="text-right">{formatCurrency(-custoCapital)}</td>
                  <td className="text-right">{((custoCapital/receita)*100).toFixed(1)}%</td>
                </tr>
              </tbody>
            </table>
            <ResultSection 
              value={resultadoFinal}
              percentage={(resultadoFinal/receita)*100}
              isPositive={resultadoFinal >= 0}
            />
          </div>
        </div>
      </CollapsibleCard>

      <div className="grid grid-cols-4 sm:grid-cols-8 gap-4 mt-6">
        <div className="text-center p-4 rounded shadow bg-white cursor-pointer" title="Custos Variáveis: são os gastos que variam conforme o volume de vendas ou produção." onClick={() => alert('CV - Custos Variáveis: são os gastos que variam conforme o volume de vendas ou produção.')}>
          <p className="text-sm text-muted-foreground">CV</p>
          <p className="text-xl font-bold text-red-600">{((custos / receita) * 100).toFixed(0)}%</p>
          <p className="text-sm text-muted-foreground">{formatCurrency(custos)}</p>
        </div>
        <div className="text-center p-4 rounded shadow bg-white cursor-pointer" title="Margem de Contribuição: diferença entre a receita e os custos variáveis." onClick={() => alert('MC - Margem de Contribuição: diferença entre a receita e os custos variáveis.')}>
          <p className="text-sm text-muted-foreground">MC</p>
          <p className={`text-xl font-bold ${margemOriginal >= 0 ? 'text-green-600' : 'text-red-600'}`}>{(((receita - custos) / receita) * 100).toFixed(0)}%</p>
          <p className="text-sm text-muted-foreground">{formatCurrency(margemOriginal)}</p>
        </div>
        <div className="text-center p-4 rounded shadow bg-white cursor-pointer" title="Despesas Fixas: gastos que não variam com o volume de vendas, como aluguel e salários." onClick={() => alert('DF - Despesas Fixas: gastos que não variam com o volume de vendas, como aluguel e salários.')}>
          <p className="text-sm text-muted-foreground">DF</p>
          <p className="text-xl font-bold text-red-600">{((despesas / receita) * 100).toFixed(0)}%</p>
          <p className="text-sm text-muted-foreground">{formatCurrency(despesas)}</p>
        </div>
        <div className="text-center p-4 rounded shadow bg-white cursor-pointer" title="Lucro Operacional Antes dos Investimentos: lucro antes de considerar os investimentos realizados." onClick={() => alert('LOAI - Lucro Operacional Antes dos Investimentos: lucro antes de considerar os investimentos realizados.')}>
          <p className="text-sm text-muted-foreground">LOAI</p>
          <p className={`text-xl font-bold ${loaiOriginal >= 0 ? 'text-green-600' : 'text-red-600'}`}>{((loaiOriginal / receita) * 100).toFixed(0)}%</p>
          <p className="text-sm text-muted-foreground">{formatCurrency(loaiOriginal)}</p>
        </div>
        <div className="text-center p-4 rounded shadow bg-white cursor-pointer" title="Investimentos: valores aplicados para expansão, melhoria ou inovação." onClick={() => alert('INV - Investimentos: valores aplicados para expansão, melhoria ou inovação.')}>
          <p className="text-sm text-muted-foreground">INV</p>
          <p className="text-xl font-bold text-red-600">{((investimentos / receita) * 100).toFixed(0)}%</p>
          <p className="text-sm text-muted-foreground">{formatCurrency(investimentos)}</p>
        </div>
        <div className="text-center p-4 rounded shadow bg-white cursor-pointer" title="Lucro Operacional: resultado final após despesas e investimentos." onClick={() => alert('LO - Lucro Operacional: resultado final após despesas e investimentos.')}>
          <p className="text-sm text-muted-foreground">LO</p>
          <p className={`text-xl font-bold ${lucroOriginal >= 0 ? 'text-green-600' : 'text-red-600'}`}>{((lucroOriginal / receita) * 100).toFixed(0)}%</p>
          <p className="text-sm text-muted-foreground">{formatCurrency(lucroOriginal)}</p>
        </div>
        <div className="text-center p-4 rounded shadow bg-white cursor-pointer" title="Saídas Não Operacionais: despesas que não fazem parte da atividade principal da empresa." onClick={() => alert('SNO - Saídas Não Operacionais: despesas que não fazem parte da atividade principal da empresa.')}>
          <p className="text-sm text-muted-foreground">SNO</p>
          <p className="text-xl font-bold">0%</p>
          <p className="text-sm text-muted-foreground">{formatCurrency(0)}</p>
        </div>
        <div className="text-center p-4 rounded shadow bg-white cursor-pointer" title="Resultado Final: lucro após considerar todas as provisões, depreciações e custo de capital." onClick={() => alert('RF - Resultado Final: lucro após considerar todas as provisões, depreciações e custo de capital.')}>
          <p className="text-sm text-muted-foreground">RF</p>
          <p className={`text-xl font-bold ${resultadoFinal >= 0 ? 'text-green-600' : 'text-red-600'}`}>{((resultadoFinal / receita) * 100).toFixed(0)}%</p>
          <p className="text-sm text-muted-foreground">{formatCurrency(resultadoFinal)}</p>
        </div>
      </div>
    </div>
  );
}