interface GeolocationCoordinates {
  latitude: number; // The latitude as a decimal number (always returned)
  longitude: number; // The longitude as a decimal number (always returned)
  accuracy: number; // The accuracy of position (always returned)
  altitude: number | null; // The altitude in meters above the mean sea level (returned if available)
  altitudeAccuracy: number | null; // The altitude accuracy of position (returned if available)
  heading: number | null; // The heading as degrees clockwise from North (returned if available)
  speed: number | null; // The speed in meters per second (returned if available)
}

export interface GeolocationPosition {
  coords: GeolocationCoordinates;
  timestamp?: number; // The date/time of the response (returned if available)
}

interface GeoJsonContext {
  "@context": (string | Record<string, unknown>)[];
}

interface Geometry {
  type: string;
  coordinates: number[];
}

interface DistanceBearing {
  unitCode: string;
  value: number;
}

interface RelativeLocationProperties {
  city: string;
  state: string;
  distance: DistanceBearing;
  bearing: DistanceBearing;
}

interface RelativeLocation {
  type: string;
  geometry: Geometry;
  properties: RelativeLocationProperties;
}

interface Properties {
  "@id": string;
  "@type": string;
  cwa: string;
  forecastOffice: string;
  gridId: string;
  gridX: number;
  gridY: number;
  forecast: string;
  forecastHourly: string;
  forecastGridData: string;
  observationStations: string;
  relativeLocation: RelativeLocation;
  forecastZone: string;
  county: string;
  fireWeatherZone: string;
  timeZone: string;
  radarStation: string;
}

export interface WeatherEndpointResponse {
  "@context": (string | Record<string, unknown>)[];
  id: string;
  type: string;
  geometry: Geometry;
  properties: Properties;
}