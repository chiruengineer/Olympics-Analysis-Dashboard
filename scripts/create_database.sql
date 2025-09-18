-- Create Olympics Database Schema
-- This script creates tables for storing Olympic medal data

-- Create database (if using PostgreSQL/MySQL)
-- CREATE DATABASE olympics_analysis;
-- USE olympics_analysis;

-- Create main Olympics table
CREATE TABLE IF NOT EXISTS olympic_medals (
    id SERIAL PRIMARY KEY,
    city VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    sport VARCHAR(100) NOT NULL,
    discipline VARCHAR(100) NOT NULL,
    event VARCHAR(200) NOT NULL,
    athlete VARCHAR(200) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    country_code VARCHAR(10),
    country VARCHAR(100) NOT NULL,
    event_gender VARCHAR(10),
    medal VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_country ON olympic_medals(country);
CREATE INDEX IF NOT EXISTS idx_year ON olympic_medals(year);
CREATE INDEX IF NOT EXISTS idx_sport ON olympic_medals(sport);
CREATE INDEX IF NOT EXISTS idx_athlete ON olympic_medals(athlete);
CREATE INDEX IF NOT EXISTS idx_medal ON olympic_medals(medal);

-- Create summary tables for analytics

-- Country performance summary
CREATE TABLE IF NOT EXISTS country_performance (
    id SERIAL PRIMARY KEY,
    country VARCHAR(100) NOT NULL,
    total_medals INTEGER DEFAULT 0,
    gold_medals INTEGER DEFAULT 0,
    silver_medals INTEGER DEFAULT 0,
    bronze_medals INTEGER DEFAULT 0,
    first_medal_year INTEGER,
    last_medal_year INTEGER,
    unique_athletes INTEGER DEFAULT 0,
    unique_sports INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Athlete performance summary
CREATE TABLE IF NOT EXISTS athlete_performance (
    id SERIAL PRIMARY KEY,
    athlete VARCHAR(200) NOT NULL,
    country VARCHAR(100) NOT NULL,
    total_medals INTEGER DEFAULT 0,
    gold_medals INTEGER DEFAULT 0,
    silver_medals INTEGER DEFAULT 0,
    bronze_medals INTEGER DEFAULT 0,
    sports_participated TEXT,
    years_participated TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sport statistics
CREATE TABLE IF NOT EXISTS sport_statistics (
    id SERIAL PRIMARY KEY,
    sport VARCHAR(100) NOT NULL,
    total_medals INTEGER DEFAULT 0,
    unique_events INTEGER DEFAULT 0,
    unique_athletes INTEGER DEFAULT 0,
    unique_countries INTEGER DEFAULT 0,
    male_medals INTEGER DEFAULT 0,
    female_medals INTEGER DEFAULT 0,
    first_year INTEGER,
    last_year INTEGER,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Year statistics
CREATE TABLE IF NOT EXISTS year_statistics (
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL,
    city VARCHAR(100) NOT NULL,
    total_medals INTEGER DEFAULT 0,
    unique_athletes INTEGER DEFAULT 0,
    unique_countries INTEGER DEFAULT 0,
    unique_sports INTEGER DEFAULT 0,
    male_medals INTEGER DEFAULT 0,
    female_medals INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create views for common queries

-- Top countries by medal count
CREATE OR REPLACE VIEW top_countries AS
SELECT 
    country,
    COUNT(*) as total_medals,
    SUM(CASE WHEN medal = 'Gold' THEN 1 ELSE 0 END) as gold_medals,
    SUM(CASE WHEN medal = 'Silver' THEN 1 ELSE 0 END) as silver_medals,
    SUM(CASE WHEN medal = 'Bronze' THEN 1 ELSE 0 END) as bronze_medals
FROM olympic_medals
GROUP BY country
ORDER BY total_medals DESC;

-- Top athletes by medal count
CREATE OR REPLACE VIEW top_athletes AS
SELECT 
    athlete,
    country,
    COUNT(*) as total_medals,
    SUM(CASE WHEN medal = 'Gold' THEN 1 ELSE 0 END) as gold_medals,
    SUM(CASE WHEN medal = 'Silver' THEN 1 ELSE 0 END) as silver_medals,
    SUM(CASE WHEN medal = 'Bronze' THEN 1 ELSE 0 END) as bronze_medals,
    STRING_AGG(DISTINCT sport, ', ') as sports
FROM olympic_medals
GROUP BY athlete, country
ORDER BY total_medals DESC;

-- Medal trends by year
CREATE OR REPLACE VIEW medal_trends AS
SELECT 
    year,
    city,
    COUNT(*) as total_medals,
    SUM(CASE WHEN medal = 'Gold' THEN 1 ELSE 0 END) as gold_medals,
    SUM(CASE WHEN medal = 'Silver' THEN 1 ELSE 0 END) as silver_medals,
    SUM(CASE WHEN medal = 'Bronze' THEN 1 ELSE 0 END) as bronze_medals,
    COUNT(DISTINCT athlete) as unique_athletes,
    COUNT(DISTINCT country) as unique_countries,
    COUNT(DISTINCT sport) as unique_sports
FROM olympic_medals
GROUP BY year, city
ORDER BY year;

-- Gender participation by sport
CREATE OR REPLACE VIEW gender_participation AS
SELECT 
    sport,
    COUNT(*) as total_medals,
    SUM(CASE WHEN gender = 'Men' THEN 1 ELSE 0 END) as male_medals,
    SUM(CASE WHEN gender = 'Women' THEN 1 ELSE 0 END) as female_medals,
    ROUND(
        (SUM(CASE WHEN gender = 'Men' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)), 2
    ) as male_percentage,
    ROUND(
        (SUM(CASE WHEN gender = 'Women' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)), 2
    ) as female_percentage
FROM olympic_medals
GROUP BY sport
ORDER BY total_medals DESC;

-- Sport dominance by country
CREATE OR REPLACE VIEW sport_dominance AS
SELECT 
    sport,
    country,
    COUNT(*) as medals_in_sport,
    RANK() OVER (PARTITION BY sport ORDER BY COUNT(*) DESC) as country_rank
FROM olympic_medals
GROUP BY sport, country
ORDER BY sport, medals_in_sport DESC;

COMMENT ON TABLE olympic_medals IS 'Main table containing all Olympic medal records from 1976-2008';
COMMENT ON TABLE country_performance IS 'Aggregated performance statistics by country';
COMMENT ON TABLE athlete_performance IS 'Aggregated performance statistics by athlete';
COMMENT ON TABLE sport_statistics IS 'Statistical summary for each sport';
COMMENT ON TABLE year_statistics IS 'Statistical summary for each Olympic year';
