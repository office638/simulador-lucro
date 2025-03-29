import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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
  const dataWithTotal = [...data, { name: 'Total Investido', value: total }];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={dataWithTotal}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
        <Bar dataKey="value" fill="#8884d8">
          {dataWithTotal.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={index === dataWithTotal.length - 1 ? COLORS[4] : COLORS[index % (COLORS.length - 1)]} 
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}