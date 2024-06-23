export const config = {
  finnhub: {
    baseUrl: 'https://finnhub.io/api/v1',
    endpoints: {
      company: '/stock/profile2?symbol=',
      search: '/search?q=',
      quote: '/quote?symbol=',
      market_status: '/stock/market_status?exchange=US',
    },
    authToken: process.env.FINNHUB_API_KEY,
  }
}