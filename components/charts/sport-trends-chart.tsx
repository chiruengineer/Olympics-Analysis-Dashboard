"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useState, useEffect } from "react"

interface SportData {
  sport: string
  totalMedals: number
}

interface SportTrendsChartProps {
  sports: SportData[]
}

export function SportTrendsChart({ sports }: SportTrendsChartProps) {
  const [trendData, setTrendData] = useState<any[]>([])

  useEffect(() => {
    // Simulate trend data - in real app, this would come from API
    const years = [1976, 1980, 1984, 1988, 1992, 1996, 2000, 2004, 2008]
    const topSports = sports.slice(0, 5)

    const data = years.map((year) => {
      const yearData: any = { year }
      topSports.forEach((sport) => {
        // Simulate growth trend
        const baseValue = sport.totalMedals / 9 // Average per year
        const variation = Math.random() * 0.4 - 0.2 // ±20% variation
        yearData[sport.sport] = Math.round(baseValue * (1 + variation))
      })
      return yearData
    })

    setTrendData(data)
  }, [sports])

  const COLORS = ["#2563eb", "#f59e0b", "#dc2626", "#10b981", "#7c3aed"]

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          {sports.slice(0, 5).map((sport, index) => (
            <Line
              key={sport.sport}
              type="monotone"
              dataKey={sport.sport}
              stroke={COLORS[index]}
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
