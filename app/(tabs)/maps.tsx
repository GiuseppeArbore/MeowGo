import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Modal,
    TextInput,
    Text,
    TouchableOpacity,
    useColorScheme
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Linking } from 'react-native';
import { Login_form } from '@/components/Login_form';


const TabThreeScreen: React.FC = () => {

    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';


    const openGoogleMaps = (latitude: number, longitude: number) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        Linking.openURL(url).catch(err => console.error('Error:', err));
    };

    const styles = StyleSheet.create({
            container: {
                flex: 1,
            },
            map: {
                ...StyleSheet.absoluteFillObject,
            },
        });


    return (
        <View style={styles.container}>
            <Login_form />
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 37.7749,
                    longitude: -122.4194,
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
