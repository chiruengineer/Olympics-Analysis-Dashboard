"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { MultiSelect } from "@/components/ui/multi-select" /* a tiny helper below */
import { Skeleton } from "@/components/ui/skeleton"
import { Listbox } from "@headlessui/react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

type TrendPoint = { year: number; medals: number }
type CountryTrends = { country: string; data: TrendPoint[] }

interface Props {
  countries: { country: string }[]
}

export function CountryComparison({ countries }: Props) {
  const [selected, setSelected] = useState<string[]>(countries.slice(0, 3).map((c) => c.country))
  const [series, setSeries] = useState<CountryTrends[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const promises = selected.map(async (c) => {
        const res = await fetch(`/api/country-trends?country=${encodeURIComponent(c)}`)
        return { country: c, data: await res.json() }
      })
      setSeries(await Promise.all(promises))
      setLoading(false)
    }
    load()
  }, [selected])

  if (loading) return <Skeleton className="w-full h-96 rounded-lg bg-gray-100" />

  // Build a unified x-axis (years) from first series
  const years = series[0]?.data.map((d) => d.year) || []
  const chartData = years.map((y) => {
    const obj: any = { year: y }
    series.forEach((s) => {
      const point = s.data.find((p) => p.year === y)
      obj[s.country] = point ? point.medals : 0
    })
    return obj
  })

  const COLORS = ["#2563eb", "#f59e0b", "#dc2626", "#10b981", "#7c3aed", "#ea580c"]

  return (
    <>
      <MultiSelect
        options={countries.map((c) => c.country)}
        selected={selected}
        setSelected={(s) => setSelected(s.slice(0, 5))}
        className="mb-4"
      />
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            {series.map((s, idx) => (
              <Line
                key={s.country}
                dataKey={s.country}
                stroke={COLORS[idx % COLORS.length]}
                strokeWidth={2}
                dot={false}
                type="monotone"
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}

/* ---------- tiny helper for quick multi-select ---------- */

interface MSProps {
  options: string[]
  selected: string[]
  setSelected: (v: string[]) => void
  className?: string
}

function CountryMultiSelect({ options, selected, setSelected, className }: MSProps) {
  return (
    <Listbox value={selected} onChange={setSelected} multiple>
      <div className={cn("relative", className)}>
        <Listbox.Button className="w-full rounded-md border px-3 py-2 text-sm flex justify-between items-center">
          <span>{selected.length ? selected.join(", ") : "Select countries…"}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Listbox.Button>
        <Listbox.Options className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md bg-white border shadow">
          {options.map((opt) => (
            <Listbox.Option
              key={opt}
              value={opt}
              className={({ active }) => cn("cursor-pointer select-none px-3 py-2 text-sm", active && "bg-blue-50")}
            >
              {({ selected: isSel }) => (
                <span className="flex items-center gap-2">
                  {isSel && <Check className="h-4 w-4 text-blue-600" />}
                  {opt}
                </span>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  )
}
