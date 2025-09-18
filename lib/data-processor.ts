// Data processing utilities for Olympics analysis
export interface OlympicRecord {
  city: string
  year: number
  sport: string
  discipline: string
  event: string
  athlete: string
  gender: string
  country_code?: string
  country: string
  event_gender?: string
  medal: string
}

export interface CountryStats {
  country: string
  totalMedals: number
  goldMedals: number
  silverMedals: number
  bronzeMedals: number
}

export interface AthleteStats {
  athlete: string
  country: string
  totalMedals: number
  sports: string[]
  years: number[]
}

export interface SportStats {
  sport: string
  totalMedals: number
  maleParticipation: number
  femaleParticipation: number
}

export class OlympicsDataProcessor {
  private data: OlympicRecord[] = []

  constructor(csvData: string) {
    this.parseCSV(csvData)
  }

  private parseCSV(csvData: string): void {
    const lines = csvData.split("\n")
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i])
      if (values.length === headers.length) {
        const record: any = {}
        headers.forEach((header, index) => {
          record[this.normalizeHeader(header)] = values[index]
        })

        // Convert year to number
        record.year = Number.parseInt(record.year)

        this.data.push(record as OlympicRecord)
      }
    }
  }

  private parseCSVLine(line: string): string[] {
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

  private normalizeHeader(header: string): string {
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

  // Analysis methods
  getTopCountries(limit = 10): CountryStats[] {
    const countryMap = new Map<string, CountryStats>()

    this.data.forEach((record) => {
      if (!countryMap.has(record.country)) {
        countryMap.set(record.country, {
          country: record.country,
          totalMedals: 0,
          goldMedals: 0,
          silverMedals: 0,
          bronzeMedals: 0,
        })
      }

      const stats = countryMap.get(record.country)!
      stats.totalMedals++

      switch (record.medal) {
        case "Gold":
          stats.goldMedals++
          break
        case "Silver":
          stats.silverMedals++
          break
        case "Bronze":
          stats.bronzeMedals++
          break
      }
    })

    return Array.from(countryMap.values())
      .sort((a, b) => b.totalMedals - a.totalMedals)
      .slice(0, limit)
  }

  getTopAthletes(limit = 10): AthleteStats[] {
    const athleteMap = new Map<string, AthleteStats>()

    this.data.forEach((record) => {
      const key = `${record.athlete}-${record.country}`

      if (!athleteMap.has(key)) {
        athleteMap.set(key, {
          athlete: record.athlete,
          country: record.country,
          totalMedals: 0,
          sports: [],
          years: [],
        })
      }

      const stats = athleteMap.get(key)!
      stats.totalMedals++

      if (!stats.sports.includes(record.sport)) {
        stats.sports.push(record.sport)
      }

      if (!stats.years.includes(record.year)) {
        stats.years.push(record.year)
      }
    })

    return Array.from(athleteMap.values())
      .sort((a, b) => b.totalMedals - a.totalMedals)
      .slice(0, limit)
  }

  getSportStats(): SportStats[] {
    const sportMap = new Map<string, SportStats>()

    this.data.forEach((record) => {
      if (!sportMap.has(record.sport)) {
        sportMap.set(record.sport, {
          sport: record.sport,
          totalMedals: 0,
          maleParticipation: 0,
          femaleParticipation: 0,
        })
      }

      const stats = sportMap.get(record.sport)!
      stats.totalMedals++

      if (record.gender === "Men") {
        stats.maleParticipation++
      } else if (record.gender === "Women") {
        stats.femaleParticipation++
      }
    })

    return Array.from(sportMap.values()).sort((a, b) => b.totalMedals - a.totalMedals)
  }

  getMedalsByYear(): { year: number; medals: number }[] {
    const yearMap = new Map<number, number>()

    this.data.forEach((record) => {
      yearMap.set(record.year, (yearMap.get(record.year) || 0) + 1)
    })

    return Array.from(yearMap.entries())
      .map(([year, medals]) => ({ year, medals }))
      .sort((a, b) => a.year - b.year)
  }

  getGenderDistribution(): { male: number; female: number } {
    let male = 0
    let female = 0

    this.data.forEach((record) => {
      if (record.gender === "Men") {
        male++
      } else if (record.gender === "Women") {
        female++
      }
    })

    return { male, female }
  }

  // Machine Learning helper methods
  prepareMLData(): {
    features: number[][]
    labels: number[]
    encoders: {
      country: Map<string, number>
      sport: Map<string, number>
      gender: Map<string, number>
    }
  } {
    const countryEncoder = new Map<string, number>()
    const sportEncoder = new Map<string, number>()
    const genderEncoder = new Map<string, number>()

    // Create encoders
    let countryIndex = 0
    let sportIndex = 0
    let genderIndex = 0

    this.data.forEach((record) => {
      if (!countryEncoder.has(record.country)) {
        countryEncoder.set(record.country, countryIndex++)
      }
      if (!sportEncoder.has(record.sport)) {
        sportEncoder.set(record.sport, sportIndex++)
      }
      if (!genderEncoder.has(record.gender)) {
        genderEncoder.set(record.gender, genderIndex++)
      }
    })

    // Prepare features and labels
    const features: number[][] = []
    const labels: number[] = []

    this.data.forEach((record) => {
      features.push([
        countryEncoder.get(record.country)!,
        sportEncoder.get(record.sport)!,
        genderEncoder.get(record.gender)!,
        record.year,
      ])

      // Label encoding: Gold=3, Silver=2, Bronze=1
      const medalValue = record.medal === "Gold" ? 3 : record.medal === "Silver" ? 2 : 1
      labels.push(medalValue)
    })

    return {
      features,
      labels,
      encoders: {
        country: countryEncoder,
        sport: sportEncoder,
        gender: genderEncoder,
      },
    }
  }

  // Prediction method (simplified logistic regression simulation)
  predictMedalProbability(country: string, sport: string, gender: string, year = 2008): number {
    // Get historical performance for the country in the sport
    const countryRecords = this.data.filter((r) => r.country === country)
    const sportRecords = this.data.filter((r) => r.sport === sport)
    const genderRecords = this.data.filter((r) => r.gender === gender)

    // Calculate base probability based on historical data
    const countrySuccessRate = countryRecords.length / this.data.length
    const sportPopularity = sportRecords.length / this.data.length
    const genderParticipation = genderRecords.length / this.data.length

    // Combine factors (simplified model)
    const baseProbability = (countrySuccessRate + sportPopularity + genderParticipation) / 3

    // Add some randomness and constraints
    const finalProbability = Math.min(0.95, Math.max(0.05, baseProbability + (Math.random() - 0.5) * 0.2))

    return finalProbability
  }

  // Get summary statistics
  getSummaryStats() {
    const totalMedals = this.data.length
    const uniqueAthletes = new Set(this.data.map((r) => r.athlete)).size
    const uniqueCountries = new Set(this.data.map((r) => r.country)).size
    const uniqueSports = new Set(this.data.map((r) => r.sport)).size
    const yearRange = {
      start: Math.min(...this.data.map((r) => r.year)),
      end: Math.max(...this.data.map((r) => r.year)),
    }

    return {
      totalMedals,
      uniqueAthletes,
      uniqueCountries,
      uniqueSports,
      yearRange,
    }
  }
}
