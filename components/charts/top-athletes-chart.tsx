"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface AthleteData {
  athlete: string
  country: string
  totalMedals: number
  goldMedals: number
  silverMedals: number
  bronzeMedals: number
}

interface TopAthletesChartProps {
  athletes: AthleteData[]
}

const MEDAL_COLORS = ["#FFD700", "#C0C0C0", "#CD7F32"]

export function TopAthletesChart({ athletes }: TopAthletesChartProps) {
  const chartData = athletes.map((athlete) => ({
    name: athlete.athlete.length > 15 ? athlete.athlete.substring(0, 15) + "..." : athlete.athlete,
    fullName: athlete.athlete,
    country: athlete.country,
    gold: athlete.goldMedals,
    silver: athlete.silverMedals,
    bronze: athlete.bronzeMedals,
    total: athlete.totalMedals,
  }))

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={11} />
          <YAxis />
          <Tooltip
            formatter={(value, name) => {
              const medalType = name === "gold" ? "Gold" : name === "silver" ? "Silver" : "Bronze"
              return [value, `${medalType} Medals`]
            }}
            labelFormatter={(label, payload) => {
              if (payload && payload[0]) {
                return `${payload[0].payload.fullName} (${payload[0].payload.country})`
              }
              return label
            }}
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "1px solid #ccc",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Bar dataKey="gold" stackId="medals" fill="#FFD700" stroke="#fff" strokeWidth={1} />
          <Bar dataKey="silver" stackId="medals" fill="#C0C0C0" stroke="#fff" strokeWidth={1} />
          <Bar dataKey="bronze" stackId="medals" fill="#CD7F32" stroke="#fff" strokeWidth={1} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
