const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || '';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  location: {
    name: string;
    country: string;
  };
  current: {
    temperature: number;
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    pressure: string;
    feelsLike: number;
  };
}

export interface Coordinates {
  lat: number;
  lon: number;
}

class WeatherService {
  private apiKey: string;

  constructor() {
    this.apiKey = API_KEY;
    if (!this.apiKey) {
      throw new Error('OpenWeatherMap API key is not configured. Please set NEXT_PUBLIC_OPENWEATHER_API_KEY in your environment variables.');
    }
  }

  // Get coordinates for a city name
  async getCoordinates(cityName: string): Promise<Coordinates> {
    try {
      const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${this.apiKey}`;
      console.log(`Fetching coordinates from: ${url}`);
      
      const response = await fetch(url);
      console.log(`Geocoding response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Geocoding API error: ${response.status} - ${errorText}`);
        throw new Error(`Failed to fetch coordinates: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`Geocoding data:`, data);
      
      if (data.length === 0) {
        throw new Error('City not found');
      }

      return {
        lat: data[0].lat,
        lon: data[0].lon
      };
    } catch (error) {
      console.error(`Error in getCoordinates:`, error);
      throw error;
    }
  }

  // Get weather data by coordinates
  async getWeatherByCoordinates(lat: number, lon: number): Promise<WeatherData> {
    try {
      const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial`;
      console.log(`Fetching weather from: ${url}`);
      
      const response = await fetch(url);
      console.log(`Weather API response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Weather API error: ${response.status} - ${errorText}`);
        throw new Error(`Failed to fetch weather data: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`Weather API data:`, data);

      return {
        location: {
          name: data.name,
          country: data.sys.country
        },
        current: {
          temperature: Math.round(data.main.temp),
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed),
          pressure: (data.main.pressure * 0.02953).toFixed(2), // Convert hPa to inHg
          feelsLike: Math.round(data.main.feels_like)
        }
      };
    } catch (error) {
      console.error(`Error in getWeatherByCoordinates:`, error);
      throw error;
    }
  }

  // Get weather data by city name
  async getWeatherByCity(cityName: string): Promise<WeatherData> {
    try {
      console.log(`Fetching weather for: ${cityName}`);
      const coordinates = await this.getCoordinates(cityName);
      console.log(`Coordinates found:`, coordinates);
      const weatherData = await this.getWeatherByCoordinates(coordinates.lat, coordinates.lon);
      console.log(`Weather data received:`, weatherData);
      return weatherData;
    } catch (error) {
      console.error(`Error in getWeatherByCity:`, error);
      throw new Error(`Failed to get weather for ${cityName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get weather icon URL
  getWeatherIconUrl(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }

  // Get weather emoji based on icon code
  getWeatherEmoji(iconCode: string): string {
    const iconMap: { [key: string]: string } = {
      '01d': '☀️', // clear sky day
      '01n': '🌙', // clear sky night
      '02d': '⛅', // few clouds day
      '02n': '☁️', // few clouds night
      '03d': '☁️', // scattered clouds
      '03n': '☁️',
      '04d': '☁️', // broken clouds
      '04n': '☁️',
      '09d': '🌧️', // shower rain
      '09n': '🌧️',
      '10d': '🌦️', // rain day
      '10n': '🌧️', // rain night
      '11d': '⛈️', // thunderstorm
      '11n': '⛈️',
      '13d': '❄️', // snow
      '13n': '❄️',
      '50d': '🌫️', // mist
      '50n': '🌫️'
    };

    return iconMap[iconCode] || '🌤️';
  }
}

export const weatherService = new WeatherService();
