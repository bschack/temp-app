import axios from 'axios';
import { QuoteResponseSchema } from './schema';

export const queryQuote = async (symbol: string, mock?: boolean) => {
  const options = {
    method: 'GET',
    url: 'https://twelve-data1.p.rapidapi.com/quote',
    params: {
      symbol: symbol,
      outputsize: '30',
      format: 'json',
      interval: '1day'
    },
    headers: {
      'x-rapidapi-key': '9fa5e0d10amshb36446e65b3494bp1c1f6ajsn6315992d2731',
      'x-rapidapi-host': 'twelve-data1.p.rapidapi.com'
    }
  };
  try {
    const response = await axios.request(options);
    const validated = await QuoteResponseSchema.parseAsync(response.data);
    console.log(validated)
    return validated
  } catch (error) {
    console.error(error);
  }
}