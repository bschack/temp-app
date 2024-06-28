import { z } from 'zod';

const metaDataSchema = z.object({
  "1. Information": z.string(),
  "2. Symbol": z.string(),
  "3. Last Refreshed": z.string(),
  "4. Output Size": z.string(),
  "5. Time Zone": z.string()
});

const timeSeriesEntrySchema = z.object({
  "1. open": z.string(),
  "2. high": z.string(),
  "3. low": z.string(),
  "4. close": z.string(),
  "5. volume": z.string()
});

const timeSeriesSchema = z.record(z.string(), timeSeriesEntrySchema);

export const DailySchema = z.object({
  "Meta Data": metaDataSchema,
  "Time Series (Daily)": timeSeriesSchema
});

export type DailyResponse = z.infer<typeof DailySchema>;

export const transformData = (data: DailyResponse) => {

  const transformedMetaData = {
    information: data["Meta Data"]["1. Information"],
    symbol: data["Meta Data"]["2. Symbol"],
    lastRefreshed: data["Meta Data"]["3. Last Refreshed"],
    outputSize: data["Meta Data"]["4. Output Size"],
    timeZone: data["Meta Data"]["5. Time Zone"]
  };

  const transformedTimeSeries = Object.fromEntries(
    Object.entries(data["Time Series (Daily)"]).map(([key, value]) => [
      key,
      {
        o: parseFloat(value["1. open"]),
        h: parseFloat(value["2. high"]),
        l: parseFloat(value["3. low"]),
        c: parseFloat(value["4. close"]),
        v: parseInt(value["5. volume"], 10),
        date: new Date(key).valueOf()
      }
    ])
  );

  return {
    metaData: transformedMetaData,
    timeSeries: transformedTimeSeries
  };
};

export const TransformedTimeSeriesSchema = z.record(z.string().date(), z.object({
  o: z.number(),
  h: z.number(),
  l: z.number(),
  c: z.number(),
  v: z.number()
}));

export type TransformedTimeSeries = z.infer<typeof TransformedTimeSeriesSchema>;

export const SinglePerformanceSchema = z.object({
  o: z.number(),
  h: z.number(),
  l: z.number(),
  c: z.number(),
  v: z.number(),
  date: z.number()
});

export type SinglePerformance = z.infer<typeof SinglePerformanceSchema>;
