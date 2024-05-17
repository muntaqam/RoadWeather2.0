import axios from 'axios';

interface WeatherResponse {
    temperature: number;
    weather_descriptions: string[];
    weather_icons: string[];
    city: string;
}

export async function fetchWeather(lat: number, lng: number): Promise<WeatherResponse | null> {
    const weatherApiKey = 'c95ca835eb296fe68c7e80344cff681b'; // OpenWeather API key
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${weatherApiKey}&units=imperial`;

    const geoApiKey = 'AIzaSyA-Ntbb9UicoUsnpO1LERnY6U6PO8g_9fw'; // Google API key
    const nearbySearchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=50000&type=locality&key=${geoApiKey}`;

    try {
        const [weatherResponse, nearbyResponse] = await Promise.all([axios.get(weatherUrl), axios.get(nearbySearchUrl)]);
        console.log('Weather Response:', weatherResponse.data); // Log the weather response
        console.log('Nearby Response:', nearbyResponse.data); // Log the nearby response

        // Function to extract big city from nearby search results
        const extractBigCity = (results: any[]): string => {
            if (results.length > 0) {
                return results[0].name; // Return the name of the most prominent result
            }
            return "Unknown Location";
        };

        let city = "Unknown Location";
        if (nearbyResponse.data.results.length > 0) {
            city = extractBigCity(nearbyResponse.data.results);
        }

        if (weatherResponse.data && weatherResponse.data.main) {
            const tempFahrenheit = weatherResponse.data.main.temp;
            const weatherDescriptions = weatherResponse.data.weather.map((w: any) => w.description);
            const weatherIcons = weatherResponse.data.weather.map((w: any) => `https://openweathermap.org/img/wn/${w.icon}@2x.png`);

            return {
                temperature: tempFahrenheit,
                weather_descriptions: weatherDescriptions,
                weather_icons: weatherIcons,
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
