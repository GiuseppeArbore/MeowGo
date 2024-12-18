import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SearchBar } from '@rneui/themed';
import MapView, { Marker } from 'react-native-maps';
import { Linking } from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    segmentedControlContainer: {
        marginTop: 50,
        marginHorizontal: 10,
    },
    mapContainer: {
        flex: 1,
        marginTop: 10,
    },
    map: {
        flex: 1,
    },
    listContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listText: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});

const TabThreeScreen: React.FC = () => {

    const [selectedView, setSelectedView] = useState(0);

    const openGoogleMaps = (latitude: number, longitude: number) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        Linking.openURL(url).catch(err => console.error('Error:', err));
    };

    return (
        <View style={styles.container}>
            <View style={styles.segmentedControlContainer}>
                <SearchBar
                    placeholder="Turin"
                    platform='ios'
                />
                <SegmentedControl
                    values={['Lista', 'Mappa']}
                    selectedIndex={selectedView}
                    onChange={(event: { nativeEvent: { selectedSegmentIndex: React.SetStateAction<number>; }; }) => setSelectedView(event.nativeEvent.selectedSegmentIndex)}
                />
            </View>

            {selectedView === 0 ? (
                <View style={styles.listContainer}>
                    <Text style={styles.listText}>Qui ci sarà la lista!</Text>
                </View>
            ) : (
                <View style={styles.mapContainer}>
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
        )}
        </View>
    );
};

export default TabThreeScreen;


