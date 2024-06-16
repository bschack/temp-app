export default async function GetWeather(endpoint: string | undefined) {
  if (!endpoint) {
    throw new Error("No weather endpoint provided.");
  }
  const data = await fetch(endpoint);
  return data;
}