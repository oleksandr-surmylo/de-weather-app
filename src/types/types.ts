export interface WeatherData {
    daily: {
        time: Date[];
        weather_code: Float32Array | null;
        temperature_2m_max: Float32Array | null;
        temperature_2m_min: Float32Array | null;
        wind_speed_10m_max: Float32Array | null;
        wind_gusts_10m_max: Float32Array | null;
        wind_direction_10m_dominant: Float32Array | null;
    },
    current: {
        time: Date;
        temperature_2m: number | null;
        wind_speed_10m: number | null;
        wind_direction_10m: number | null;
        wind_gusts_10m: number | null;
        weather_code: number | null;
    }
}

export interface SearchResult {
    id: string | number;
    name: string;
    country: string;
    latitude: number;
    longitude: number;
}