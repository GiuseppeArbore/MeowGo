import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Linking } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

const TabThreeScreen: React.FC = () => {

    const openGoogleMaps = (latitude: number, longitude: number) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        Linking.openURL(url).catch(err => console.error('Error:', err));
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 37.7749, // Initial latitude
                    longitude: -122.4194, // Initial longitude
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                <Marker
                    coordinate={{ latitude: 37.7749, longitude: -122.4194 }}
                    title="Posizione"
                    description="Clicca per indicazioni"
                    onCalloutPress={() => openGoogleMaps(37.7749, -122.4194)}
                />
            </MapView>
        </View>
    );
};

export default TabThreeScreen;


