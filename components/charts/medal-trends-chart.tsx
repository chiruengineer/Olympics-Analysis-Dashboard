"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface TrendData {
  year: number
  totalMedals: number
  uniqueCountries: number
  uniqueAthletes: number
  uniqueSports: number
}

interface MedalTrendsChartProps {
  data: TrendData[]
  metric: string
}

export function MedalTrendsChart({ data, metric }: MedalTrendsChartProps) {
  const getMetricLabel = (metric: string) => {
    switch (metric) {
      case "totalMedals":
        return "Total Medals"
      case "uniqueCountries":
        return "Number of Countries"
      case "uniqueAthletes":
        return "Number of Athletes"
      case "uniqueSports":
        return "Number of Sports"
      default:
        return "Value"
    }
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip
            formatter={(value) => [value, getMetricLabel(metric)]}
            labelFormatter={(label) => `Year: ${label}`}
          />
          <Line
            type="monotone"
            dataKey={metric}
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 6, strokeWidth: 2, fill: "#2563eb" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
