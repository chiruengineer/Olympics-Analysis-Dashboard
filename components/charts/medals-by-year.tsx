"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface YearData {
  year: number
  medals: number
}

export function MedalsByYear() {
  const [data, setData] = useState<YearData[]>([])

  useEffect(() => {
    // Simulated data - in real app, this would come from the CSV processing
    const yearData = [
      { year: 1976, medals: 3213 },
      { year: 1980, medals: 3187 },
      { year: 1984, medals: 3426 },
      { year: 1988, medals: 3657 },
      { year: 1992, medals: 3744 },
      { year: 1996, medals: 3912 },
      { year: 2000, medals: 4069 },
      { year: 2004, medals: 4238 },
      { year: 2008, medals: 4770 },
    ]
    setData(yearData)
  }, [])

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="medals"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ fill: "#2563eb", strokeWidth: 2, r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
