'use client'

import React, { useEffect, useRef } from "react";
import { useState } from "react";

import { useModal } from "@/components";
import { CompanySearch } from "@/components/companySearch";
import { useSessionContext } from "@/context/SessionContext";
import { StockCard } from "@/components/stockCard/StockCard";
import { queryAllStockData } from "@/lib/rapid/allStock";

import styles from './index.module.css';
import { StockData } from "@/lib/rapid/schema";

const AddStock = ({ addSymbol }: { addSymbol: (symbol: string) => void }) => {
  const { Modal, openModal } = useModal({ header: 'Search', children: <CompanySearch onSelect={addSymbol} /> });

  return (
    <div>
      <button onClick={openModal}>+</button>
      {Modal}
    </div>
  )
}

const Carousel = ({ stockData }: { stockData: Array<StockData> }) => {
  // const [animation, setAnimation] = useState<'left' | 'right'>();
  const [currentIndex, setCurrentIndex] = useState<number>(0); 
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [hovering, setHovering] = useState<boolean>(false);
  const [padded, setPadded] = useState<JSX.Element[]>([]);
  
  useEffect(() => {
    console.log(stockData);
    setPadded(stockData.map((s) => (
      <StockCard key={Math.random()} data={s} />
    )));
  }, [stockData]);

  useEffect(() => {
    const scrollLeft = () => {
      if (isScrolling) return;
  
      // console.log(padded)
      const newCard = <StockCard key={Math.random()} data={stockData[currentIndex]} />;
      const newP = [...padded, newCard];
      // console.log(newP)
      setPadded(newP);
      setIsScrolling(true);
      setCurrentIndex((currentIndex + 1) % stockData.length);
      // console.log(currentIndex);
      
      setTimeout(() => {
        setIsScrolling(false);
        setPadded(newP.slice(1));
      }, 3 * 1000);
    };

    if (padded.length < 3) return;

    const intervalId = setInterval(() => {
      if (!hovering) scrollLeft();
    }, 5 * 1000); 

    return () => clearInterval(intervalId);
  }, [currentIndex, hovering, isScrolling, padded, stockData]);

  // const scrollLeft = () => {
  //   if (isScrolling) return;

  //   const newCard = <StockCard key={Math.random()} data={stockData[currentIndex]} />;
  //   const newP = [...padded, newCard];

  //   setPadded(newP);
  //   setIsScrolling(true);
  //   setCurrentIndex((currentIndex + 1) % stockData.length);
    
  //   setTimeout(() => {
  //     setIsScrolling(false);
  //     setPadded(newP.slice(1));
  //   }, 3 * 1000);
  // };

  return (
    <div className={styles.carousel_container} onMouseOver={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
      {/* <div onClick={() => {
        setPadded(stockData.map((s, i) => (
          <StockCard key={i} data={s} />
        )));
      }}>Help</div> */}
      {/* <div className={styles.carousel_left} onClick={scrollLeft}>Left</div> */}
      <div className={styles.carousel_wrapper}>
        <div className={styles.carousel} style={{
          transform: `translateX(calc(-${isScrolling ? 100 / padded.length : 0}% ))`,
          transition: isScrolling ? 'transform 3s ease-in-out' : 'none',
        }}>
          {padded}
        </div>
      </div>
      {/* <div className={styles.carousel_right} onClick={scrollRight}>Right</div> */}
    </div>
  );
};

export default function Secure() {
  const { session } = useSessionContext();
  const [userSymbols, setUserSymbols] = useState<Array<string>>(['AAPL', 'GS', 'PLTR']); // ['AAPL', 'TSLA', 'MSFT']
  const [loadedSymbols, setLoadedSymbols] = useState<Array<string>>([]);
  const [stockData, setStockData] = useState<Array<StockData>>([]);
  const [focusedSymbol, setFocusedSymbol] = useState<string>('AAPL');

  const handleAddSymbol = (symbol: string) => {
    setUserSymbols([...userSymbols, symbol].sort());
  }

  useEffect(() => {
    const fetchQuoteResults = async () => {
      try {
        const newSymbols = userSymbols.filter(s => !loadedSymbols.includes(s));

        for (const s of newSymbols) {
          console.log(s)
          const res = await queryAllStockData(s, true);
          console.log(res);
          if (res) setLoadedSymbols([...loadedSymbols, s]);
          setStockData([...stockData, res]);
        }
      } catch (error) {
        console.error(error);
      }
    }
    
    fetchQuoteResults();

    const intervalId = setInterval(() => {
      fetchQuoteResults();
    }, 30 * 1000); 

    return () => clearInterval(intervalId);
  }, [loadedSymbols, stockData, userSymbols]);

  const focusedData = stockData.find(s => s[1].symbol === focusedSymbol);

  if (session) {
    return (
      <>
        <aside className={styles.side_bar}>
          {/* {currentSymbol}
          <select id="symbolSelect" value={currentSymbol} onChange={handleSymbolChange}>
            <option value="">Select...</option>
            {userSymbols.map(symbol => (
              <option key={symbol} value={symbol}>{symbol}</option>
            ))}
          </select> */}
          <AddStock addSymbol={handleAddSymbol} />
        </aside>
        <main className={styles.dashboard}>
          <section>
            <Carousel stockData={stockData} />
            {focusedData && focusedData[1].symbol}
          </section>
        </main>
      </>
    )
  }

  return <h1>No User Permission</h1>
}
