"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface SportData {
  sport: string
  totalMedals: number
}

interface SportDistributionChartProps {
  sports: SportData[]
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#FF7C7C",
  "#8DD1E1",
  "#D084D0",
  "#FFEB3B",
  "#E91E63",
  "#9C27B0",
  "#673AB7",
  "#3F51B5",
]

export function SportDistributionChart({ sports }: SportDistributionChartProps) {
  const chartData = sports.slice(0, 10).map((sport, index) => ({
    name: sport.sport,
    value: sport.totalMedals,
    color: COLORS[index % COLORS.length],
  }))

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
