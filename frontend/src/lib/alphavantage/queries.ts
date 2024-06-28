import axios from "axios";
import { DailySchema, transformData } from "./schema";

const config = {
  baseURL: 'https://www.alphavantage.co/query?',
  apiKey: process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY,
  symbol: (symbol: string) => `symbol=${symbol}`,
  interval: (interval: 1 | 5 | 15 | 30 | 60) => `interval=${interval}min`,
  queries: {
    intraday: 'function=TIME_SERIES_INTRADAY',
    daily: 'function=TIME_SERIES_DAILY',
    weekly: 'function=TIME_SERIES_WEEKLY',
    monthly: 'function=TIME_SERIES_MONTHLY',
    toppers: 'function=TOP_GAINERS_AND_LOSERS',
  }
}

const urlConstructor = (query: 'intraday' | 'daily' | 'weekly' | 'monthly' | 'toppers', symbol: string, interval?: 1 | 5 | 15 | 30 | 60) => {
  return `${config.baseURL}${config.queries[query]}&${config.symbol(symbol)}&${interval ? config.interval(interval) : ''}&apikey=${config.apiKey}`
}

export const queryDaily = async (symbol: string) => {
  const url = urlConstructor('daily', symbol);
  const res = await axios.get(url);
  if (res.status === 200) {
    console.log(res);
    const validated = await DailySchema.parseAsync(res.data);
    return transformData(validated);
  } else {
    throw new Error('Failed to fetch data');
  }
}