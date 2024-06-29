import axios from "axios";
import { PriceResponseSchema } from "./schema";

export const queryPrice = async (symbol: string, mock?: boolean) => {
  const options = {
    method: 'GET',
    url: 'https://twelve-data1.p.rapidapi.com/price',
    params: {
      format: 'json',
      outputsize: '30',
      symbol: symbol,
    },
    headers: {
      'x-rapidapi-key': '9fa5e0d10amshb36446e65b3494bp1c1f6ajsn6315992d2731',
      'x-rapidapi-host': 'twelve-data1.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    const validated = PriceResponseSchema.parse(response.data);
    console.log(validated)
    return validated;
  } catch (error) {
    console.error(error);
  }
}