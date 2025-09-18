"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface TrendData {
  year: number
  uniqueAthletes: number
  maleParticipation: number
  femaleParticipation: number
}

interface ParticipationGrowthChartProps {
  data: TrendData[]
}

export function ParticipationGrowthChart({ data }: ParticipationGrowthChartProps) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="uniqueAthletes"
            stroke="#2563eb"
            strokeWidth={2}
            name="Total Athletes"
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="maleParticipation"
            stroke="#059669"
            strokeWidth={2}
            name="Male Participation"
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="femaleParticipation"
            stroke="#ec4899"
            strokeWidth={2}
            name="Female Participation"
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
