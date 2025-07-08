"use client";

import styles from "./tracking.module.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { weatherService, WeatherData } from "@/lib/weather-service";

const Tracking = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadDefaultWeather();
    }, []);

    const loadDefaultWeather = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await weatherService.getWeatherByCity("New York");
            setWeatherData(data);
        } catch (err) {
            console.error("Error loading default weather:", err);
            setError("Failed to load default weather data");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            setError("Please enter a city name");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await weatherService.getWeatherByCity(searchTerm);
            setWeatherData(data);
            setSearchTerm("");
        } catch (err) {
            console.error("Error fetching weather:", err);
            setError(err instanceof Error ? err.message : "Failed to fetch weather data");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };
    return (
 <>
  <div className={styles.cloudsContainer}>
        <div className={`${styles.cloud} ${styles.cloud1}`}></div>
        <div className={`${styles.cloud} ${styles.cloud2}`}></div>
        <div className={`${styles.cloud} ${styles.cloud3}`}></div>
        <div className={`${styles.cloud} ${styles.cloud4}`}></div>
      </div>
 <title>WWU | Tracking</title>
    <div className={styles.TitleContainer}>
        <h1 className={styles.Title}>Weather Dashboard</h1>
    </div>
    <div className={styles.SubtitleContainer}>
        <h4 className={styles.Subtitle}>Track Fast, Track Now</h4>
    </div>
    <div className={styles.SearchContainer}>
        <Input 
            type="text" 
            placeholder="Enter location or city name..." 
            className={styles.typebox}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
        />
        <Button 
            className={styles.button}
            onClick={handleSearch}
            disabled={loading || !searchTerm.trim()}
        >
            {loading ? "Searching..." : "Search"}
        </Button>
    </div>
    
    {error && (
        <div className={styles.ErrorMessage}>
            {error}
        </div>
    )}

    <div className={styles.CardContainer}>
        <div className={styles.Card}>
            {loading ? (
                <div className={styles.LoadingMessage}>Loading weather data...</div>
            ) : weatherData ? (
                <>
                    <div className={styles.LocationName}>
                        {weatherData.location.name}, {weatherData.location.country}
                    </div>
                    <h2 className={styles.CardTitle}>Current Weather</h2>
                    <div className={styles.WeatherIcon}>
                        {weatherService.getWeatherEmoji(weatherData.current.icon)}
                    </div>
                    <div className={styles.Temperature}>{weatherData.current.temperature}°F</div>
                    <div className={styles.WeatherDescription}>
                        {weatherData.current.description.charAt(0).toUpperCase() + weatherData.current.description.slice(1)}
                    </div>
                    <div className={styles.WeatherDetails}>
                        <div className={styles.WeatherDetail}>
                            <div className={styles.WeatherDetailLabel}>Humidity</div>
                            <div className={styles.WeatherDetailValue}>{weatherData.current.humidity}%</div>
                        </div>
                        <div className={styles.WeatherDetail}>
                            <div className={styles.WeatherDetailLabel}>Wind</div>
                            <div className={styles.WeatherDetailValue}>{weatherData.current.windSpeed} mph</div>
                        </div>
                        <div className={styles.WeatherDetail}>
                            <div className={styles.WeatherDetailLabel}>Pressure</div>
                            <div className={styles.WeatherDetailValue}>{weatherData.current.pressure}&quot;</div>
                        </div>
                        <div className={styles.WeatherDetail}>
                            <div className={styles.WeatherDetailLabel}>Feels Like</div>
                            <div className={styles.WeatherDetailValue}>{weatherData.current.feelsLike}°F</div>
                        </div>
                    </div>
                </>
            ) : (
                <div className={styles.LoadingMessage}>No weather data available</div>
            )}
        </div>
    </div>

</>       
    );
}

export default Tracking;