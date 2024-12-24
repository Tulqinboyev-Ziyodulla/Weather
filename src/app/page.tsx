'use client';

import { useState, useEffect } from 'react';

interface Weather {
  text: string;
  icon: string;
}

interface CurrentWeather {
  temp_c: number;
  condition: Weather;
  last_updated: string;
}

interface ForecastDay {
  date: string;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    condition: Weather;
  };
}

interface Forecast {
  forecastday: ForecastDay[];
}

interface WeatherData {
  current: CurrentWeather;
  forecast: Forecast;
}

export default function Weather() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          'https://api.weatherapi.com/v1/forecast.json?key=c3a6dc4386cc49e7ba0155411242212&q=tashkent&days=12&aqi=yes&alerts=yes'
        );
        const data: WeatherData = await response.json();
        setWeatherData(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch weather data:', error);
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const DayName = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
  };

  const DateTime = () => {
    const now = new Date();
    return now.toLocaleString('uz-UZ', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl">Loading...</div>;
  }

  if (!weatherData) {
    return <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl">Failed to load weather data.</div>;
  }

  const { current, forecast } = weatherData;

  return (
    <div className='bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen p-6'>
      <div className='max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 text-center'>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Tashkent Weather</h2>
        <p className="text-gray-600 mb-4">{DateTime()}</p>
        <div className='flex justify-center items-center'>
          <div>
            <p className="text-3xl font-semibold text-gray-800">{current.temp_c}°C</p>
            <p className="text-gray-500 text-sm mt-2">Last updated: {current.last_updated}</p>
          </div>
        </div>
      </div>

      <div className='max-w-4xl mx-auto mt-6 bg-white rounded-lg shadow-lg p-6'>
        <h2 className="text-3xl font-bold text-gray-800 mb-4 flex justify-center">12-Day Weather</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
          {forecast.forecastday.map((day) => (
            <div
              key={day.date}
              className='bg-gray-100 p-4 rounded-lg shadow-lg text-center'
            >
              <p className="text-xl font-semibold text-gray-800">{DayName(day.date)}</p>
              <p className="text-sm text-gray-600">{day.date}</p>
              <img className="w-16 h-16 mt-5 m-auto" src={day.day.condition.icon} alt={day.day.condition.text} />
              <p className="text-sm text-gray-600">{day.day.condition.text}</p>
              <p className="text-sm font-medium text-gray-800">
                Max: {day.day.maxtemp_c}°C
              </p>
              <p className="text-sm font-medium text-gray-800">
                Min: {day.day.mintemp_c}°C
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
