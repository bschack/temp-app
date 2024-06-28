'use client'

import { useEffect, useState } from "react";

import { queryPrice } from "@/lib/rapid/price";
import { queryQuote } from "@/lib/rapid/quote";
import { PriceResponse, QuoteResponse, SeriesResponse, StockData } from "@/lib/rapid/schema";

import styles from './index.module.css';
import { formatCurrency, formatPercent } from "@/lib/helpers/formatters";
import { SeriesChart } from "@/lib/graphs/Rechart";
import clsx from "clsx";
import { TrendUp } from "@/lib/icons/trend-up/TrendUp";
import { TrendDown } from "@/lib/icons/trend-down/TrendDown";

export const StockCard = ({ data, active = true, style }: { data: StockData, active?: boolean, style?: React.CSSProperties; }) => {
  const [showPrice, setShowPrice] = useState<number>();
  const [changeMode, setChangeMode] = useState<'percent' | 'price'>('percent');

  // useEffect(() => {
  //   setChangeMode("percent");
  // }, [data]);

  if (!data) return <p>Loading...</p>;

  const toggleMode = () => { 
    setChangeMode(changeMode === 'percent' ? 'price' : 'percent');
  };

  const { series, quote, price } = { series: data[0], quote: data[1], price: data[2] };
  if (!quote || !price) return <p>Loading...</p>;
  const isPositive = (quote?.change || 0) > 0;

  return (
    <div className={styles.card} style={style}>
      {data && (
        <>
          <div className={styles.header}>
            <span className={styles.symbol}>{quote?.symbol}</span>
            <span className={styles.exchange}>{quote?.exchange}</span>
            <span className={styles.name}>{quote?.name}</span>
          </div>
          <div className={styles.body}>
            <span className={styles.price}>{formatCurrency(showPrice || price?.price)}</span>
            <span className={clsx(styles.change, isPositive ? styles.change__positive : styles.change__negative)} onMouseOver={toggleMode} onMouseLeave={toggleMode}>
              {isPositive ? <TrendUp /> : <TrendDown />}
              {changeMode === 'percent' ? formatPercent(quote.percent_change / 100) : `${quote.change}`}
            </span>
          </div>
          <div className={styles.graph}>
            <SeriesChart series={series} setShowPrice={setShowPrice} />
          </div>
        </>
      )}
    </div>
  );
}