"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface GenderOverviewData {
  maleTotal: number
  femaleTotal: number
  malePercentage: number
  femalePercentage: number
}

interface GenderOverviewChartProps {
  data: GenderOverviewData
}

export function GenderOverviewChart({ data }: GenderOverviewChartProps) {
  const chartData = [
    { name: "Male", value: data.maleTotal, percentage: data.malePercentage },
    { name: "Female", value: data.femaleTotal, percentage: data.femalePercentage },
  ]

  const COLORS = ["#2563eb", "#ec4899"]

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [value.toLocaleString(), name]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
