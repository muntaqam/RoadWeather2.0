import axios from 'axios';
import polyline from '@mapbox/polyline';

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
        points: string;
    };
    summary: string;
    distance: number;
}

export const getRouteDetails = async (startLocationId: string, destinationLocationId: string): Promise<Route | null> => {
    const apiKey = env.LOCATIONAPI;

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=place_id:${startLocationId}&destination=place_id:${destinationLocationId}&travel_mode=driving&key=${apiKey}`;
    try {
        const response = await axios.get(url);
        if (response.data.routes.length > 0) {
            const route = response.data.routes[0] as Route;
            const totalDistance = route.legs.reduce((sum, leg) => sum + leg.distance.value, 0);
            route.distance = totalDistance;
            return route;
        } else {
            console.log('No routes found.');
            return null;
        }
    } catch (error) {
        console.error('Failed to fetch route:', error);
        return null;
    }
};

export const decodePolyline = (encoded: string): { lat: number; lng: number; }[] => {
    return polyline.decode(encoded).map(([lat, lng]) => ({ lat, lng }));
};

export const calculateWaypoints = (coordinates: { lat: number; lng: number; }[], intervalKm: number): { lat: number; lng: number; }[] => {
    const waypoints: { lat: number; lng: number; }[] = [];
    let remainingDistance = intervalKm;
    let accumulatedDistance = 0;

    for (let i = 1; i < coordinates.length; i++) {
        const prev = coordinates[i - 1];
        const curr = coordinates[i];
        const distance = haversineDistance(prev, curr);

        if (accumulatedDistance + distance >= remainingDistance) {
            waypoints.push(curr);
            remainingDistance += intervalKm;
        }
        accumulatedDistance += distance;
    }

    return waypoints;
};

const haversineDistance = (coord1: { lat: number; lng: number; }, coord2: { lat: number; lng: number; }): number => {
    const R = 6371; // Earth radius in km
    const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
    const dLng = (coord2.lng - coord1.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};
