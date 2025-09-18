"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Download, BarChart3 } from "lucide-react"

interface OlympicRecord {
  city: string
  year: number
  sport: string
  discipline: string
  event: string
  athlete: string
  gender: string
  country: string
  medal: string
}

export default function DataExplorerPage() {
  const [data, setData] = useState<OlympicRecord[]>([])
  const [filteredData, setFilteredData] = useState<OlympicRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [selectedCountry, setSelectedCountry] = useState<string>("all")
  const [selectedSport, setSelectedSport] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const recordsPerPage = 100

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterData()
  }, [searchTerm, selectedYear, selectedCountry, selectedSport, data])

  const loadData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/data-explorer")
      const result = await response.json()
      console.log(`Loaded ${result.length} records from CSV`)
      setData(result)
      setFilteredData(result)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterData = () => {
    let filtered = data

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (record) =>
          record.athlete.toLowerCase().includes(term) ||
          record.country.toLowerCase().includes(term) ||
          record.sport.toLowerCase().includes(term) ||
          record.event.toLowerCase().includes(term),
      )
    }

    if (selectedYear !== "all") {
      filtered = filtered.filter((record) => record.year.toString() === selectedYear)
    }

    if (selectedCountry !== "all") {
      filtered = filtered.filter((record) => record.country === selectedCountry)
    }

    if (selectedSport !== "all") {
      filtered = filtered.filter((record) => record.sport === selectedSport)
    }

    setFilteredData(filtered)
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(filteredData.length / recordsPerPage)
  const startIndex = (currentPage - 1) * recordsPerPage
  const endIndex = startIndex + recordsPerPage
  const currentRecords = filteredData.slice(startIndex, endIndex)

  const uniqueYears = [...new Set(data.map((record) => record.year))].sort((a, b) => a - b)
  const uniqueCountries = [...new Set(data.map((record) => record.country))].sort()
  const uniqueSports = [...new Set(data.map((record) => record.sport))].sort()

  const generateSummaryStats = () => {
    const stats = {
      totalRecords: filteredData.length,
      countries: new Set(filteredData.map((r) => r.country)).size,
      sports: new Set(filteredData.map((r) => r.sport)).size,
      athletes: new Set(filteredData.map((r) => r.athlete)).size,
      years: new Set(filteredData.map((r) => r.year)).size,
      goldMedals: filteredData.filter((r) => r.medal === "Gold").length,
      silverMedals: filteredData.filter((r) => r.medal === "Silver").length,
      bronzeMedals: filteredData.filter((r) => r.medal === "Bronze").length,
      maleAthletes: filteredData.filter((r) => r.gender === "Men").length,
      femaleAthletes: filteredData.filter((r) => r.gender === "Women").length,
    }

    // Top countries
    const countryCount = new Map<string, number>()
    filteredData.forEach((r) => {
      countryCount.set(r.country, (countryCount.get(r.country) || 0) + 1)
    })
    const topCountries = Array.from(countryCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)

    // Top sports
    const sportCount = new Map<string, number>()
    filteredData.forEach((r) => {
      sportCount.set(r.sport, (sportCount.get(r.sport) || 0) + 1)
    })
    const topSports = Array.from(sportCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)

    // Medals by year
    const yearCount = new Map<number, number>()
    filteredData.forEach((r) => {
      yearCount.set(r.year, (yearCount.get(r.year) || 0) + 1)
    })
    const medalsByYear = Array.from(yearCount.entries()).sort((a, b) => a[0] - b[0])

    // Country medal breakdown
    const countryMedalBreakdown = new Map<string, { gold: number; silver: number; bronze: number }>()
    filteredData.forEach((r) => {
      if (!countryMedalBreakdown.has(r.country)) {
        countryMedalBreakdown.set(r.country, { gold: 0, silver: 0, bronze: 0 })
      }
      const medals = countryMedalBreakdown.get(r.country)!
      if (r.medal === "Gold") medals.gold++
      else if (r.medal === "Silver") medals.silver++
      else if (r.medal === "Bronze") medals.bronze++
    })

    // Sport gender distribution
    const sportGenderDist = new Map<string, { men: number; women: number }>()
    filteredData.forEach((r) => {
      if (!sportGenderDist.has(r.sport)) {
        sportGenderDist.set(r.sport, { men: 0, women: 0 })
      }
      const dist = sportGenderDist.get(r.sport)!
      if (r.gender === "Men") dist.men++
      else dist.women++
    })

    return { stats, topCountries, topSports, medalsByYear, countryMedalBreakdown, sportGenderDist }
  }

  const handleExportExcel = async () => {
    try {
      setExporting(true)
      console.log("Starting Excel export...")

      // Load XLSX using CDN as fallback
      let XLSX: any
      try {
        XLSX = await import("xlsx")
        console.log("XLSX loaded via import")
      } catch (importError) {
        console.log("Import failed, trying CDN...")

        // Load XLSX from CDN
        await new Promise<void>((resolve, reject) => {
          if ((window as any).XLSX) {
            resolve()
            return
          }

          const script = document.createElement("script")
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"
          script.onload = () => {
            console.log("XLSX loaded from CDN")
            resolve()
          }
          script.onerror = () => reject(new Error("Failed to load XLSX from CDN"))
          document.head.appendChild(script)
        })

        XLSX = (window as any).XLSX
      }

      if (!XLSX || !XLSX.utils || !XLSX.write) {
        throw new Error("XLSX library not available")
      }

      const { stats, topCountries, topSports, medalsByYear, countryMedalBreakdown, sportGenderDist } =
        generateSummaryStats()

      console.log("Generated summary stats")

      // Create workbook
      const workbook = XLSX.utils.book_new()

      // 1. VISUAL DASHBOARD - Pure Charts and Graphs
      const dashboardData = [
        // Header
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "🏆 OLYMPICS VISUAL DASHBOARD 🏆", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", `Generated: ${new Date().toLocaleDateString()}`, "", "", "", "", "", "", "", "", "", "", ""],
        [
          "",
          "",
          "",
          `Records Analyzed: ${stats.totalRecords.toLocaleString()}`,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],

        // Key Metrics Section
        ["", "📊 KEY METRICS OVERVIEW", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        [
          "",
          "Total Records:",
          stats.totalRecords.toLocaleString(),
          "",
          "Countries:",
          stats.countries,
          "",
          "Sports:",
          stats.sports,
          "",
          "Athletes:",
          stats.athletes.toLocaleString(),
          "",
          "Years:",
          stats.years,
        ],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],

        // Medal Distribution Chart
        ["", "🥇 MEDAL DISTRIBUTION CHART", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "Medal Type", "Count", "Percentage", "Visual Chart (Each ■ = 2%)", "", "", "", "", "", "", "", "", "", ""],
        [
          "",
          "────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        [
          "",
          "🥇 Gold",
          stats.goldMedals.toLocaleString(),
          `${((stats.goldMedals / stats.totalRecords) * 100).toFixed(1)}%`,
          "■".repeat(Math.ceil((stats.goldMedals / stats.totalRecords) * 50)),
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        [
          "",
          "🥈 Silver",
          stats.silverMedals.toLocaleString(),
          `${((stats.silverMedals / stats.totalRecords) * 100).toFixed(1)}%`,
          "■".repeat(Math.ceil((stats.silverMedals / stats.totalRecords) * 50)),
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        [
          "",
          "🥉 Bronze",
          stats.bronzeMedals.toLocaleString(),
          `${((stats.bronzeMedals / stats.totalRecords) * 100).toFixed(1)}%`,
          "■".repeat(Math.ceil((stats.bronzeMedals / stats.totalRecords) * 50)),
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],

        // Gender Distribution Chart
        ["", "👥 GENDER PARTICIPATION CHART", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "Gender", "Count", "Percentage", "Visual Chart (Each ● = 2%)", "", "", "", "", "", "", "", "", "", ""],
        [
          "",
          "────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        [
          "",
          "👨 Male",
          stats.maleAthletes.toLocaleString(),
          `${((stats.maleAthletes / stats.totalRecords) * 100).toFixed(1)}%`,
          "●".repeat(Math.ceil((stats.maleAthletes / stats.totalRecords) * 50)),
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        [
          "",
          "👩 Female",
          stats.femaleAthletes.toLocaleString(),
          `${((stats.femaleAthletes / stats.totalRecords) * 100).toFixed(1)}%`,
          "●".repeat(Math.ceil((stats.femaleAthletes / stats.totalRecords) * 50)),
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],

        // Top Countries Performance Chart
        ["", "🌍 TOP COUNTRIES PERFORMANCE CHART", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        [
          "",
          "Rank",
          "Country",
          "Medals",
          "%",
          "Performance Chart (Each █ = 50 medals)",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        [
          "",
          "────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        ...topCountries
          .slice(0, 15)
          .map(([country, count], index) => [
            "",
            `#${index + 1}`,
            country,
            count.toLocaleString(),
            `${((count / stats.totalRecords) * 100).toFixed(1)}%`,
            "█".repeat(Math.ceil(count / 50)) + `  (${count.toLocaleString()})`,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ]),
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],

        // Sports Popularity Chart
        ["", "🏃 SPORTS POPULARITY CHART", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        [
          "",
          "Rank",
          "Sport",
          "Medals",
          "%",
          "Popularity Chart (Each ▓ = 25 medals)",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        [
          "",
          "────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        ...topSports
          .slice(0, 12)
          .map(([sport, count], index) => [
            "",
            `#${index + 1}`,
            sport,
            count.toLocaleString(),
            `${((count / stats.totalRecords) * 100).toFixed(1)}%`,
            "▓".repeat(Math.ceil(count / 25)) + `  (${count.toLocaleString()})`,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ]),
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],

        // Olympic Years Trend Chart
        ["", "📈 OLYMPIC YEARS TREND CHART", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        [
          "",
          "Year",
          "Host City",
          "Medals",
          "Growth",
          "Trend Chart (Each ═ = 100 medals)",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        [
          "",
          "────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        ...medalsByYear.map(([year, count], index) => {
          const prevCount = index > 0 ? medalsByYear[index - 1][1] : count
          const growth = index > 0 ? (((count - prevCount) / prevCount) * 100).toFixed(1) + "%" : "0.0%"
          const hostCity = filteredData.find((r) => r.year === year)?.city || "Unknown"
          return [
            "",
            year.toString(),
            hostCity,
            count.toLocaleString(),
            growth,
            "═".repeat(Math.ceil(count / 100)) + `  (${count.toLocaleString()})`,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ]
        }),
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],

        // Medal Type Distribution by Top Countries
        ["", "🏆 MEDAL BREAKDOWN BY TOP COUNTRIES", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        [
          "",
          "Country",
          "Gold",
          "Silver",
          "Bronze",
          "Total",
          "Medal Distribution (G=Gold, S=Silver, B=Bronze)",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        [
          "",
          "────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        ...topCountries.slice(0, 10).map(([country]) => {
          const medals = countryMedalBreakdown.get(country) || { gold: 0, silver: 0, bronze: 0 }
          const total = medals.gold + medals.silver + medals.bronze
          const goldBar = "G".repeat(Math.ceil((medals.gold / total) * 30))
          const silverBar = "S".repeat(Math.ceil((medals.silver / total) * 30))
          const bronzeBar = "B".repeat(Math.ceil((medals.bronze / total) * 30))
          return [
            "",
            country,
            medals.gold.toString(),
            medals.silver.toString(),
            medals.bronze.toString(),
            total.toString(),
            goldBar + silverBar + bronzeBar + `  (G:${medals.gold} S:${medals.silver} B:${medals.bronze})`,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ]
        }),
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],

        // Sport Gender Distribution Chart
        ["", "⚖️ SPORT GENDER DISTRIBUTION CHART", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        [
          "",
          "Sport",
          "Male",
          "Female",
          "Total",
          "Gender Balance (M=Male, F=Female)",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        [
          "",
          "────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        ...topSports.slice(0, 10).map(([sport]) => {
          const dist = sportGenderDist.get(sport) || { men: 0, women: 0 }
          const total = dist.men + dist.women
          const maleBar = "M".repeat(Math.ceil((dist.men / total) * 40))
          const femaleBar = "F".repeat(Math.ceil((dist.women / total) * 40))
          return [
            "",
            sport,
            dist.men.toString(),
            dist.women.toString(),
            total.toString(),
            maleBar + femaleBar + `  (M:${dist.men} F:${dist.women})`,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ]
        }),
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],

        // Summary Insights
        ["", "💡 KEY INSIGHTS", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        [
          "",
          `🥇 Top Performing Country: ${topCountries[0][0]} with ${topCountries[0][1].toLocaleString()} medals`,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        [
          "",
          `🏃 Most Popular Sport: ${topSports[0][0]} with ${topSports[0][1].toLocaleString()} medals`,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        [
          "",
          `📊 Gender Ratio: ${(stats.maleAthletes / stats.femaleAthletes).toFixed(2)}:1 (Male:Female)`,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        [
          "",
          `📈 Peak Olympic Year: ${medalsByYear.reduce((max, curr) => (curr[1] > max[1] ? curr : max))[0]} with ${medalsByYear.reduce((max, curr) => (curr[1] > max[1] ? curr : max))[1].toLocaleString()} medals`,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        [
          "",
          `🌍 Country Participation: ${stats.countries} different nations`,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        [
          "",
          `🏆 Sport Diversity: ${stats.sports} different sports categories`,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
      ]

      console.log("Creating dashboard sheet...")
      const dashboardSheet = XLSX.utils.aoa_to_sheet(dashboardData)

      // Set column widths for dashboard
      dashboardSheet["!cols"] = [
        { wch: 3 }, // Padding
        { wch: 25 }, // Labels
        { wch: 15 }, // Values
        { wch: 15 }, // Secondary values
        { wch: 12 }, // Percentages
        { wch: 80 }, // Charts
        { wch: 5 }, // Spacing
        { wch: 5 }, // Spacing
        { wch: 5 }, // Spacing
        { wch: 5 }, // Spacing
        { wch: 5 }, // Spacing
        { wch: 5 }, // Spacing
        { wch: 5 }, // Spacing
        { wch: 5 }, // Spacing
        { wch: 5 }, // Spacing
      ]

      // Merge cells for headers
      dashboardSheet["!merges"] = [
        { s: { r: 1, c: 3 }, e: { r: 1, c: 11 } }, // Main title
        { s: { r: 2, c: 3 }, e: { r: 2, c: 11 } }, // Generated date
        { s: { r: 3, c: 3 }, e: { r: 3, c: 11 } }, // Records count
        { s: { r: 5, c: 1 }, e: { r: 5, c: 14 } }, // Key metrics header
        { s: { r: 9, c: 1 }, e: { r: 9, c: 14 } }, // Medal distribution header
        { s: { r: 17, c: 1 }, e: { r: 17, c: 14 } }, // Gender header
        { s: { r: 23, c: 1 }, e: { r: 23, c: 14 } }, // Countries header
        { s: { r: 42, c: 1 }, e: { r: 42, c: 14 } }, // Sports header
        { s: { r: 58, c: 1 }, e: { r: 58, c: 14 } }, // Years header
        { s: { r: 68, c: 1 }, e: { r: 68, c: 14 } }, // Medal breakdown header
        { s: { r: 82, c: 1 }, e: { r: 82, c: 14 } }, // Gender distribution header
        { s: { r: 96, c: 1 }, e: { r: 96, c: 14 } }, // Insights header
      ]

      XLSX.utils.book_append_sheet(workbook, dashboardSheet, "📊 Visual Dashboard")

      // 2. CLEAN DATA EXPORT - Well formatted data table
      const dataExportData = [
        ["OLYMPICS DATA EXPORT"],
        [`Export Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`],
        [`Total Records: ${filteredData.length.toLocaleString()}`],
        [
          `Data Range: ${Math.min(...filteredData.map((r) => r.year))} - ${Math.max(...filteredData.map((r) => r.year))}`,
        ],
        [""],
        ["Applied Filters:"],
        [`Search Term: ${searchTerm || "None"}`],
        [`Selected Year: ${selectedYear === "all" ? "All Years" : selectedYear}`],
        [`Selected Country: ${selectedCountry === "all" ? "All Countries" : selectedCountry}`],
        [`Selected Sport: ${selectedSport === "all" ? "All Sports" : selectedSport}`],
        [""],
        ["OLYMPIC MEDAL RECORDS"],
        [""],
        ["Year", "Host City", "Athlete Name", "Country", "Sport", "Event", "Gender", "Medal Type"],
        ["════", "═════════", "═══════════", "═══════", "═════", "═════", "══════", "══════════"],
        ...filteredData.map((record) => [
          record.year.toString(),
          record.city,
          record.athlete,
          record.country,
          record.sport,
          record.event,
          record.gender,
          record.medal,
        ]),
      ]

      console.log("Creating data export sheet...")
      const dataExportSheet = XLSX.utils.aoa_to_sheet(dataExportData)

      // Set column widths for data export
      dataExportSheet["!cols"] = [
        { wch: 8 }, // Year
        { wch: 18 }, // City
        { wch: 35 }, // Athlete
        { wch: 25 }, // Country
        { wch: 20 }, // Sport
        { wch: 50 }, // Event
        { wch: 12 }, // Gender
        { wch: 12 }, // Medal
      ]

      // Add autofilter to data starting from row 14 (headers)
      if (filteredData.length > 0) {
        dataExportSheet["!autofilter"] = { ref: `A14:H${filteredData.length + 14}` }
      }

      // Merge cells for headers
      dataExportSheet["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }, // Title
        { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } }, // Export date
        { s: { r: 2, c: 0 }, e: { r: 2, c: 7 } }, // Total records
        { s: { r: 3, c: 0 }, e: { r: 3, c: 7 } }, // Data range
        { s: { r: 5, c: 0 }, e: { r: 5, c: 7 } }, // Filters header
        { s: { r: 11, c: 0 }, e: { r: 11, c: 7 } }, // Data header
      ]

      XLSX.utils.book_append_sheet(workbook, dataExportSheet, "📋 Data Export")

      console.log("Writing Excel file...")
      // Write and download with error handling
      const arrayBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      })

      const blob = new Blob([arrayBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
      })

      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `olympics-dashboard-${new Date().toISOString().split("T")[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      console.log("Excel export completed successfully")
    } catch (error) {
      console.error("Excel export failed:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      alert(`Excel export failed: ${errorMessage}. Falling back to CSV export.`)
      handleExportCSV()
    } finally {
      setExporting(false)
    }
  }

  const handleExportCSV = () => {
    try {
      const headers = ["Year", "City", "Athlete", "Country", "Sport", "Event", "Gender", "Medal"]
      const csvContent = [
        headers.join(","),
        ...filteredData.map((record) =>
          [
            record.year,
            `"${record.city.replace(/"/g, '""')}"`,
            `"${record.athlete.replace(/"/g, '""')}"`,
            `"${record.country.replace(/"/g, '""')}"`,
            `"${record.sport.replace(/"/g, '""')}"`,
            `"${record.event.replace(/"/g, '""')}"`,
            record.gender,
            record.medal,
          ].join(","),
        ),
      ].join("\n")

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `olympics-raw-data-${new Date().toISOString().split("T")[0]}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      console.log("CSV export completed successfully")
    } catch (error) {
      console.error("CSV export failed:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      alert(`CSV export failed: ${errorMessage}`)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Data Explorer</h1>
        <p className="text-lg text-gray-600">
          Search and filter through {data.length.toLocaleString()} Olympic medal records from 1976 to 2008
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search athletes, countries, sports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {uniqueYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                <SelectItem value="all">All Countries ({uniqueCountries.length})</SelectItem>
                {uniqueCountries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSport} onValueChange={setSelectedSport}>
              <SelectTrigger>
                <SelectValue placeholder="Select Sport" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                <SelectItem value="all">All Sports ({uniqueSports.length})</SelectItem>
                {uniqueSports.map((sport) => (
                  <SelectItem key={sport} value={sport}>
                    {sport}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {filteredData.length.toLocaleString()} of {data.length.toLocaleString()} records
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-transparent"
                onClick={handleExportExcel}
                disabled={exporting}
              >
                <BarChart3 className="h-4 w-4" />
                {exporting ? "Generating..." : "Export Dashboard & Data"}
              </Button>
              <Button variant="outline" className="flex items-center gap-2 bg-transparent" onClick={handleExportCSV}>
                <Download className="h-4 w-4" />
                Export Raw CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Olympic Records</CardTitle>
          <CardDescription>
            Detailed view of medal winners and their achievements (Page {currentPage} of {totalPages})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 font-semibold">Year</th>
                  <th className="text-left p-3 font-semibold">City</th>
                  <th className="text-left p-3 font-semibold">Athlete</th>
                  <th className="text-left p-3 font-semibold">Country</th>
                  <th className="text-left p-3 font-semibold">Sport</th>
                  <th className="text-left p-3 font-semibold">Event</th>
                  <th className="text-left p-3 font-semibold">Gender</th>
                  <th className="text-left p-3 font-semibold">Medal</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((record, index) => (
                  <tr key={`${record.athlete}-${record.event}-${index}`} className="border-b hover:bg-gray-50">
                    <td className="p-3">{record.year}</td>
                    <td className="p-3">{record.city}</td>
                    <td className="p-3 font-medium">{record.athlete}</td>
                    <td className="p-3">{record.country}</td>
                    <td className="p-3">{record.sport}</td>
                    <td className="p-3 text-sm max-w-xs truncate" title={record.event}>
                      {record.event}
                    </td>
                    <td className="p-3">
                      <Badge variant={record.gender === "Men" ? "default" : "secondary"} className="text-xs">
                        {record.gender}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge
                        className={
                          record.medal === "Gold"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                            : record.medal === "Silver"
                              ? "bg-gray-100 text-gray-800 border-gray-300"
                              : "bg-orange-100 text-orange-800 border-orange-300"
                        }
                      >
                        {record.medal}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredData.length)} of{" "}
              {filteredData.length.toLocaleString()} results
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-3 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
