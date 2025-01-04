import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, useColorScheme, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Linking } from 'react-native';
import { Link, useNavigation } from 'expo-router';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Login_form } from '@/components/Login_form';
import { DATABASE_NAME } from '../../utils/database';
import { Event } from '../../components/models/event';
import { useAppContext } from '../_layout'; // Percorso al file RootLayout
import EventDetailsPopup from '@/components/EventDetailsPopup';
import { EventList } from '@/components/EventList';
import { FilterChips } from '@/components/FilterChips';
import { SearchBar } from '@/components/SearchBar';




const TabThreeScreen: React.FC = () => {
    const { allEvents } = useAppContext();
    const [selectedView, setSelectedView] = useState(1);
    const { filters, searchFilters } = useAppContext();
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const filterTextMap: Record<string, string> = {
        localLegend: filters.localLegend ? 'Local Legend' : '',
        maxPeople: filters.maxPeople > 1 ? `< ${filters.maxPeople} people` : '',
        eventType: filters.eventType || '',
        location: filters.location ? `${filters.location}` : '',
    };

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

    const styles = StyleSheet.create({

        container: {
            flex: 1,
        },
        segmentedControlContainer: {
            marginHorizontal: 10,
            paddingHorizontal: 10,
        },
        filterSearchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 60,
            marginBottom: 8,
            marginRight: 10,
            paddingVertical: 5,
            paddingHorizontal: 10,
        },
        mapContainer: {
            flex: 1,
            marginTop: 10,
        },
        map: {
            flex: 1,
        },
        filterButton: {
            width: 40,
            height: 40,
            backgroundColor: isDarkMode ? '#333' : '#e3e3e4',
            borderRadius: 20,
            marginLeft: 10,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });

    return (
        <View style={styles.container}>
            <Login_form />
            <View style={styles.filterSearchContainer}>

                
                {/* Barra finta cliccabile */}   
                <SearchBar/>
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
                    values={['List', 'Map']}
                    selectedIndex={selectedView}
                    onChange={event => setSelectedView(event.nativeEvent.selectedSegmentIndex)}
                />
            </View>

            {selectedView === 0 ? (
                <View style={styles.mapContainer}>
                <EventList />
                </View>
            ) : (
                <View style={styles.mapContainer}>
                    {/* Barra filtri scrollabile */}
                    <FilterChips />
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
