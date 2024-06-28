import { z } from 'zod';

const parseNumber = z.string().transform((val) => parseFloat(val));
const parseDate = z.string().transform((data: string) => {
  const [year, month, day] = data.split('-').map(Number);
  return new Date(year, month - 1, day, 12);
});

export const SearchDataSchema = z.object({
  symbol: z.string(),
  instrument_name: z.string(),
  exchange: z.string(),
  mic_code: z.string(),
  exchange_timezone: z.string(),
  instrument_type: z.string(),
  country: z.string(),
  currency: z.string(),
});

export const SearchResponseSchema = z.object({
  data: z.array(SearchDataSchema),
  status: z.string(),
});

export type SearchData = z.infer<typeof SearchDataSchema>;
export type SearchResponse = z.infer<typeof SearchResponseSchema>;

const FiftyTwoWeekSchema = z.object({
  low: parseNumber,
  high: parseNumber,
  low_change: parseNumber,
  high_change: parseNumber,
  low_change_percent: parseNumber,
  high_change_percent: parseNumber,
  range: z.string(),
});

export const QuoteResponseSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  exchange: z.string(),
  mic_code: z.string(),
  currency: z.string(),
  datetime: parseDate,
  timestamp: z.number(),
  open: parseNumber,
  high: parseNumber,
  low: parseNumber,
  close: parseNumber,
  volume: parseNumber,
  previous_close: parseNumber,
  change: parseNumber,
  percent_change: parseNumber,
  average_volume: parseNumber,
  rolling_1d_change: parseNumber.optional(),
  rolling_7d_change: parseNumber.optional(),
  rolling_period_change: parseNumber.optional(),
  is_market_open: z.boolean(),
  fifty_two_week: FiftyTwoWeekSchema,
  extended_change: parseNumber.optional(),
  extended_percent_change: parseNumber.optional(),
  extended_price: parseNumber.optional(),
  extended_timestamp: z.number().optional(),
});


export const PriceResponseSchema = z.object({
  price: parseNumber,
});

export type QuoteResponse = z.infer<typeof QuoteResponseSchema>;
export type PriceResponse = z.infer<typeof PriceResponseSchema>;

const SeriesMetaSchema = z.object({
  symbol: z.string(),
  interval: z.string(),
  currency: z.string(),
  exchange_timezone: z.string(),
  exchange: z.string(),
  mic_code: z.string(),
  type: z.string(),
});

const SeriesValueSchema = z.object({
  datetime: parseDate,
  open: parseNumber,
  high: parseNumber,
  low: parseNumber,
  close: parseNumber,
  volume: parseNumber,
});

export const SeriesResponseSchema = z.object({
  meta: SeriesMetaSchema,
  values: z.array(SeriesValueSchema),
});

export type SeriesResponse = z.infer<typeof SeriesResponseSchema>;
export type SeriesValue = z.infer<typeof SeriesValueSchema>;

export const StockDataSchema = z.tuple([SeriesResponseSchema, QuoteResponseSchema, PriceResponseSchema]);
export type StockData = z.infer<typeof StockDataSchema>;
