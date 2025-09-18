"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

interface TrendPoint {
  year: number
  medals: number
}

export function CountryTrendsChart({ country }: { country: string }) {
  const [data, setData] = useState<TrendPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/country-trends?country=${encodeURIComponent(country)}`)
        const json = await res.json()
        setData(json)
      } catch (err) {
        console.error("Failed to load country trends", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [country])

  if (loading) return <Skeleton className="w-full h-64 rounded-lg bg-gray-100" />

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="medals"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2, fill: "#2563eb" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
