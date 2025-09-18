"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface SportGenderData {
  sport: string
  maleCount: number
  femaleCount: number
  malePercentage: number
  femalePercentage: number
}

interface GenderBySportChartProps {
  data: SportGenderData[]
}

export function GenderBySportChart({ data }: GenderBySportChartProps) {
  const chartData = data.slice(0, 15).map((sport) => ({
    sport: sport.sport.length > 12 ? sport.sport.substring(0, 12) + "..." : sport.sport,
    fullSport: sport.sport,
    male: sport.maleCount,
    female: sport.femaleCount,
  }))

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="sport" angle={-45} textAnchor="end" height={100} fontSize={11} />
          <YAxis />
          <Tooltip
            labelFormatter={(label, payload) => {
              if (payload && payload[0]) {
                return payload[0].payload.fullSport
              }
              return label
            }}
          />
          <Legend />
          <Bar dataKey="male" fill="#2563eb" name="Male" />
          <Bar dataKey="female" fill="#ec4899" name="Female" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
