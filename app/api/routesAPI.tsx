import axios from 'axios';

interface Step {
    start_location: {
        lat: number;
        lng: number;
    };
    end_location: {
        lat: number;
        lng: number;
    };
    travel_mode: string;
    instructions: string;
}

interface Leg {
    steps: Step[];
    start_address: string;
    end_address: string;
    distance: {
        value: number; // in meters
        text: string;
    };
    duration: {
        value: number; // in seconds
        text: string;
    };
}

interface Route {
    legs: Leg[];
    overview_polyline: {
        points: string; // Encoded polyline string of the route
    };
    summary: string;
}


// Function to fetch route details from Google Directions API
export const getRouteDetails = async (startLocationId: string, destinationLocationId: string): Promise<Route | null> => {
    const apiKey = 'AIzaSyA-Ntbb9UicoUsnpO1LERnY6U6PO8g_9fw'; // Replace with your actual API key
    //console.log("beg", startLocationId)

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=place_id:${startLocationId}&destination=place_id:${destinationLocationId}&travel_mode=driving&key=${apiKey}`;
    // console.log("URL-------",url)
    try {
        const response = await axios.get(url);
        // console.log("RESPONSE---------_", response)
        if (response.data.routes.length > 0) {
            const route = response.data.routes[0] as Route;  // Take the first route and assert the type
            return route;
        } else {
            console.log('No routes found.');
            return null;
        }
    } catch (error) {
        console.error('Failed to fetch route:', error);
        return null;  // Properly handle the error
    }
};