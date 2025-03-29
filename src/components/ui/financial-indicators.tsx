import React from 'react';

interface IndicatorProps {
  label: string;
  value: number;
  targetValue: number;
  type: 'percentage' | 'currency';
}

const getHealthStatus = (value: number, target: number) => {
  const ratio = value / target;
  if (ratio >= 1.1) return { status: 'Ótimo', color: 'text-green-600' };
  if (ratio >= 0.9) return { status: 'Ideal', color: 'text-blue-600' };
  if (ratio >= 0.7) return { status: 'Atenção', color: 'text-yellow-600' };
  return { status: 'Oh no!', color: 'text-red-600' };
};

const getDiagnosticText = (indicator: string, value: number, target: number) => {
  const diff = ((value - target) / target) * 100;
  const isPositive = diff > 0;

  const messages = {
    CV: isPositive 
      ? `Você gastou ${diff.toFixed(0)}% a mais que o ideal. Busque reduzir custos.`
      : `Você gastou ${Math.abs(diff).toFixed(0)}% a menos que o ideal. Ótimo resultado!`,
    MC: value >= 60
      ? "Sua precificação está excelente. Mantenha a margem acima de 60%."
      : "Sua margem está abaixo do ideal. Considere revisar sua precificação.",
    DF: isPositive
      ? `Está ${diff.toFixed(0)}% acima do ideal. Reduza despesas fixas para melhorar seus resultados.`
      : `Está ${Math.abs(diff).toFixed(0)}% abaixo do ideal. Excelente controle de despesas!`,
  };

  return messages[indicator as keyof typeof messages] || "Analise os indicadores para melhorar seus resultados.";
};

export function FinancialIndicator({ label, value, targetValue, type }: IndicatorProps) {
  const { status, color } = getHealthStatus(value, targetValue);
  const diagnostic = getDiagnosticText(label, value, targetValue);

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg">{label}</h3>
        <span className={`${color} font-bold`}>
          {type === 'currency' 
            ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
            : `${value.toFixed(1)}%`}
        </span>
      </div>
      <div className="space-y-2">
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className={`h-full rounded-full ${color}`}
            style={{ width: `${Math.min((value / targetValue) * 100, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>0%</span>
          <span>{targetValue}%</span>
        </div>
        <p className="text-sm mt-2">{diagnostic}</p>
        <div className="text-sm font-medium mt-1">{status}</div>
      </div>
    </div>
  );
}

export function HealthIndex({ lucroOperacional, receitaTotal, targetMargin }: { 
  lucroOperacional: number;
  receitaTotal: number;
  targetMargin: number;
}) {
  const currentMargin = (lucroOperacional / receitaTotal) * 100;
  const score = Math.min(Math.max((currentMargin / targetMargin) * 10, 0), 10);
  
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-blue-600';
    if (score >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`${getScoreColor(score)} bg-blue-100 font-bold px-3 py-1 rounded-full text-sm`}>
        {score.toFixed(1)}
      </div>
      <div className="text-xs text-muted-foreground flex gap-2">
        <span className={score >= 4 ? 'font-bold' : ''}>Segurança</span>
        <span className={score >= 6 ? 'font-bold' : ''}>Eficiência</span>
        <span className={score >= 8 ? 'font-bold' : ''}>Tendência</span>
      </div>
    </div>
  );
}