import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { CurrencyInput } from "./components/ui/currency-input";
import { PercentageInput } from "./components/ui/percentage-input";
import { CollapsibleCard } from "./components/ui/collapsible-card";
import { PieChartComponent, BarChartComponent } from "./components/ui/charts";
import { PdfButton } from "./components/ui/pdf-button";
import { ResultSection } from "./components/ui/result-section";
import { Plus, Minus, Moon, Sun } from 'lucide-react';
import * as XLSX from 'xlsx';
import { ExpandableRow } from "./components/ui/expandable-row"; // deve gerar 3 colunas

const formatCurrency = (value: number) =>
  isFinite(value)
    ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : 'R$ 0,00';

/**
 * Substitui NaN% por "0.0%" caso base seja 0 ou cálculo inválido.
 */
const formatPercentage = (value: number, base: number) => {
  if (!isFinite(value) || !isFinite(base) || base === 0) {
    return '0.0%';
  }
  const result = (value / base) * 100;
  if (isNaN(result)) {
    return '0.0%';
  }
  return `${result.toFixed(1)}%`;
};

/**
 * Para exibir valores em %.toFixed(0) sem gerar NaN% quando base=0.
 */
function safeFixed0(numerador: number, denominador: number) {
  if (!isFinite(numerador) || !isFinite(denominador) || denominador === 0) {
    return '0';
  }
  const res = (numerador / denominador) * 100;
  if (isNaN(res)) {
    return '0';
  }
  return res.toFixed(0);
}

const calcularIndiceSaudeFinanceira = (lucro: number, custos: number, despesas: number, investimentos: number) => {
  // Total de custos (custos variáveis + despesas fixas + investimentos)
  const custoTotal = custos + despesas + investimentos;
  if (custoTotal === 0) return 0;
  const proporcao = lucro / custoTotal;
  const nota = Math.max(0, Math.min(10, (proporcao / 3) * 10));
  return Number(nota.toFixed(1));
};

export default function SimuladorFinanceiro() {
  const diagnosticoRef = useRef<HTMLDivElement>(null);

  // Estado para dark mode com ícones de Lua/Sol
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // State variables (valores base)
  const [receita, setReceita] = useState(30000);
  const [custos, setCustos] = useState(5000);
  const [despesas, setDespesas] = useState(18000);
  const [investimentos, setInvestimentos] = useState(0);

  // Função para limpar os campos do "Resumo do Fluxo de Caixa do Período"
  const handleClearResumoFields = () => {
    setReceita(0);
    setCustos(0);
    setDespesas(0);
    setInvestimentos(0);
  };
// Variáveis de simulação (variação em %),para limpar campos
  const handleClearSimulacao = () => {
  setReceitaVar(0);
  setCustosVar(0);
  setDespesasVar(0);
};

  // Variáveis de simulação (variação em %)
  const [receitaVar, setReceitaVar] = useState(0);
  const [custosVar, setCustosVar] = useState(0);
  const [despesasVar, setDespesasVar] = useState(0);

  // Estado para o valor ideal (dinâmico)
  const [idealPercentual, setIdealPercentual] = useState(13);

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

  // Ajuste de percentual (somente para simulação)
  const adjustPercentage = (currentValue: number, adjustment: number, setValue: (value: number) => void) => {
    const newValue = currentValue + adjustment;
    if (newValue >= -100 && newValue <= 1000) {
      setValue(newValue);
    }
  };

  // Cálculos base (sem variação)
  const margemOriginal = receita - custos;
  const loaiOriginal = margemOriginal - despesas;
  const lucroOriginal = loaiOriginal - investimentos;

  // Cálculos simulados (após alteração)
  const calcularResultados = (base: number, variacao: number) => {
    const fator = 1 + (variacao / 100);
    return Math.max(0, base * fator);
  };

  const receitaNova = calcularResultados(receita, receitaVar);
  const custosNovos = calcularResultados(custos, custosVar);
  const despesasNovas = calcularResultados(despesas, despesasVar);
  const margemNova = receitaNova - custosNovos;
  const loaiNovo = margemNova - despesasNovas;
  const lucroNovo = loaiNovo - investimentos;

  const impactoReceita = receitaVar !== 0 ? lucroNovo - lucroOriginal : 0;
  const impactoCustos = custosVar !== 0 ? -(custosNovos - custos) : 0;
  const impactoDespesas = despesasVar !== 0 ? -(despesasNovas - despesas) : 0;

  const diferencaLucro =
    lucroOriginal !== 0
      ? (((lucroNovo - lucroOriginal) / Math.abs(lucroOriginal)) * 100).toFixed(1)
      : '0.0';

  // Provisões
  const provisaoPessoal = folhaPagamento * (0.0833 + 0.1111 + 0.28);
  const provisaoManutencao = custoVeiculos;
  const provisaoGarantia = despesaGarantia;
  const totalProvisoes = provisaoPessoal + provisaoManutencao + provisaoGarantia;

  // Depreciações
  const depreciacaoAtivo = (ativoImobilizado * (taxaDepreciacaoAtivo / 100)) / 12;
  const depreciacaoVeiculos = (investimentoVeiculos * (taxaDepreciacaoVeiculos / 100)) / 12;
  const totalDepreciacoes = depreciacaoAtivo + depreciacaoVeiculos;

  // Cálculo do Custo de Capital considerando todos os investimentos
const valorTotalInvestido = valorInvestido + investimentoVeiculos + ativoImobilizado;
const custoCapital = (valorTotalInvestido * (taxaReferencia / 100)) / 12;

  // Resultado Final
  const resultadoFinal = lucroOriginal - totalProvisoes - totalDepreciacoes - custoCapital;

  // Para exibição do ponto de equilíbrio e % lucro (base)
  const custosPorcentagem = custos / receita;
  const margemContribuicaoUnitaria = 1 - custosPorcentagem;
  const custosFixosTotais = despesas + investimentos;
  const pontoEquilibrio = custosFixosTotais / margemContribuicaoUnitaria;
  const lucroPercentual = isFinite((lucroOriginal / receita) * 100) && receita !== 0
    ? ((lucroOriginal / receita) * 100).toFixed(0)
    : '0';

  // Dados para gráficos
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

  // Exportar para Excel
  const exportarParaExcel = () => {
    const dados = [
      ['Descrição', 'Valor Mensal', '%Receita'],
      ['Receita', receita, '100%'],
      ['Lucro Operacional', lucroOriginal, formatPercentage(lucroOriginal, receita)],
      ['Provisões', '', ''],
      ['- Pessoal', provisaoPessoal, formatPercentage(provisaoPessoal, receita)],
      ['- Manutenção', provisaoManutencao, formatPercentage(provisaoManutencao, receita)],
      ['- Garantias', provisaoGarantia, formatPercentage(provisaoGarantia, receita)],
      ['Total Provisões', totalProvisoes, formatPercentage(totalProvisoes, receita)],
      ['Depreciações', '', ''],
      ['- Ativo Imobilizado', depreciacaoAtivo, formatPercentage(depreciacaoAtivo, receita)],
      ['- Veículos', depreciacaoVeiculos, formatPercentage(depreciacaoVeiculos, receita)],
      ['Total Depreciações', totalDepreciacoes, formatPercentage(totalDepreciacoes, receita)],
      ['Custo de Oportunidade', custoCapital, formatPercentage(custoCapital, receita)],
      ['Resultado Final', resultadoFinal, formatPercentage(resultadoFinal, receita)]
    ];

    const ws = XLSX.utils.aoa_to_sheet(dados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Relatório Financeiro');
    XLSX.writeFile(wb, 'relatorio-financeiro.xlsx');
  };

  // Botão para limpar os campos de provisões, depreciações e custo de capital
  const handleClearProvisoesDepreciacoes = () => {
    setFolhaPagamento(0);
    setDespesaGarantia(0);
    setCustoVeiculos(0);
    setAtivoImobilizado(0);
    setTaxaDepreciacaoAtivo(0);
    setInvestimentoVeiculos(0);
    setTaxaDepreciacaoVeiculos(0);
    setValorInvestido(0);
    setTaxaReferencia(0);
  };

  // Função para limpar todos os campos (estado base e simulação)
  const handleClearFields = () => {
    setReceita(0);
    setCustos(0);
    setDespesas(0);
    setInvestimentos(0);
    setReceitaVar(0);
    setCustosVar(0);
    setDespesasVar(0);
    setFolhaPagamento(0);
    setCustoVeiculos(0);
    setDespesaGarantia(0);
    setAtivoImobilizado(0);
    setTaxaDepreciacaoAtivo(0);
    setInvestimentoVeiculos(0);
    setTaxaDepreciacaoVeiculos(0);
    setValorInvestido(0);
    setTaxaReferencia(0);
    setIdealPercentual(0);
  };

  /**
   * Se receitaNova for zero ou inválida, retorna "0.0".
   * Caso contrário, retorna valor calculado em até 1 casa decimal.
   */
  const percentual = (valor: number) => {
    if (!isFinite(receitaNova) || receitaNova === 0 || !isFinite(valor)) {
      return '0.0';
    }
    const calc = (valor / receitaNova) * 100;
    if (isNaN(calc)) {
      return '0.0';
    }
    return calc.toFixed(1);
  };

  /**
   * Se antigo for zero ou inválido, retorna "0.0".
   * Caso contrário, retorna diferença em %.
   */
  const diferenca = (novo: number, antigo: number) => {
    if (!isFinite(novo) || !isFinite(antigo) || antigo === 0) {
      return '0.0';
    }
    const calc = ((novo - antigo) / antigo) * 100;
    if (isNaN(calc)) {
      return '0.0';
    }
    return calc.toFixed(1);
  };

  // ====== INÍCIO DAS MELHORIAS PEDIDAS ======

  // 1) Reorganizar Clareza Financeira: deixamos mais compacta.
  // 2) Renomear e mover botão PDF para "Gerar Diagnostico" no final.
  // 3) Rotacionar e alinhar labels do gráfico de barras no BarChart.

  return (
    <>
      {/* Botão fixo para alternar dark mode com ícones */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="
          fixed top-4 right-4 z-50 p-2 rounded shadow-md
          bg-white dark:bg-zinc-800
          hover:bg-gray-100 dark:hover:bg-zinc-700
          transition-colors
        "
      >
        {darkMode ? (
          <Sun className="w-5 h-5 text-yellow-400" />
        ) : (
          <Moon className="w-5 h-5 text-blue-400" />
        )}
      </button>

      {/* Container principal responsivo – o fundo é definido pelo body (branco) */}
<div
  id="diagnostico-content"
  ref={diagnosticoRef}
  className="p-4 sm:p-6 md:p-8 grid gap-6 max-w-5xl mx-auto text-black dark:text-white transition-colors"
>

        {/* Clareza Financeira (reorganizado/compacto) */}
        <CollapsibleCard title="Clareza financeira">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Bloco 1: Receita */}
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded space-y-1">
              <p className="font-semibold">Receita</p>
              <p className="text-xl font-bold">
                {formatCurrency(receita)}
              </p>
              <p className="text-xs">Média mensal</p>
            </div>
            {/* Bloco 2: Ponto de equilíbrio */}
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded space-y-1">
              <p className="font-semibold">Ponto de equilíbrio</p>
              <p className="text-xl font-bold">
                {formatCurrency((despesas + investimentos) / (1 - (custos / receita)))}
              </p>
              <p className="text-xs">Receita mínima para não ter prejuízo</p>
            </div>
            {/* Bloco 3: Lucro */}
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded space-y-1">
              <p className="font-semibold">Lucro</p>
              <p className={`text-xl font-bold ${lucroOriginal >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(lucroOriginal)}
              </p>
              <p className="text-xs">
                Ideal acima de {idealPercentual}%
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            {/* Campo Ideal (%) + Exibição */}
            <div className="flex items-center gap-2">
              <Label>Ideal (%)</Label>
              <input
                type="number"
                className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1 w-16 bg-white text-black"
                value={idealPercentual}
                onChange={(e) => setIdealPercentual(Number(e.target.value))}
              />
              <p
                className={`text-xl font-bold ${
                  Number(lucroPercentual) >= idealPercentual
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {lucroPercentual}%
              </p>
            </div>

            <div className="flex justify-end">
  {/* Botão para limpar todos os campos */}
  <button
    onClick={handleClearFields}
    className="
      px-4 py-2
      rounded
      font-semibold
      transition-colors
      bg-gray-200 hover:bg-gray-300 text-black
      dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white
    "
  >
    Limpar Todos os Campos
  </button>
</div>
          </div>
        </CollapsibleCard>

        {/* Resumo do Fluxo de Caixa do Período */}
        <CollapsibleCard title="Resumo do Fluxo de Caixa do Período">
          {/* (Mantemos exatamente todo o seu código dessa seção) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 grid-resumo">
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
          <div className="mt-4 flex justify-end">
  <button
    onClick={handleClearResumoFields}
    className="
      px-4 py-2
      rounded
      font-semibold
      transition-colors
      bg-gray-200 hover:bg-gray-300 text-black
      dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white
    "
  >
    Limpar Campos
  </button>
</div>
          {/* Container da tabela: overflow horizontal apenas em telas pequenas */}
          <div className="overflow-x-auto md:overflow-x-visible max-w-full mt-6">
            <table className="w-full text-left border-separate border-spacing-y-2 border-spacing-x-2 sm:border-spacing-x-4 md:border-spacing-x-6">
              <thead>
                <tr>
                  <th className="text-left">Descrição</th>
                  <th className="text-right pr-2 sm:pr-6">Média mensal</th>
                  <th className="text-right pr-2 sm:pr-6">% Receita</th>
                  <th className="text-right pr-2 sm:pr-6">Diferença</th>
                </tr>
              </thead>
              <tbody>
                {/* ... Mantemos todas as linhas da tabela ... */}
                <tr>
                  <td>Receita</td>
                  <td className="text-right pr-2 sm:pr-6 text-green-600 font-bold">
                    {formatCurrency(receitaNova)}
                  </td>
                  <td className="text-right pr-2 sm:pr-6">100.0%</td>
                  <td className="text-right pr-2 sm:pr-6">{diferenca(receitaNova, receita)}%</td>
                </tr>
                <tr>
                  <td>Custos variáveis</td>
                  <td className="text-right pr-2 sm:pr-6 text-red-600">
                    {formatCurrency(-custosNovos)}
                  </td>
                  <td className="text-right pr-2 sm:pr-6">
                    {(-Number(percentual(custosNovos))).toFixed(1)}%
                  </td>
                  <td className="text-right pr-2 sm:pr-6">{diferenca(custosNovos, custos)}%</td>
                </tr>
                <tr>
                  <td>Margem de contribuição</td>
                  <td className="text-right pr-2 sm:pr-6 text-green-600">
                    {formatCurrency(margemNova)}
                  </td>
                  <td className="text-right pr-2 sm:pr-6">{Number(percentual(margemNova))}%</td>
                  <td className="text-right pr-2 sm:pr-6">{diferenca(margemNova, margemOriginal)}%</td>
                </tr>
                <tr>
                  <td>Despesas fixas</td>
                  <td className="text-right pr-2 sm:pr-6 text-red-600">
                    {formatCurrency(-despesasNovas)}
                  </td>
                  <td className="text-right pr-2 sm:pr-6">
                    {(-Number(percentual(despesasNovas))).toFixed(1)}%
                  </td>
                  <td className="text-right pr-2 sm:pr-6">{diferenca(despesasNovas, despesas)}%</td>
                </tr>
                <tr>
                  <td>LOAI</td>
                  <td className="text-right pr-2 sm:pr-6">
                    {formatCurrency(loaiNovo)}
                  </td>
                  <td className="text-right pr-2 sm:pr-6">{Number(percentual(loaiNovo))}%</td>
                  <td className="text-right pr-2 sm:pr-6">{diferenca(loaiNovo, loaiOriginal)}%</td>
                </tr>
                <tr>
                  <td>Investimentos</td>
                  <td className="text-right pr-2 sm:pr-6 text-red-600">
                    {formatCurrency(-investimentos)}
                  </td>
                  <td className="text-right pr-2 sm:pr-6">
                    {(-Number(percentual(investimentos))).toFixed(1)}%
                  </td>
                  <td className="text-right pr-2 sm:pr-6">0.0%</td>
                </tr>
                <tr
                  className={
                    lucroOriginal >= 0
                      ? "text-green-600 font-bold"
                      : "text-red-600 font-bold"
                  }
                >
                  <td>Lucro operacional</td>
                  <td className="text-right pr-2 sm:pr-6">{formatCurrency(lucroNovo)}</td>
                  <td className="text-right pr-2 sm:pr-6">{Number(percentual(lucroNovo))}%</td>
                  <td className="text-right pr-2 sm:pr-6">{diferencaLucro}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CollapsibleCard>

        {/* Simular alterações (%) */}
<CollapsibleCard title="Simular alterações (%)">
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 grid-simulacao">
    <div>
      <Label>Receita</Label>
      <div className="flex items-center gap-2">
        <button
          onClick={() => adjustPercentage(receitaVar, -1, setReceitaVar)}
          className="p-2 rounded bg-gray-9 hover:bg-gray-1000"
        >
          <Minus size={16} />
        </button>
        <PercentageInput value={receitaVar} onChange={setReceitaVar} />
        <button
          onClick={() => adjustPercentage(receitaVar, 1, setReceitaVar)}
          className="p-2 rounded bg-gray-1000 hover:bg-gray-200"
        >
          <Plus size={16} />
        </button>
      </div>
      <p className={`text-sm mt-1 font-bold ${impactoReceita >= 0 ? "text-green-600" : "text-red-600"}`}>
        {formatCurrency(impactoReceita)}
      </p>
    </div>
    <div>
      <Label>Custos Variáveis</Label>
      <div className="flex items-center gap-2">
        <button
          onClick={() => adjustPercentage(custosVar, -1, setCustosVar)}
          className="p-2 rounded bg-gray-9 hover:bg-gray-1000"
        >
          <Minus size={16} />
        </button>
        <PercentageInput value={custosVar} onChange={setCustosVar} />
        <button
          onClick={() => adjustPercentage(custosVar, 1, setCustosVar)}
          className="p-2 rounded bg-gray-1000 hover:bg-gray-9"
        >
          <Plus size={16} />
        </button>
      </div>
      <p className={`text-sm mt-1 font-bold ${impactoCustos >= 0 ? "text-green-600" : "text-red-600"}`}>
        {formatCurrency(impactoCustos)}
      </p>
    </div>
    <div>
      <Label>Despesas Fixas</Label>
      <div className="flex items-center gap-2">
        <button
          onClick={() => adjustPercentage(despesasVar, -1, setDespesasVar)}
          className="p-2 rounded bg-gray-1000 hover:bg-gray-9"
        >
          <Minus size={16} />
        </button>
        <PercentageInput value={despesasVar} onChange={setDespesasVar} />
        <button
          onClick={() => adjustPercentage(despesasVar, 1, setDespesasVar)}
          className="p-2 rounded bg-gray-9 hover:bg-gray-1000"
        >
          <Plus size={16} />
        </button>
      </div>
      <p className={`text-sm mt-1 font-bold ${impactoDespesas >= 0 ? "text-green-600" : "text-red-600"}`}>
        {formatCurrency(impactoDespesas)}
      </p>
    </div>
  </div>
</CollapsibleCard>



        {/* Resumo do Fluxo de Caixa após as Alterações */}
        <CollapsibleCard title="Resumo do Fluxo de Caixa após as Alterações">
          <div className="overflow-x-auto md:overflow-x-visible max-w-full mt-6">
            <table className="w-full text-left border-separate border-spacing-y-2 border-spacing-x-2 sm:border-spacing-x-4 md:border-spacing-x-6">
              <thead>
                <tr>
                  <th className="text-left">Descrição</th>
                  <th className="text-right pr-2 sm:pr-6">Média mensal</th>
                  <th className="text-right pr-2 sm:pr-6">% Receita</th>
                  <th className="text-right pr-2 sm:pr-6">Diferença</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Receita</td>
                  <td className="text-right pr-2 sm:pr-6 text-green-600 font-bold">
                    {formatCurrency(receitaNova)}
                  </td>
                  <td className="text-right pr-2 sm:pr-6">100.0%</td>
                  <td className="text-right pr-2 sm:pr-6">{diferenca(receitaNova, receita)}%</td>
                </tr>
                <tr>
                  <td>Custos variáveis</td>
                  <td className="text-right pr-2 sm:pr-6 text-red-600">
                    {formatCurrency(-custosNovos)}
                  </td>
                  <td className="text-right pr-2 sm:pr-6">
                    {(-Number(percentual(custosNovos))).toFixed(1)}%
                  </td>
                  <td className="text-right pr-2 sm:pr-6">{diferenca(custosNovos, custos)}%</td>
                </tr>
                <tr>
                  <td>Margem de contribuição</td>
                  <td className="text-right pr-2 sm:pr-6 text-green-600">
                    {formatCurrency(margemNova)}
                  </td>
                  <td className="text-right pr-2 sm:pr-6">{Number(percentual(margemNova))}%</td>
                  <td className="text-right pr-2 sm:pr-6">{diferenca(margemNova, margemOriginal)}%</td>
                </tr>
                <tr>
                  <td>Despesas fixas</td>
                  <td className="text-right pr-2 sm:pr-6 text-red-600">
                    {formatCurrency(-despesasNovas)}
                  </td>
                  <td className="text-right pr-2 sm:pr-6">
                    {(-Number(percentual(despesasNovas))).toFixed(1)}%
                  </td>
                  <td className="text-right pr-2 sm:pr-6">{diferenca(despesasNovas, despesas)}%</td>
                </tr>
                <tr>
                  <td>LOAI</td>
                  <td className="text-right pr-2 sm:pr-6">
                    {formatCurrency(loaiNovo)}
                  </td>
                  <td className="text-right pr-2 sm:pr-6">{Number(percentual(loaiNovo))}%</td>
                  <td className="text-right pr-2 sm:pr-6">{diferenca(loaiNovo, loaiOriginal)}%</td>
                </tr>
                <tr>
                  <td>Investimentos</td>
                  <td className="text-right pr-2 sm:pr-6 text-red-600">
                    {formatCurrency(-investimentos)}
                  </td>
                  <td className="text-right pr-2 sm:pr-6">
                    {(-Number(percentual(investimentos))).toFixed(1)}%
                  </td>
                  <td className="text-right pr-2 sm:pr-6">0.0%</td>
                </tr>
                <tr
                  className={
                    lucroOriginal >= 0
                      ? "text-green-600 font-bold"
                      : "text-red-600 font-bold"
                  }
                >
                  <td>Lucro operacional</td>
                  <td className="text-right pr-2 sm:pr-6">{formatCurrency(lucroNovo)}</td>
                  <td className="text-right pr-2 sm:pr-6">{Number(percentual(lucroNovo))}%</td>
                  <td className="text-right pr-2 sm:pr-6">{diferencaLucro}%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            className={`font-bold text-right px-4 py-2 text-lg ${
              Number(diferencaLucro) >= 0 ? "bg-green-600 text-white" : "bg-red-600 text-white"
            }`}
          >
            TOTAL DE DIFERENÇA NO LUCRO: {diferencaLucro}%
          </div>
        </CollapsibleCard>

        {/* Provisões, Depreciações e Custo de Capital */}
        <CollapsibleCard title="Provisões, Depreciações e Custo de Capital">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Provisões, Depreciações e Custo de Capital</h2>
            <div className="flex gap-2 mt-4 md:mt-0">
              <button
                onClick={exportarParaExcel}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
              >
                Exportar para Excel
              </button>
              <button
                onClick={handleClearProvisoesDepreciacoes}
                className="bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white hover:bg-gray-300 text-black px-4 py-2 rounded shadow"
              >
                Limpar Campos
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 grid-provisoes">
            {/* Provisões */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <h3 className="text-lg font-semibold mb-4">
                  Distribuição: Custo Variável, Despesa Fixa e Lucro Operacional
                </h3>
                <PieChartComponent
                  data={[
                    { name: "Custo Variável", value: custos },
                    { name: "Despesa Fixa", value: despesas },
                    { name: "Lucro Operacional", value: lucroOriginal },
                  ]}
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Investimentos</h3>
                {/*
                  AQUI aplicamos a rotação no eixo X do BarChart, evitando cortes de texto.
                  Caso seu BarChartComponent aceite props do Recharts, podemos fazer algo como:

                  <BarChartComponent
                    data={barChartData}
                    xAxisProps={{
                      angle: -45,
                      textAnchor: "end",
                      interval: 0,
                    }}
                  />
                */}
                <BarChartComponent
                  data={barChartData}
                  // Exemplo: se seu BarChartComponent permitir passarmos xAxisProps
                  xAxisProps={{
                    angle: -45,
                    textAnchor: "end",
                    interval: 0,
                  }}
                />
              </div>
            </div>

            <div className="mt-8 overflow-x-auto md:overflow-x-visible max-w-full">
              <table className="w-full text-left border-separate border-spacing-y-2 border-spacing-x-2 sm:border-spacing-x-4 md:border-spacing-x-6">
                <thead>
                  <tr>
                    <th className="text-left">Descrição</th>
                    <th className="text-right pr-2 sm:pr-6">Valor Mensal</th>
                    <th className="text-right pr-2 sm:pr-6">% Receita</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Lucro Operacional */}
                  <tr
                    className={`font-bold ${
                      lucroOriginal >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <td>Lucro Operacional</td>
                    <td className="text-right pr-2 sm:pr-6">
                      {formatCurrency(lucroOriginal)}
                    </td>
                    <td className="text-right pr-2 sm:pr-6">
                      {formatPercentage(lucroOriginal, receita)}
                    </td>
                  </tr>
                  {/* ExpandableRow - Total de Provisões */}
                  <ExpandableRow
                    title="Total de Provisões"
                    amount={-totalProvisoes}
                    percentage={parseFloat(safeFixed0(totalProvisoes, receita))}
                    className="text-red-600"
                    details={[
                      {
                        title: "Provisão de Pessoal (13º, férias, encargos)",
                        amount: -(folhaPagamento * (0.0833 + 0.1111 + 0.28)),
                        percentage: parseFloat(safeFixed0((folhaPagamento * (0.0833 + 0.1111 + 0.28)), receita))
                      },
                      {
                        title: "Manutenção Veículos",
                        amount: -custoVeiculos,
                        percentage: parseFloat(safeFixed0(custoVeiculos, receita))
                      },
                      {
                        title: "Garantia Serviços",
                        amount: -despesaGarantia,
                        percentage: parseFloat(safeFixed0(despesaGarantia, receita))
                      },
                    ]}
                  />

                  {/* ExpandableRow - Total de Depreciações */}
                  <ExpandableRow
                    title="Total de Depreciações"
                    amount={-totalDepreciacoes}
                    percentage={parseFloat(safeFixed0(totalDepreciacoes, receita))}
                    className="text-red-600"
                    details={[
                      {
                        title: "Depreciação Ativo Imobilizado",
                        amount: -depreciacaoAtivo,
                        percentage: parseFloat(safeFixed0(depreciacaoAtivo, receita))
                      },
                      {
                        title: "Depreciação Veículos",
                        amount: -depreciacaoVeiculos,
                        percentage: parseFloat(safeFixed0(depreciacaoVeiculos, receita))
                      },
                    ]}
                  />

                  {/* ExpandableRow - Custo de Oportunidade */}
<ExpandableRow
  title="Custo de Oportunidade"
  amount={-custoCapital}
  percentage={parseFloat(safeFixed0(custoCapital, receita))}
  className="text-red-600"
  details={[
    {
      title: "Capital em Estoque e Outros",
      amount: -valorInvestido,
      percentage: parseFloat(safeFixed0(valorInvestido, receita))
    },
    {
      title: "Investimento em Veículos",
      amount: -investimentoVeiculos,
      percentage: parseFloat(safeFixed0(investimentoVeiculos, receita))
    },
    {
      title: "Ativo Imobilizado",
      amount: -ativoImobilizado,
      percentage: parseFloat(safeFixed0(ativoImobilizado, receita))
    }
  ]}
/>

                </tbody>
              </table>
              <ResultSection
                value={resultadoFinal}
                percentage={
                  isFinite(resultadoFinal) && isFinite(receita) && receita !== 0
                    ? (resultadoFinal / receita) * 100
                    : 0
                }
                isPositive={resultadoFinal >= 0}
              />
            </div>
          </div>
        </CollapsibleCard>

        {/* Indicadores finais (mantidos) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mt-6 indicadores-finais">
          <div
            className="text-center p-4 rounded shadow bg-white dark:bg-zinc-80 cursor-pointer"
            title="Custos Variáveis: são os gastos que variam conforme o volume de vendas ou produção."
            onClick={() =>
              alert(
                "CV - Custos Variáveis: são os gastos que variam conforme o volume de vendas ou produção."
              )
            }
          >
            <p className="text-sm text-gray-500">CV</p>
            <p className="text-xl font-bold text-red-600">
              {safeFixed0(custos, receita)}%
            </p>
            <p className="text-sm text-gray-500">{formatCurrency(custos)}</p>
          </div>
          <div
            className="text-center p-4 rounded shadow bg-white dark:bg-zinc-80 cursor-pointer"
            title="Margem de Contribuição: diferença entre a receita e os custos variáveis."
            onClick={() =>
              alert(
                "MC - Margem de Contribuição: diferença entre a receita e os custos variáveis."
              )
            }
          >
            <p className="text-sm text-gray-500">MC</p>
            <p
              className={`text-xl font-bold ${
                margemOriginal >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {safeFixed0((receita - custos), receita)}%
            </p>
            <p className="text-sm text-gray-500">{formatCurrency(margemOriginal)}</p>
          </div>
          <div
            className="text-center p-4 rounded shadow bg-white dark:bg-zinc-80 cursor-pointer"
            title="Despesas Fixas: gastos que não variam com o volume de vendas, como aluguel e salários."
            onClick={() =>
              alert(
                "DF - Despesas Fixas: gastos que não variam com o volume de vendas, como aluguel e salários."
              )
            }
          >
            <p className="text-sm text-gray-500">DF</p>
            <p className="text-xl font-bold text-red-600">
              {safeFixed0(despesas, receita)}%
            </p>
            <p className="text-sm text-gray-500">{formatCurrency(despesas)}</p>
          </div>
          <div
            className="text-center p-4 rounded shadow bg-white dark:bg-zinc-80 cursor-pointer"
            title="Lucro Operacional Antes dos Investimentos: lucro antes de considerar os investimentos realizados."
            onClick={() =>
              alert(
                "LOAI - Lucro Operacional Antes dos Investimentos: lucro antes de considerar os investimentos realizados."
              )
            }
          >
            <p className="text-sm text-gray-500">LOAI</p>
            <p
              className={`text-xl font-bold ${
                loaiOriginal >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {safeFixed0(loaiOriginal, receita)}%
            </p>
            <p className="text-sm text-gray-500">{formatCurrency(loaiOriginal)}</p>
          </div>
          <div
            className="text-center p-4 rounded shadow bg-white dark:bg-zinc-80 cursor-pointer"
            title="Investimentos: valores aplicados para expansão, melhoria ou inovação."
            onClick={() =>
              alert(
                "INV - Investimentos: valores aplicados para expansão, melhoria ou inovação."
              )
            }
          >
            <p className="text-sm text-gray-500">INV</p>
            <p className="text-xl font-bold text-red-600">
              {safeFixed0(investimentos, receita)}%
            </p>
            <p className="text-sm text-gray-500">{formatCurrency(investimentos)}</p>
          </div>
          <div
            className="text-center p-4 rounded shadow bg-white dark:bg-zinc-80 cursor-pointer"
            title="Lucro Operacional: resultado final após despesas e investimentos."
            onClick={() =>
              alert(
                "LO - Lucro Operacional: resultado final após despesas e investimentos."
              )
            }
          >
            <p className="text-sm text-gray-500">LO</p>
            <p
              className={`text-xl font-bold ${
                lucroOriginal >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {safeFixed0(lucroOriginal, receita)}%
            </p>
            <p className="text-sm text-gray-500">{formatCurrency(lucroOriginal)}</p>
          </div>
          <div
            className="text-center p-4 rounded shadow bg-white dark:bg-zinc-80 cursor-pointer"
            title="Saídas Não Operacionais: despesas que não fazem parte da atividade principal da empresa."
            onClick={() =>
              alert(
                "SNO - Saídas Não Operacionais: despesas que não fazem parte da atividade principal da empresa."
              )
            }
          >
            <p className="text-sm text-gray-500">SNO</p>
            <p className="text-xl font-bold">0%</p>
            <p className="text-sm text-gray-500">{formatCurrency(0)}</p>
          </div>
          <div
            className="text-center p-4 rounded shadow bg-white dark:bg-zinc-80 cursor-pointer"
            title="Resultado Final: lucro após considerar todas as provisões, depreciações e custo de capital."
            onClick={() =>
              alert(
                "RF - Resultado Final: lucro após considerar todas as provisões, depreciações e custo de capital."
              )
            }
          >
            <p className="text-sm text-gray-500">RF</p>
            <p
              className={`text-xl font-bold ${
                resultadoFinal >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {safeFixed0(resultadoFinal, receita)}%
            </p>
            <p className="text-sm text-gray-500">{formatCurrency(resultadoFinal)}</p>
          </div>
        </div>

        {/* Botão "Gerar Diagnostico" (PDF) no final da página */}
<div className="flex justify-end mt-6">
  <button
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow flex items-center gap-2"
    onClick={() => {
              // Acionamos o clique programático no PdfButton
              const pdfBtn = document.getElementById('pdfButtonTrigger');
              pdfBtn?.click();
            }}
          >
            Gerar Diagnostico
          </button>
        </div>
        {/* PdfButton "invisível", para acionarmos por JavaScript */}
        <div className="hidden">
          <PdfButton targetRef={diagnosticoRef} id="pdfButtonTrigger" />
        </div>
      </div>
    </>
  );
}
