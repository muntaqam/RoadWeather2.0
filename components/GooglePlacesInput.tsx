import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

interface GooglePlacesInputProps {
    placeholder: string;
    value: string;
    setAddress: (address: string) => void;
}

const GooglePlacesInput: React.FC<GooglePlacesInputProps> = ({ placeholder, value, setAddress }) => {
    return (
        <GooglePlacesAutocomplete
            disableScroll={true}

            placeholder={placeholder}
            fetchDetails={true}




            onPress={(data, details = null) => {

                const address = details?.formatted_address || data.description;
                setAddress(address); // Update the parent state with the selected address
                console.log("this is the address", address)
                console.log("Selected data:", data);
                console.log("Selected details:", details);
                console.log("Address to set:", address);
                setAddress(address);
            }}
            query={{
                key: 'AIzaSyCjgpwny2sV97zBKjkJFRjPunMqxOPLFr0',  // Ensure you replace this with your actual API key
                language: 'en', // Language of the results
            }}
            styles={{
                textInputContainer: {
                    backgroundColor: 'rgba(0,0,0,0)',
                },
                textInput: {
                    flex: 1,
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 10,
                    margin: 5,
                },
                predefinedPlacesDescription: {
                    color: '#1faadb',
                },
                listView: { // Controlling the height of the list view might help in not needing to scroll
                    height: 120, // Adjust height based on your UI design to accommodate about 3 items
                },
            }}
            textInputProps={{
                value: value,  // Control the displayed value
                onChangeText: setAddress,  // Handle changes
            }}
            debounce={200}
        />
    );
};

export default GooglePlacesInput;
