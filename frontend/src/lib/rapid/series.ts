import axios from "axios";
import { SeriesResponseSchema } from "./schema";
import { mockSeries } from "./mocks";

const splits = (split: string) => {
  switch (split) {
    case "intraday":
      return {
        interval: "5min",
        outputsize: "60"
      }
    case "day":
      return {
        interval: "1day",
        outputsize: "30"
      }
    case "week":
      return {
        interval: "1week",
        outputsize: "15"
      }
    case "month":
      return {
        interval: "1month",
        outputsize: "12"
      }
    default:
      return {
        interval: "1day",
        outputsize: "30"
      }
  }
}

export const querySeries = async (symbol: string, split: string = "day", mock?: boolean) => {
  const interval = splits(split);

  if (mock) {
    return mockSeries;
  }

  const options = {
    method: 'GET',
    url: 'https://twelve-data1.p.rapidapi.com/time_series',
    params: {
      outputsize: interval.outputsize,
      symbol: symbol,
      interval: interval.interval,
      format: 'json'
    },
    headers: {
      'x-rapidapi-key': '9fa5e0d10amshb36446e65b3494bp1c1f6ajsn6315992d2731',
      'x-rapidapi-host': 'twelve-data1.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    const validated = SeriesResponseSchema.parse(response.data);
    console.log(validated)
    return validated;
  } catch (error) {
    console.error(error);
  }
}