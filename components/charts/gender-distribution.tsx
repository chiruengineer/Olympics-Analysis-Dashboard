"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface GenderData {
  year: number
  male: number
  female: number
}

export function GenderDistribution() {
  const [data, setData] = useState<GenderData[]>([])

  useEffect(() => {
    // Simulated data - in real app, this would come from CSV processing
    const genderData = [
      { year: 1976, male: 2089, female: 1124 },
      { year: 1980, male: 2076, female: 1111 },
      { year: 1984, male: 2234, female: 1192 },
      { year: 1988, male: 2387, female: 1270 },
      { year: 1992, male: 2445, female: 1299 },
      { year: 1996, male: 2556, female: 1356 },
      { year: 2000, male: 2661, female: 1408 },
      { year: 2004, male: 2771, female: 1467 },
      { year: 2008, male: 3122, female: 1648 },
    ]
    setData(genderData)
  }, [])

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="male" fill="#2563eb" name="Male" />
          <Bar dataKey="female" fill="#ec4899" name="Female" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
