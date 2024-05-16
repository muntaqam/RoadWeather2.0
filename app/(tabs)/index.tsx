import React, { useMemo, useRef, useState } from 'react';
import { StyleSheet, View, Dimensions, FlatList, TouchableOpacity, Text, Image } from 'react-native';
import MapView from 'react-native-maps';
import BottomSheet, { BottomSheetView, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import axios from 'axios';
import { calculateWaypoints, decodePolyline, getRouteDetails } from '../api/routesAPI';
import { fetchWeather } from '../api/weatherAPI';

type PlacePrediction = {
  place_id: string;
  description: string;
};

interface WeatherResponse {
  temperature: number;
  weather_descriptions: string[];
  weather_icons: string[];
  city: string;
}

const HomeScreen: React.FC = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '50%', '75%'], []);
  const [startLocation, setStartLocation] = useState<string>('');
  const [destinationLocation, setDestinationLocation] = useState<string>('');
  const [startSuggestions, setStartSuggestions] = useState<PlacePrediction[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<PlacePrediction[]>([]);
  const [startLocationId, setStartLocationId] = useState('');
  const [destinationLocationId, setDestinationLocationId] = useState('');
  const [weatherData, setWeatherData] = useState<(WeatherResponse | null)[]>([]);

  const handleSheetChanges = (index: number) => {
    console.log('handleSheetChanges', index);
  };

  const fetchPlaces = async (input: string, setSuggestions: React.Dispatch<React.SetStateAction<PlacePrediction[]>>) => {
    const apiKey = 'AIzaSyCjgpwny2sV97zBKjkJFRjPunMqxOPLFr0';
    if (input.length > 2) {
      try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}&language=en`);
        setSuggestions(response.data.predictions);
      } catch (error) {
        console.error('Failed to fetch places:', error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleCalculateWaypoints = async () => {
    const route = await getRouteDetails(startLocationId, destinationLocationId);
    if (route && route.overview_polyline && route.overview_polyline.points) {
      const coordinates = decodePolyline(route.overview_polyline.points);
      const totalDistanceKm = route.distance / 1000; // Convert meters to kilometers

      // Determine the number of waypoints based on the total distance
      let numWaypoints;
      if (totalDistanceKm > 160.934) { // 100 miles in kilometers
        numWaypoints = 5;
      } else {
        numWaypoints = 3;
      }

      const intervalKm = totalDistanceKm / (numWaypoints + 1);

      const waypoints = calculateWaypoints(coordinates, intervalKm);

      try {
        const weatherData = await Promise.all(waypoints.map(wp => fetchWeather(wp.lat, wp.lng)));
        console.log('Weather data for waypoints:', weatherData);
        setWeatherData(weatherData);
      } catch (error) {
        console.error('Error fetching weather data for waypoints:', error);
      }
    } else {
      console.log('No route or waypoints found.');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 40.7128,
          longitude: -74.0060,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <BottomSheetView style={styles.contentContainer}>
          <BottomSheetTextInput
            placeholder="Enter starting point"
            placeholderTextColor="#c7c7cd"
            style={styles.textInput}
            keyboardType="default"
            value={startLocation}
            onChangeText={(text) => {
              setStartLocation(text);
              fetchPlaces(text, setStartSuggestions);
            }}
          />
          {startSuggestions.length > 0 && (
            <FlatList
              data={startSuggestions}
              keyExtractor={(item) => item.place_id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => {
                    setStartLocation(item.description);
                    setStartLocationId(item.place_id);
                    setStartSuggestions([]);
                  }}
                >
                  <Text>{item.description}</Text>
                </TouchableOpacity>
              )}
              style={styles.suggestionsList}
            />
          )}
          <BottomSheetTextInput
            placeholder="Enter destination"
            placeholderTextColor="#c7c7cd"
            style={styles.textInput}
            keyboardType="default"
            value={destinationLocation}
            onChangeText={(text) => {
              setDestinationLocation(text);
              fetchPlaces(text, setDestinationSuggestions);
            }}
          />
          {destinationSuggestions.length > 0 && (
            <FlatList
              data={destinationSuggestions}
              keyExtractor={(item) => item.place_id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => {
                    setDestinationLocation(item.description);
                    setDestinationLocationId(item.place_id);
                    setDestinationSuggestions([]);
                  }}
                >
                  <Text>{item.description}</Text>
                </TouchableOpacity>
              )}
              style={styles.suggestionsList}
            />
          )}
          <TouchableOpacity
            style={styles.findRouteButton}
            onPress={handleCalculateWaypoints}
          >
            <Text style={styles.buttonText}>View Weather Forecast</Text>
          </TouchableOpacity>
          {weatherData.length > 0 && (
            <View style={styles.weatherContainer}>
              {weatherData.map((item, index) => (
                <View key={index} style={styles.weatherItem}>
                  {item ? (
                    <>
                      <Text style={styles.cityText}>{item.city}</Text>
                      <Image source={{ uri: item.weather_icons[0] }} style={styles.weatherIcon} />
                      <Text>{`${item.temperature}°F - ${item.weather_descriptions[0]}`}</Text>
                    </>
                  ) : (
                    <Text style={styles.weatherText}>Weather data unavailable</Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  textInput: {
    alignSelf: "stretch",
    marginHorizontal: 12,
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: "white",
    color: "black",
    fontSize: 16,
    textAlign: "left",
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  suggestionItem: {
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  suggestionsList: {
    maxHeight: 200,
  },
  findRouteButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignSelf: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  weatherContainer: {
    alignSelf: "stretch",
    marginTop: 20,
  },
  weatherItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    width: '100%',
  },
  cityText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  weatherIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  weatherText: {
    fontSize: 16,
    color: '#333',
  },
});

export default HomeScreen;
