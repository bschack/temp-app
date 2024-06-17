export const environment = process.env.NODE_ENV || 'development';

export const baseConfig = {
  backend: {
    url: environment === 'development' ? 'http://localhost:8080' : 'https://api.example.com',
  }
};