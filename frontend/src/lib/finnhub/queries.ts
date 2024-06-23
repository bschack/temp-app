import axios from "axios";
import { config } from "./config";
import { SearchResponseSchema } from "./schema";

const urlConstructor = (query: "company" | "search" | "quote" | "market_status", symbol?: string) => {
  const token = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
  return `${config.finnhub.baseUrl}${config.finnhub.endpoints[query]}${symbol ? symbol : ""}&token=${token}`;
};

export const querySearch = async (term?: string) => {
  const url = urlConstructor('search', term);
  const res = await axios.get(url);
  if (res.status === 200) {
    const validated = await SearchResponseSchema.parseAsync(res.data);
    return validated;
  } else {
    throw new Error('Failed to fetch data');
  }
}