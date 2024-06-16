'use client';

import GetWeatherEndpoints from "@/helpers/GetWeatherEndpoints";
import styles from "./page.module.css";
import GetWeather from "@/helpers/GetWeatherPrediction";
import { useEffect, useState } from "react";
import { WeatherEndpointResponse } from "@/types/index.types";
import getMessage from "@/api/getMessage";

export default function Home() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    async function fetchMessage() {
      try {
        const msg = await getMessage();
        setMessage(msg);
        setError(null);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    }

    fetchMessage();
  }, []);

  if (loading) {
    return <main className={styles.main}>Loading...</main>;
  }

  if (error) {
    console.error("Error getting message:", error);
    return <main className={styles.main}>Error</main>;
  }

  return (
    <main className={styles.main}>
      {message ? <p>{message}</p> : <p>No message found</p>}
    </main>
  );
}
