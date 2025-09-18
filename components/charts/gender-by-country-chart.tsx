"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface CountryGenderData {
  country: string
  maleCount: number
  femaleCount: number
  totalMedals: number
}

interface GenderByCountryChartProps {
  data: CountryGenderData[]
}

export function GenderByCountryChart({ data }: GenderByCountryChartProps) {
  const chartData = data.slice(0, 20).map((country) => ({
    country: country.country.length > 12 ? country.country.substring(0, 12) + "..." : country.country,
    fullCountry: country.country,
    male: country.maleCount,
    female: country.femaleCount,
  }))

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="country" angle={-45} textAnchor="end" height={100} fontSize={11} />
          <YAxis />
          <Tooltip
            labelFormatter={(label, payload) => {
              if (payload && payload[0]) {
                return payload[0].payload.fullCountry
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
