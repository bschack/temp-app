'use client';

import { fetchSecureData } from "@/api/fetchData";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { useEffect, useState } from "react";

export const HomePageData = ({jwtToken}: {jwtToken: RequestCookie}) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);


  useEffect(() => {
    const handleDataFetch = async () => {
      setLoading(true);
      setError(false);

      const fetchResult = await fetchSecureData(jwtToken.value);

      setLoading(false);

      if (fetchResult.success) {
        setMessage(fetchResult.message);
        setData(fetchResult.data);
      } else {
        setError(true);
      }
    }
    
    handleDataFetch();
  }, [jwtToken]);

  return (
    <>
      {loading && <p>Loading...</p>}
      {error ? <p>Error fetching data</p> :
      <>
        <p>{data}</p>
      </>}
    </>
  )
}