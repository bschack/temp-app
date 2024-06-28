import axios from "axios";
import { SearchResponseSchema } from "./schema";

export const querySearch = async (query: string) => {
  const options = {
    method: 'GET',
    url: 'https://twelve-data1.p.rapidapi.com/symbol_search',
    params: {
      symbol: query,
      outputsize: '30'
    },
    headers: {
      'x-rapidapi-key': '9fa5e0d10amshb36446e65b3494bp1c1f6ajsn6315992d2731',
      'x-rapidapi-host': 'twelve-data1.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    const validated = SearchResponseSchema.parse(response.data);
    return validated.data;
  } catch (error) {
    console.error(error);
  }
}