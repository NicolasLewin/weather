"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { ThemeToggle } from "./theme-provider";

function getCurrentDate() {
  const currentDate = new Date();
  const options = { month: "long" as const };
  const monthName = currentDate.toLocaleString("fr-FR", options);
  const date = new Date().getDate() + ", " + monthName;
  return date;
}

export default function Home() {
  const date = getCurrentDate();
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("paris");
  const [isLoading, setIsLoading] = useState(true);

  async function fetchData(cityName: string) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/weather?address=" + cityName);
      const jsonData = (await response.json()).data;
      setWeatherData(jsonData);
    } catch (e) {
      console.error("Error while fetching:", e);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchDataByCoordinates(latitude: number, longitude: number) {
    try {
      const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
      const jsonData = (await response.json()).data;
      setWeatherData(jsonData);
    } catch (e) {
      console.error("Error while fetching:", e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchDataByCoordinates(latitude, longitude);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          fetchData(city);
        }
      );
    }
  }, [city]);

  return (
    <div>
      <ThemeToggle />
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 dark:from-slate-800 dark:to-slate-950 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <article className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-950 p-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white text-center mb-6">
                Weather Dashboard
              </h1>
              <form
                className="flex gap-2 max-w-md mx-auto"
                onSubmit={(e) => {
                  e.preventDefault();
                  fetchData(city);
                }}
              >
                <input
                  className="flex-1 px-4 py-2 rounded-lg border-2 border-blue-400 dark:border-blue-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-300 outline-none transition-all bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-100"
                  placeholder="Enter city name"
                  type="text"
                  id="cityName"
                  name="cityName"
                  onChange={(e) => setCity(e.target.value)}
                />
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-400 focus:outline-none"
                >
                  <Search size={20} />
                  <span className="hidden md:inline">Search</span>
                </button>
              </form>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-48">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 dark:border-blue-400 border-t-transparent"></div>
                </div>
              ) : weatherData && weatherData.weather && weatherData.weather[0] ? (
                <div className="text-center">
                  <div className="mb-6">
                    <div className="text-6xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                      {(weatherData?.main?.temp - 273.5).toFixed(1)}°
                    </div>
                    <div className="text-xl text-gray-600 dark:text-gray-300 font-medium">
                      {weatherData?.weather[0]?.description?.toUpperCase()}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                      {weatherData?.name}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">{date}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-8 text-center">
                    <div className="bg-blue-50 dark:bg-slate-700 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Humidity</div>
                      <div className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                        {weatherData?.main?.humidity}%
                      </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-slate-700 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Wind Speed</div>
                      <div className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                        {weatherData?.wind?.speed} m/s
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 h-48 flex items-center justify-center">
                  No weather data available
                </div>
              )}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}