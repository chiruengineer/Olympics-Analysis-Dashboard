import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Read the CSV file
    const csvPath = path.join(process.cwd(), "public/data/Summer-Olympic-medals-1976-to-2008.csv")
    const csvData = fs.readFileSync(csvPath, "utf-8")

    // Parse CSV data
    const lines = csvData.split("\n")
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

    const records = []
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = parseCSVLine(lines[i])
        if (values.length >= headers.length) {
          const record: any = {}
          headers.forEach((header, index) => {
            record[normalizeHeader(header)] = values[index]?.replace(/"/g, "") || ""
          })
          records.push(record)
        }
      }
    }

    // Process athlete data
    const athleteMap = new Map()

    records.forEach((record: any) => {
      const athlete = record.athlete
      const country = record.country
      if (!athlete || !country) return

      const key = `${athlete}-${country}`

      if (!athleteMap.has(key)) {
        athleteMap.set(key, {
          athlete,
          country,
          totalMedals: 0,
          goldMedals: 0,
          silverMedals: 0,
          bronzeMedals: 0,
          sports: new Set(),
          years: new Set(),
          events: new Set(),
        })
      }

      const athleteData = athleteMap.get(key)
      athleteData.totalMedals++

      if (record.medal === "Gold") athleteData.goldMedals++
      else if (record.medal === "Silver") athleteData.silverMedals++
      else if (record.medal === "Bronze") athleteData.bronzeMedals++

      if (record.sport) athleteData.sports.add(record.sport)
      if (record.year) athleteData.years.add(Number.parseInt(record.year))
      if (record.event) athleteData.events.add(record.event)
    })

    // Convert to array and sort
    const athletes = Array.from(athleteMap.values())
      .map((athlete) => ({
        ...athlete,
        sports: Array.from(athlete.sports).sort(),
        years: Array.from(athlete.years).sort(),
        events: Array.from(athlete.events).sort(),
      }))
      .sort((a, b) => b.totalMedals - a.totalMedals)

    return NextResponse.json(athletes)
  } catch (error) {
    console.error("Error processing athletes data:", error)
    return NextResponse.json({ error: "Failed to process data" }, { status: 500 })
  }
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      result.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }
  result.push(current.trim())
  return result
}

function normalizeHeader(header: string): string {
  const mapping: { [key: string]: string } = {
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
  }
  return mapping[header] || header.toLowerCase()
}
