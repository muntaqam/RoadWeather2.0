import axios from 'axios';

interface WeatherResponse {
    temperature: number;
    weather_descriptions: string[];
    weather_icons: string[];
    //city: string;
}

export async function fetchWeather(lat: number, lng: number): Promise<WeatherResponse | null> {
    const weatherApiKey = 'afdd70c5b25b91b2330a51b46523b51e';
    const weatherUrl = `http://api.weatherstack.com/current?access_key=${weatherApiKey}&query=${lat},${lng}`;

    const geoApiKey = 'AIzaSyCjgpwny2sV97zBKjkJFRjPunMqxOPLFr0';
    const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${geoApiKey}`;

    try {
        const [weatherResponse, geoResponse] = await Promise.all([axios.get(weatherUrl), axios.get(geoUrl)]);
        // const city = geoResponse.data.results[0].address_components.find((component: any) => component.types.includes("locality")).long_name;

        if (weatherResponse.data && weatherResponse.data.current) {
            return {
                temperature: weatherResponse.data.current.temperature,
                weather_descriptions: weatherResponse.data.current.weather_descriptions,
                weather_icons: weatherResponse.data.current.weather_icons,
                // city: city
            };
        } else {
            console.log('No weather data found', weatherResponse.data);
            return null;
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}
