'use client'

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, TooltipProps, ReferenceLine } from 'recharts';
import { SeriesResponse, SeriesValue } from '../rapid/schema';

import styles from './index.module.css'
import { formatCurrency, formatDate } from '../helpers/formatters';
import { Dispatch, SetStateAction } from 'react';


// interface TooltipProps extends TooltipProps<number, string> {}
type CustomTooltipProps = { setShowPrice: Dispatch<SetStateAction<number | undefined>>, coordinate?: { x: number, y: number }, viewBox?: { x: number, y: number, width: number, height: number }, active?: boolean, payload?: { value: number, payload: SeriesValue }[] };

// Custom tooltip component
const CustomTooltip = ({ active, payload, coordinate, viewBox, setShowPrice }: CustomTooltipProps) => {
  // console.log(coordinate, viewBox)
  if (active && payload && payload.length) {
    const date = new Date(payload[0].payload.datetime);
    const close = payload[0].value;
    setShowPrice(close);

    const reverse = coordinate?.x! > viewBox?.width! / 2;
    // const pos = 
    //   !reverse ? { left: (coordinate?.x || 0) + 10 } : { left: (coordinate?.x || 0) - 10, transform: "translateX(-100%)" };
    const datePos = {
      max: viewBox?.width! - 50,
      min: 50,
    }

    return (
      <div style={{ position: 'relative' }}>
        {/* <div
          style={{
            ...pos,
            position: 'absolute',
            top: viewBox?.y || 0,
            // left: (coordinate?.x || 0) + 10,
            backgroundColor: 'black',
            border: '1px solid #ccc',
            padding: '5px',
          }}
        >
          <p className="label">{formatCurrency(close)}</p>
        </div> */}
        <div
          style={{
            position: 'absolute',
            top: (viewBox?.height || 0) + 15,
            left: Math.min(Math.max(coordinate?.x!, datePos.min), datePos.max),
            transform: 'translateX(-50%)',
            width: 'max-content',
          }}
        >
          <p className="label">{formatDate(date)}</p>
        </div>
      </div>
    );
  }

  return null;
};

const getDate = (d: SeriesValue) => d.datetime;
const getStockValue = (d: SeriesValue) => d.close;

export const SeriesChart = ({ series, setShowPrice }: { series: SeriesResponse, setShowPrice: Dispatch<SetStateAction<number | undefined>> }) => {
  const stock = series.values.sort((a, b) => getDate(a).valueOf() - getDate(b).valueOf());
  const isPositive = getStockValue(stock[stock.length - 1]) > getStockValue(stock[0]);

  // console.log(series);

  const minClose = Math.min(...stock.map((d) => d.close));
  const maxClose = Math.max(...stock.map((d) => d.close));
  const averageClose = stock.reduce((sum, data) => sum + data.close, 0) / stock.length;
  const diffClose = maxClose - minClose;

  const digits = Math.floor(Math.log10(diffClose)) + 1;
  const domainMin = Math.floor(minClose * Math.pow(10, digits - 1)) / Math.pow(10, digits - 1);
  const domainMax = Math.ceil(maxClose * Math.pow(10, digits - 1)) / Math.pow(10, digits - 1);

  return (
    <ResponsiveContainer width="100%" height="100%" className={styles.graph}>
      <AreaChart
        data={stock}
        margin={{
          top: 10,
          right: 0,
          left: 0,
          bottom: 0,
        }}
        onMouseLeave={() => setShowPrice(undefined)}
      >
        <defs>
          <linearGradient id="positiveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'rgba(200, 174, 304)', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'rgb(110, 84, 214)', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="negativeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'rgba(255, 160, 159)', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'rgba(243, 70, 69)', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <XAxis dataKey="datetime" axisLine={false} tickLine={false} tick={false} />
        <YAxis axisLine={false} tickLine={false} domain={[domainMin, domainMax]} tick={false} width={0} />
        <Tooltip content={<CustomTooltip setShowPrice={setShowPrice} />} cursor={false} />
        <ReferenceLine y={averageClose} stroke="lightgray" strokeDasharray="5 5" opacity={0.6} />
        <Area type="monotone" dataKey="close" strokeWidth={1.5} stroke={isPositive ? 'url(#positiveGradient)' : 'url(#negativeGradient)'} fill="transparent" />
      </AreaChart>
    </ResponsiveContainer>
  );
}