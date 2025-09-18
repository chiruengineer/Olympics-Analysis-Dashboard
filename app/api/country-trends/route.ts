import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const country = url.searchParams.get("country")

  if (!country) return NextResponse.json({ error: "country param required" }, { status: 400 })

  try {
    const csvPath = path.join(process.cwd(), "public/data/Summer-Olympic-medals-1976-to-2008.csv")
    const csvData = fs.readFileSync(csvPath, "utf-8")

    const lines = csvData.split("\n")
    const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim())

    const yearCount: Record<number, number> = {}

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]
      if (!line.trim()) continue
      const values = parseCSVLine(line)
      if (values.length < headers.length) continue

      const rec: any = {}
      headers.forEach((h, idx) => (rec[normalizeHeader(h)] = values[idx]?.replace(/"/g, "")))

      if (rec.country !== country) continue
      const yr = Number.parseInt(rec.year)
      if (!yr) continue
      yearCount[yr] = (yearCount[yr] || 0) + 1
    }

    const data = Object.entries(yearCount)
      .map(([year, medals]) => ({ year: Number(year), medals }))
      .sort((a, b) => a.year - b.year)

    return NextResponse.json(data)
  } catch (e) {
    console.error("country-trends error", e)
    return NextResponse.json({ error: "internal error" }, { status: 500 })
  }
}

function parseCSVLine(line: string): string[] {
  const res: string[] = []
  let cur = ""
  let inQ = false
  for (const ch of line) {
    if (ch === '"') inQ = !inQ
    else if (ch === "," && !inQ) {
      res.push(cur.trim())
      cur = ""
    } else cur += ch
  }
  res.push(cur.trim())
  return res
}

function normalizeHeader(h: string) {
  return (
    {
      City: "city",
      Year: "year",
      Sport: "sport",
      Discipline: "discipline",
      Event: "event",
      Athlete: "athlete",
      Gender: "gender",
      Country_Code: "country_code",
      Country: "country",
      Event_gender: "event_gender",
      Medal: "medal",
    }[h] || h.toLowerCase()
  )
}
