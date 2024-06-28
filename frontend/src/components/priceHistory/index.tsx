'use client'

import { AreaChart } from "@/lib/graphs/AreaChart";
import { SeriesChart } from "@/lib/graphs/Rechart";
import { SeriesResponse } from "@/lib/rapid/schema";
import { querySeries } from "@/lib/rapid/series";
import { useEffect, useState } from "react";

export const PriceHistory = ({ symbol, active }: { symbol: string, active: boolean }) => {
  const [data, setData] = useState<SeriesResponse>();
  const [timeMode, setTimeMode] = useState<'intraday' | 'day' | 'week' | 'month'>('day');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchHistoryResults = async () => {
      if (!active) return;
      try {
        setLoading(true);
        const res = await querySeries(symbol, timeMode);
        setLoading(false);
        setData(res);
      } catch (error: any) {
        console.log(error.message);
      }
    }

    fetchHistoryResults();

    // const intervalId = setInterval(() => {
    //   fetchHistoryResults();
    // }, interval * 60 * 1000); 

    // return () => clearInterval(intervalId);
  }, [active, symbol, timeMode]);

  return (
    <>
      {loading && <div>Loading...</div>}
      {/* {data && <AreaChart series={data} width={250} height={100} />} */}
      {data && <SeriesChart series={data} />}
    </>
  )
}