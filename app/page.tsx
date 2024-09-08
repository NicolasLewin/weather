"use client";
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";

function getCurrentDate() {
  const currentDate = new Date();
  const options = { month: "long" };
  const monthName = currentDate.toLocaleString("fr-FR", options);
  const date = new Date().getDate() + ", " + monthName;
  return date;
}

export default function Home() {
  const date = getCurrentDate();
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("paris");

  async function fetchData(cityName: string) {
    try {
      const response = await fetch("http://localhost:3000/api/weather?address=" + cityName);
      const jsonData = (await response.json()).data;
      setWeatherData(jsonData);
    } catch (e) {
      console.error("Error while fetching:", e);
    }
  }

  async function fetchDataByCoordinates(latitude: number, longitude: number) {
    try {
      const response = await fetch(`http://localhost:3000/api/weather?lat=${latitude}&lon=${longitude}`);
      const jsonData = (await response.json()).data;
      setWeatherData(jsonData);
    } catch (e) {
      console.error("Error while fetching:", e);
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
        }
      );
    }
  }, []);

  return (
    <main className="flex flex-col justify-between items-center p-24">
      <article className="bg-gradient-to-r from-cyan-500 to-blue-500 w-11/12 rounded-lg">
        <h1>MINI WEATHER APP</h1>
        <form
            className="flex justify-center"
            onSubmit={(e) => {
              e.preventDefault();
              fetchData(city);
            }}
          >
            <input className="rounded-lg border" placeholder="Enter city name" type="text" id="cityName" name="cityName"
              onChange={(e) => setCity(e.target.value)}
            />
            <button type="submit" className="flex py-2.5 px-3 ms-2 text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
              <svg className="w-4 h-7 me-2" aria-hidden="true" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
              Search
            </button>
        </form>
      </article>
    </main>
  );
};