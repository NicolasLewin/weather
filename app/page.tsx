"use client"


import { useEffect, useState } from "react";

function getCurrentDate() {

}

export default function Home() {

  const [city, setCity] = useState("paris");
  const [weatherData, setWeatherData] = useState(null);
  const date = getCurrentDate();

  async function fetchData(cityName: string) {
    try {
        const response = await fetch("http://localhost:3000/api/weather?address=" + cityName)

      const jsonData = (await response.json()).data;
      setWeatherData(jsonData);
      }
    catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData("paris")
  }, []);

  return (
    <div>
      <h1>Weather application</h1>
    </div>
  );
}
