import axios from "axios";
import { StockDataSchema } from "./schema";
import { mockAAPL, mockGS, mockPLTR } from "./mocks";

export const queryAllStockData = async (symbol: string, mock?: boolean) => {
  if (mock) {
    if (symbol === "PLTR") return StockDataSchema.parse(mockPLTR);
    else if (symbol === "GS") return StockDataSchema.parse(mockGS);
    else return StockDataSchema.parse(mockAAPL);
  }

  const url = `https://api.twelvedata.com/complex_data?apikey=${process.env.NEXT_PUBLIC_TWELVE_API}`;
  const headers = {
    'Content-Type': 'application/json'
  };
  const data = {
    "symbols": [symbol],
    "intervals": ["1day"],
    "outputsize": 30,
    "methods": [
      "time_series",
      "quote",
      "price",
    ]
  };

  try {
    const res = await axios.post(url, data, { headers });
    if (res.data.status !== "ok") {
      throw new Error(res.data.message);
    }
    console.log(res.data.data)
    const valid = StockDataSchema.safeParse(res.data.data);
    if (!valid.success) {
      throw new Error(valid.error.message);
    }
    return valid.data;
  }
  catch (error) {
    // console.error(error);
    throw error;
  }
}