import axios from 'axios';

interface WeatherResponse {
    temperature: number;
    weather_descriptions: string[];
    weather_icons: string[];
    city: string;
}

export async function fetchWeather(lat: number, lng: number): Promise<WeatherResponse | null> {
    const weatherApiKey = 'afdd70c5b25b91b2330a51b46523b51e';
    const weatherUrl = `http://api.weatherstack.com/current?access_key=${weatherApiKey}&query=${lat},${lng}`;

    const geoApiKey = 'AIzaSyA-Ntbb9UicoUsnpO1LERnY6U6PO8g_9fw';
    const nearbySearchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=50000&type=locality&key=${geoApiKey}`;

    try {
        const [weatherResponse, nearbyResponse] = await Promise.all([axios.get(weatherUrl), axios.get(nearbySearchUrl)]);
        console.log('Nearby Response:', nearbyResponse.data); // Log the nearby response

        // Function to extract big city from nearby search results
        const extractBigCity = (results: any[]): string => {
            if (results.length > 0) {
                // Sort by population or prominence if available (assuming it's ordered by prominence)
                return results[0].name; // Return the name of the most prominent result
            }
            return "Unknown Location";
        };

        let city = "Unknown Location";
        if (nearbyResponse.data.results.length > 0) {
            city = extractBigCity(nearbyResponse.data.results);
        }

        console.log('this is the city-------------------------', city); // Log the city

        if (weatherResponse.data && weatherResponse.data.current) {
            return {
                temperature: weatherResponse.data.current.temperature,
                weather_descriptions: weatherResponse.data.current.weather_descriptions,
                weather_icons: weatherResponse.data.current.weather_icons,
                city: city
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
