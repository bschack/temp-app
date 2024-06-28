'use client'

import { useEffect, useState } from "react";

import { queryPrice } from "@/lib/rapid/price";
import { queryQuote } from "@/lib/rapid/quote";
import { PriceResponse, QuoteResponse } from "@/lib/rapid/schema";

export const CurrentPrice = ({ symbol, active }: { symbol: string, active: boolean }) => {
  const [quote, setQuote] = useState<QuoteResponse>();
  const [price, setPrice] = useState<PriceResponse>();
  const [changeMode, setChangeMode] = useState<'percent' | 'price'>('percent');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchQuoteResults = async () => {
      if (!active) return;
      try {
        setLoading(true);
        const quoteRes = await queryQuote(symbol);
        const priceRes = await queryPrice(symbol);
        setLoading(false);
        setQuote(quoteRes);
        setPrice(priceRes);
      } catch (error: any) {
        console.log(error.message);
      }
    }

    fetchQuoteResults();

    // const intervalId = setInterval(() => {
    //   fetchQuoteResults();
    // }, 10 * 1000); 

    // return () => clearInterval(intervalId);
  }, [active, symbol]);

  useEffect(() => {
    setQuote(undefined);
    setPrice(undefined);
  }, [symbol]);

  const toggleMode = () => { 
    setChangeMode(changeMode === 'percent' ? 'price' : 'percent');
  };

  const data = quote && price;

  return (
    <div>
      {loading && <div>Loading...</div>}
      {/* {!data && <p>-</p>} */}
      {data && (
        <div>
          <h3>{`$${price.price}`}</h3>
          <p onClick={toggleMode}>{changeMode === 'percent' ? `${quote.percent_change}%` : `${quote.change}`}</p>
        </div>
      )}
    </div>
  );
}