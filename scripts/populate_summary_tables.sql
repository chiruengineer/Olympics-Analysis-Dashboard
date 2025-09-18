-- Populate summary tables with aggregated data
-- Run this after loading the main olympic_medals table

-- Populate country_performance table
INSERT INTO country_performance (
    country, total_medals, gold_medals, silver_medals, bronze_medals,
    first_medal_year, last_medal_year, unique_athletes, unique_sports
)
SELECT 
    country,
    COUNT(*) as total_medals,
    SUM(CASE WHEN medal = 'Gold' THEN 1 ELSE 0 END) as gold_medals,
    SUM(CASE WHEN medal = 'Silver' THEN 1 ELSE 0 END) as silver_medals,
    SUM(CASE WHEN medal = 'Bronze' THEN 1 ELSE 0 END) as bronze_medals,
    MIN(year) as first_medal_year,
    MAX(year) as last_medal_year,
    COUNT(DISTINCT athlete) as unique_athletes,
    COUNT(DISTINCT sport) as unique_sports
FROM olympic_medals
GROUP BY country
ON CONFLICT (country) DO UPDATE SET
    total_medals = EXCLUDED.total_medals,
    gold_medals = EXCLUDED.gold_medals,
    silver_medals = EXCLUDED.silver_medals,
    bronze_medals = EXCLUDED.bronze_medals,
    first_medal_year = EXCLUDED.first_medal_year,
    last_medal_year = EXCLUDED.last_medal_year,
    unique_athletes = EXCLUDED.unique_athletes,
    unique_sports = EXCLUDED.unique_sports,
    updated_at = CURRENT_TIMESTAMP;

-- Populate athlete_performance table
INSERT INTO athlete_performance (
    athlete, country, total_medals, gold_medals, silver_medals, bronze_medals,
    sports_participated, years_participated
)
SELECT 
    athlete,
    country,
    COUNT(*) as total_medals,
    SUM(CASE WHEN medal = 'Gold' THEN 1 ELSE 0 END) as gold_medals,
    SUM(CASE WHEN medal = 'Silver' THEN 1 ELSE 0 END) as silver_medals,
    SUM(CASE WHEN medal = 'Bronze' THEN 1 ELSE 0 END) as bronze_medals,
    STRING_AGG(DISTINCT sport, ', ') as sports_participated,
    STRING_AGG(DISTINCT year::text, ', ') as years_participated
FROM olympic_medals
GROUP BY athlete, country
ON CONFLICT (athlete, country) DO UPDATE SET
    total_medals = EXCLUDED.total_medals,
    gold_medals = EXCLUDED.gold_medals,
    silver_medals = EXCLUDED.silver_medals,
    bronze_medals = EXCLUDED.bronze_medals,
    sports_participated = EXCLUDED.sports_participated,
    years_participated = EXCLUDED.years_participated,
    updated_at = CURRENT_TIMESTAMP;

-- Populate sport_statistics table
INSERT INTO sport_statistics (
    sport, total_medals, unique_events, unique_athletes, unique_countries,
    male_medals, female_medals, first_year, last_year
)
SELECT 
    sport,
    COUNT(*) as total_medals,
    COUNT(DISTINCT event) as unique_events,
    COUNT(DISTINCT athlete) as unique_athletes,
    COUNT(DISTINCT country) as unique_countries,
    SUM(CASE WHEN gender = 'Men' THEN 1 ELSE 0 END) as male_medals,
    SUM(CASE WHEN gender = 'Women' THEN 1 ELSE 0 END) as female_medals,
    MIN(year) as first_year,
    MAX(year) as last_year
FROM olympic_medals
GROUP BY sport
ON CONFLICT (sport) DO UPDATE SET
    total_medals = EXCLUDED.total_medals,
    unique_events = EXCLUDED.unique_events,
    unique_athletes = EXCLUDED.unique_athletes,
    unique_countries = EXCLUDED.unique_countries,
    male_medals = EXCLUDED.male_medals,
    female_medals = EXCLUDED.female_medals,
    first_year = EXCLUDED.first_year,
    last_year = EXCLUDED.last_year,
    updated_at = CURRENT_TIMESTAMP;

-- Populate year_statistics table
INSERT INTO year_statistics (
    year, city, total_medals, unique_athletes, unique_countries, unique_sports,
    male_medals, female_medals
)
SELECT 
    year,
    city,
    COUNT(*) as total_medals,
    COUNT(DISTINCT athlete) as unique_athletes,
    COUNT(DISTINCT country) as unique_countries,
    COUNT(DISTINCT sport) as unique_sports,
    SUM(CASE WHEN gender = 'Men' THEN 1 ELSE 0 END) as male_medals,
    SUM(CASE WHEN gender = 'Women' THEN 1 ELSE 0 END) as female_medals
FROM olympic_medals
GROUP BY year, city
ON CONFLICT (year) DO UPDATE SET
    city = EXCLUDED.city,
    total_medals = EXCLUDED.total_medals,
    unique_athletes = EXCLUDED.unique_athletes,
    unique_countries = EXCLUDED.unique_countries,
    unique_sports = EXCLUDED.unique_sports,
    male_medals = EXCLUDED.male_medals,
    female_medals = EXCLUDED.female_medals,
    updated_at = CURRENT_TIMESTAMP;
