'use client';

import { fetchSecureData } from "@/api/fetchData";
import styles from "./page.module.css";
import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);

  const handleDataFetch = async () => {
    setLoading(true);
    setError(false);

    const fetchResult = await fetchSecureData();

    setLoading(false);

    if (fetchResult.success) {
      setMessage(fetchResult.message);
      setData(fetchResult.data);
    } else {
      setError(true);
    }
  }

  useEffect(() => {
    handleDataFetch();
  }, []);


  return (
    <main className={styles.main}>
      {loading && <p>Loading...</p>}
      {error ? <p>Error fetching data</p> :
      <>
        <h1>Home</h1>
        <p>{data}</p>
      </>}
    </main>
  );
}
