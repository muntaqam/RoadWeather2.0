import React, { useMemo, useRef, useState } from 'react';
import { StyleSheet, View, Dimensions, FlatList, TouchableOpacity, Text } from 'react-native';
import MapView from 'react-native-maps';
import BottomSheet, { BottomSheetView, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import axios from 'axios';
import { calculateWaypoints, decodePolyline, getRouteDetails } from '../api/routesAPI';
import polyline from '@mapbox/polyline';
import { fetchWeather } from '../api/weatherAPI';
import { Image } from 'react-native';

// Define type for place predictions to be used in autocomplete suggestions
type PlacePrediction = {
  place_id: string;
  description: string;
};


interface WeatherResponse {
  temperature: number;
  weather_descriptions: string[];
  weather_icons: string[];
}


const HomeScreen: React.FC = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);  // Use specific component type for useRef
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  const [startLocation, setStartLocation] = useState<string>('');  // Specify string type for state
  const [destinationLocation, setDestinationLocation] = useState<string>('');  // Specify string type for state

  const [startSuggestions, setStartSuggestions] = useState<PlacePrediction[]>([]);  // Specify array of PlacePrediction for state
  const [destinationSuggestions, setDestinationSuggestions] = useState<PlacePrediction[]>([]);  // Specify array of PlacePrediction for state


  // State for storing place IDs
  const [startLocationId, setStartLocationId] = useState('');
  const [destinationLocationId, setDestinationLocationId] = useState('');


  const [weatherData, setWeatherData] = useState<(WeatherResponse | null)[]>([]);



  const handleSheetChanges = (index: number) => {  // Specify type for index
    console.log('handleSheetChanges', index);
  };


  //fetch places suggestions google places api autocomplete 
  const fetchPlaces = async (input: string, setSuggestions: React.Dispatch<React.SetStateAction<PlacePrediction[]>>) => {
    const apiKey = 'AIzaSyCjgpwny2sV97zBKjkJFRjPunMqxOPLFr0'; // Ensure to replace this with your actual Google API key
    if (input.length > 2) {
      try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}&language=en`);
        setSuggestions(response.data.predictions);
      } catch (error) {
        console.error('Failed to fetch places:', error);
        setSuggestions([]);  // Clear suggestions on error
      }
    } else {
      setSuggestions([]);  // Clear suggestions if input is cleared or very short
    }
  };


  const handleSubmit = async () => {
    const route = await getRouteDetails(startLocationId, destinationLocationId);
    console.log("----------THIS IS THE START ID-----", startLocationId)
    console.log("----------THIS IS THE END ID-----", destinationLocationId)
    if (route) {
      console.log('Route found:', route);
      // Optionally handle the route data (display it, store it, etc.)
    } else {
      console.log('No route found or error occurred.');
    }
  };


  //valculate waypoints
  const handleCalculateWaypoints = async () => {
    const route = await getRouteDetails(startLocationId, destinationLocationId);
    if (route && route.overview_polyline && route.overview_polyline.points) {
      const coordinates = decodePolyline(route.overview_polyline.points);
      const totalDistanceKm = route.distance / 1000; // Convert meters to kilometers
      const intervalKm = totalDistanceKm / 3; // Divide total distance by 3 to get 4 waypoints

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
              console.log("Start location: ", startLocation)
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
              console.log("END location: ", destinationLocation)
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
                    console.log("----------------------------")
                    console.log("this is the item", item)
                    console.log("----------------------------")
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
            onPress={() => {
              //handleSubmit();
              handleCalculateWaypoints();
            }}
          >
            <Text style={styles.buttonText}>Calculate weather</Text>
          </TouchableOpacity>

          {/* Weather data display */}
          {weatherData.length > 0 && (
            <FlatList
              data={weatherData}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => {
                if (item) {  // Check if item is not null
                  return (
                    <View style={styles.weatherItem}>
                      <Image source={{ uri: item.weather_icons[0] }} style={styles.weatherIcon} />
                      <Text>{`${item.temperature}°C - ${item.weather_descriptions[0]}`}</Text>
                    </View>
                  );
                } else {
                  return <Text style={styles.weatherText}>Weather data unavailable</Text>;
                }
              }}

            />

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
    maxHeight: 200, // Set a maximum height for the suggestions list
  },

  findRouteButton: {
    backgroundColor: "#007AFF", // Apple Maps blue color
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
  weatherItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',  // Aligns children (e.g., the icon) to the left
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    alignSelf: "stretch",
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
