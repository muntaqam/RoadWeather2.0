import axios from 'axios';

interface WeatherResponse {
    temperature: number;
    weather_descriptions: string[];
    weather_icons: string[];
}

export async function fetchWeather(lat: number, lng: number): Promise<WeatherResponse | null> {
    const apiKey = 'f6afe0c66ccb2906d4211c91dc71f53c'; // replace with your actual API key
    const url = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${lat},${lng}`;

    try {
        const response = await axios.get(url);
        if (response.data && response.data.current) {
            return {
                temperature: response.data.current.temperature,
                weather_descriptions: response.data.current.weather_descriptions,
                weather_icons: response.data.current.weather_icons,
            };
        } else {
            console.log('No weather data found', response.data);
            return null;
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}
