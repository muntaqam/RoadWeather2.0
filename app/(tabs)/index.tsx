import React, { useMemo, useRef } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import BottomSheet, { BottomSheetView, BottomSheetTextInput } from "@gorhom/bottom-sheet";

const HomeScreen = () => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  const handleSheetChanges = (index) => {
    console.log('handleSheetChanges', index);
  }

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
            placeholderTextColor="#c7c7cd"  // Light grey color commonly used for placeholders
            style={styles.textInput}
            keyboardType="default"
          />
          <BottomSheetTextInput
            placeholder="Enter destination"
            placeholderTextColor="#c7c7cd"  // Light grey color
            style={styles.textInput}
            keyboardType="default"
          />
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
    alignItems: 'center', // Center the content horizontally
    padding: 20, // Add some padding around the content
  },
  textInput: {
    alignSelf: "stretch",
    marginHorizontal: 12,
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10, // More rounded corners
    backgroundColor: "white",
    color: "black",
    fontSize: 16,
    textAlign: "left",
    borderWidth: 1,
    borderColor: '#ccc', // Subtle border
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3, // for Android
  }
});

export default HomeScreen;
