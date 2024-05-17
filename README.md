# RoadWeather

RoadWeather is a mobile application developed with React Native and TypeScript that provides users with real-time weather forecasts for multiple cities along their road trip route. By leveraging the Google Maps API and WeatherStack API, the app dynamically calculates waypoints and fetches accurate weather data to enhance trip planning and safety.

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo
## Features

- Real-time weather forecasts for multiple cities along the route
- Dynamic waypoint calculation using Google Maps API
- Accurate weather data integration via WeatherStack API
- User-friendly and visually appealing interface
- Efficient API request handling for smooth, real-time updates


![Description](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExamgxZjN0OHFnNnIxaml6c3BvaGJidmNqOTcwdXV5MjhyZWFieGhwZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ATAmal71C4Maneg6Hg/giphy.gif)


## Installation

To get started with RoadWeather, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/muntaqam/roadweather.git
    ```

2. Navigate to the project directory:
    ```bash
    cd roadweather
    ```

3. Install the dependencies:
    ```bash
    npm install
    ```

4. Create a `.env` file in the root directory and add your API keys:
    ```env
    WEATHERSTACK_API_KEY=your_weatherstack_api_key
    GOOGLE_MAPS_API_KEY=your_google_maps_api_key
    ```

5. Start the development server:
    ```bash
    npx expo start -c
    ```

## Usage

1. Open the app on your mobile device or emulator.
2. Enter your starting point and destination.
3. View real-time weather forecasts for multiple cities along your route.

## Features in Progress

- **Time-stamped Weather Forecasts**: Display weather forecasts for cities based on the estimated time of arrival.
- **Enhanced UX/UI Designs**: Improve the user interface for a more seamless and intuitive experience.


## Future Features
- **Route Saving**: Allow users to save their favorite routes for quick access in the future.
- **Custom Waypoints**: Allow users to add custom waypoints along their route for more detailed weather information.


  

## Built With
- [React Native](https://reactnative.dev/) - Framework for building native apps using React
- [Expo](https://expo.dev/) - Platform for making universal React applications
- [Google Maps API](https://developers.google.com/maps) - API for maps and location data
- [OpenWeather API](https://openweathermap.org/api) - API for weather data
- [react-native-bottom-sheet](https://github.com/gorhom/react-native-bottom-sheet) - Bottom sheet component for React Native


## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any features, bug fixes, or enhancements.

## Contact

For any questions or suggestions, feel free to contact me at [munma980@gmail.com](mailto:munma980@gmail.com).
