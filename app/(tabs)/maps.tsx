import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    useColorScheme,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Linking } from 'react-native';
import { Link } from 'expo-router';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Login_form } from '@/components/Login_form';
import { Event } from '../../components/models/event';
import { useAppContext } from '../_layout'; // Percorso al file RootLayout
import EventDetailsPopup from '@/components/EventDetailsPopup';
import { EventList } from '@/components/EventList';

const styles = StyleSheet.create({
    container: { flex: 1 },
    segmentedControlContainer: { marginTop: 10, marginHorizontal: 10 },
    filterSearchContainer: { marginTop: 50, marginBottom: 1 },
    mapContainer: { flex: 1, marginTop: 10 },
    map: { flex: 1 },
    filterButton: { marginLeft: 10 },
});

const TabThreeScreen: React.FC = () => {
    const { allEvents } = useAppContext(); // Accediamo ai dati dal contesto
    const colorScheme = useColorScheme() || 'light';
    const [selectedView, setSelectedView] = useState(0);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const openGoogleMaps = (latitude: number, longitude: number) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        Linking.openURL(url).catch(err => console.error('Error:', err));
    };

    const handleMarkerPress = (event: Event) => {
        setSelectedEvent(event);
        setIsPopupVisible(true);
    };

    const handleClosePopup = () => {
        setIsPopupVisible(false);
        setSelectedEvent(null);
    };

    return (
        <View style={styles.container}>
            <Login_form />
            <View style={styles.filterSearchContainer}>
                <TouchableOpacity style={styles.filterButton}>
                    <Link href="/filter">
                        <IconSymbol
                            size={28}
                            name="line.3.horizontal.decrease"
                            color={colorScheme === 'dark' ? '#FFF' : '#000'}
                        />
                    </Link>
                </TouchableOpacity>
            </View>
            <View style={styles.segmentedControlContainer}>
                <SegmentedControl
                    values={['Lista', 'Mappa']}
                    selectedIndex={selectedView}
                    onChange={event => setSelectedView(event.nativeEvent.selectedSegmentIndex)}
                />
            </View>

            {selectedView === 0 ? (
                <EventList />
            ) : (
                <View style={styles.mapContainer}>
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: 45.062726590129316,
                            longitude: 7.6620286871370915,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                    >
                        {allEvents.map((event, index) => (
                            <Marker
                                key={index}
                                coordinate={{
                                    latitude: event.latitude,
                                    longitude: event.longitude,
                                }}
                                onPress={() => handleMarkerPress(event)}
                            />
                        ))}
                    </MapView>
                </View>
            )}

            {/* Render del pop-up */}
            {selectedEvent && (
                <EventDetailsPopup
                    visible={isPopupVisible}
                    onClose={handleClosePopup}
                    onDetails={() => {
                        // Puoi gestire la navigazione ai dettagli qui
                        console.log('Navigate to details for', selectedEvent);
                        setIsPopupVisible(false);
                    }}
                    event={selectedEvent}
                />
            )}
        </View>
    );
};

export default TabThreeScreen;
