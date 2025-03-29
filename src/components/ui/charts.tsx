import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Label } from 'recharts';

interface ChartData {
  name: string;
  value: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#ff7300'];

export function PieChartComponent({ data }: { data: ChartData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function BarChartComponent({ data }: { data: ChartData[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Transform data for stacked bar chart
  const transformedData = [{
    name: 'Investimentos',
    'Ativo Imobilizado': data[0].value,
    'Veículos': data[1].value,
    'Estoque + Outros': data[2].value,
    total: total
  }];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={transformedData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip 
          formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          labelFormatter={() => 'Investimentos'}
        />
        <Bar dataKey="Ativo Imobilizado" stackId="a" fill={COLORS[0]} />
        <Bar dataKey="Veículos" stackId="a" fill={COLORS[1]} />
        <Bar dataKey="Estoque + Outros" stackId="a" fill={COLORS[2]} />
        <Label
          content={({ viewBox: { x, y, width, height } }) => {
            return (
              <text
                x={x + width / 2}
                y={y - 10}
                textAnchor="middle"
                fill="#666"
              >
                {`Total: ${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
              </text>
            );
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}