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

    // Process overall gender data
    let maleTotal = 0
    let femaleTotal = 0

    // Process by sport
    const sportMap = new Map()

    // Process by year
    const yearMap = new Map()

    // Process by country
    const countryMap = new Map()

    records.forEach((record: any) => {
      const gender = record.gender
      const sport = record.sport
      const year = Number.parseInt(record.year)
      const country = record.country

      // Overall counts
      if (gender === "Men") maleTotal++
      else if (gender === "Women") femaleTotal++

      // By sport
      if (sport) {
        if (!sportMap.has(sport)) {
          sportMap.set(sport, { sport, maleCount: 0, femaleCount: 0 })
        }
        const sportData = sportMap.get(sport)
        if (gender === "Men") sportData.maleCount++
        else if (gender === "Women") sportData.femaleCount++
      }

      // By year
      if (year) {
        if (!yearMap.has(year)) {
          yearMap.set(year, { year, maleCount: 0, femaleCount: 0 })
        }
        const yearData = yearMap.get(year)
        if (gender === "Men") yearData.maleCount++
        else if (gender === "Women") yearData.femaleCount++
      }

      // By country
      if (country) {
        if (!countryMap.has(country)) {
          countryMap.set(country, { country, maleCount: 0, femaleCount: 0, totalMedals: 0 })
        }
        const countryData = countryMap.get(country)
        countryData.totalMedals++
        if (gender === "Men") countryData.maleCount++
        else if (gender === "Women") countryData.femaleCount++
      }
    })

    const totalMedals = maleTotal + femaleTotal

    // Format the data
    const genderData = {
      overall: {
        maleTotal,
        femaleTotal,
        malePercentage: (maleTotal / totalMedals) * 100,
        femalePercentage: (femaleTotal / totalMedals) * 100,
      },
      bySport: Array.from(sportMap.values())
        .map((sport) => ({
          sport: sport.sport,
          maleCount: sport.maleCount,
          femaleCount: sport.femaleCount,
          malePercentage: (sport.maleCount / (sport.maleCount + sport.femaleCount)) * 100,
          femalePercentage: (sport.femaleCount / (sport.maleCount + sport.femaleCount)) * 100,
        }))
        .sort((a, b) => b.maleCount + b.femaleCount - (a.maleCount + a.femaleCount)),
      byYear: Array.from(yearMap.values())
        .map((year) => ({
          year: year.year,
          maleCount: year.maleCount,
          femaleCount: year.femaleCount,
          malePercentage: (year.maleCount / (year.maleCount + year.femaleCount)) * 100,
          femalePercentage: (year.femaleCount / (year.maleCount + year.femaleCount)) * 100,
        }))
        .sort((a, b) => a.year - b.year),
      byCountry: Array.from(countryMap.values()).sort((a, b) => b.totalMedals - a.totalMedals),
    }

    return NextResponse.json(genderData)
  } catch (error) {
    console.error("Error processing gender data:", error)
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
