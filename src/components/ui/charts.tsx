import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export interface ChartData {
  name: string;
  value: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF7300'];

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
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) =>
            `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
          }
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function BarChartComponent({ data }: { data: ChartData[] }) {
  const chartData = [
    {
      name: 'Investimentos',
      ...data.reduce((acc, curr) => {
        acc[curr.name] = curr.value;
        return acc;
      }, {} as Record<string, number>),
    },
  ];

  const keys = data.map((d) => d.name);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, item) => sum + item.value, 0);
      return (
        <div style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc' }}>
          <p><strong>Investimentos</strong></p>
          {payload.map((item, index) => (
            <p key={index} style={{ color: item.fill, margin: 0 }}>
              {item.name} : R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          ))}
          <hr />
          <p><strong>Total: R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></p>
        </div>
      );
    }

    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        {keys.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            stackId="a"
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
