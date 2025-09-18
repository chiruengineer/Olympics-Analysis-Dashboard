"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface CountryData {
  country: string
  totalMedals: number
  goldMedals: number
  silverMedals: number
  bronzeMedals: number
}

interface CountryMedalChartProps {
  countries: CountryData[]
}

const COLORS = [
  "#FFD700",
  "#C0C0C0",
  "#CD7F32",
  "#4F46E5",
  "#059669",
  "#DC2626",
  "#7C3AED",
  "#EA580C",
  "#0891B2",
  "#BE185D",
]

export function CountryMedalChart({ countries }: CountryMedalChartProps) {
  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={countries} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="country" angle={-45} textAnchor="end" height={100} fontSize={12} />
          <YAxis />
          <Tooltip
            formatter={(value, name) => [value, "Total Medals"]}
            labelFormatter={(label) => `Country: ${label}`}
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "1px solid #ccc",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Bar dataKey="totalMedals" radius={[4, 4, 0, 0]} stroke="#fff" strokeWidth={1}>
            {countries.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
