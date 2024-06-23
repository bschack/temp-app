import { array, boolean, number, object, string, z } from "zod";

export const SearchResponseSchema = object({
  count: number(),
  result: array(
    object({
      description: string(),
      displaySymbol: string(),
      symbol: string(),
      type: string(),
    })
  ),
});

export type SearchResponse = z.infer<typeof SearchResponseSchema>;

export const QuoteResponseSchema = object({
  c: number(),
  h: number(),
  l: number(),
  o: number(),
  pc: number(),
  t: number(),
});

export type QuoteResponse = z.infer<typeof QuoteResponseSchema>;

export const CompanyResponseSchema = object({
  country: string(),
  currency: string(),
  exchange: string(),
  ipo: string().date(),
  marketCapitalization: number(),
  name: string(),
  phone: string(),
  shareOutstanding: number(),
  ticker: string(),
  weburl: string().url(),
  logo: string().url(),
  finnhubIndustry: string(),
});

export type CompanyResponse = z.infer<typeof CompanyResponseSchema>;

export const MarketStatusResponseSchema = object({
  exchange: string(),
  holiday: string().nullable(),
  isOpen: boolean(),
  session: string(),
  timezone: string(),
  t: number(),
});

export type MarketStatusResponse = z.infer<typeof MarketStatusResponseSchema>;