
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
import { User } from '../../components/models/user';
import { RouteProp, useRoute } from '@react-navigation/native';

import { useAppContext } from '../_layout'; // Percorso al file RootLayout
import { FilterChips } from '@/components/FilterChips';




const TabThreeScreen: React.FC = () => {

    const [selectedView, setSelectedView] = useState(1);
    const { filters, setFilters } = useAppContext();
    const [city, setCity] = useState<string>('Torino'); // Stato per la città
    const [dateTime, setDateTime] = useState<string>('Today - 20:00'); // Stato per ora e giorno
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

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
        listContainer: {
            flex: 1,
            marginTop: 10,
            justifyContent: 'center',
            alignItems: 'center',
        },
        listText: {
            fontSize: 18,
            fontWeight: 'bold',
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
        fakeSearchBar: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDarkMode ? '#333' : '#e3e3e4',
            borderRadius: 20,
            paddingHorizontal: 10,
            marginLeft: 10,
            height: 40,
        },
        cityText: {
            fontSize: 16,
            fontWeight: 'bold',
            marginRight: 5,
            color: isDarkMode ? '#FFF' : '#000',
        },
        dateTimeText: {
            flex: 1,
            fontSize: 14,
            textAlign: 'center',
            color: isDarkMode ? '#FFF' : '#000',
        },
        filterBar: {
            position: 'absolute',
            top: 10,
            left: 0,
            right: 0,
            flexDirection: 'row',
            paddingHorizontal: 10,
            paddingVertical: 5,
            zIndex: 10,
        },
        filterChip: {
            marginHorizontal: 5,
            paddingHorizontal: 15,
            paddingVertical: 8,
            borderRadius: 20,
            backgroundColor: isDarkMode ? '#444' : '#ddd',
        },
        filterText: {
            fontSize: 14,
            color: isDarkMode ? '#FFF' : '#000',

        },
    });

    return (
        <View style={styles.container}>
            <Login_form />
            <View style={styles.filterSearchContainer}>

                {/* Barra finta cliccabile */}
                <TouchableOpacity style={styles.fakeSearchBar} onPress={() => console.log('Bar clicked!')}>
                    <Text style={styles.cityText}>{city}</Text>
                    <Text style={styles.dateTimeText}>{dateTime}</Text>
                    <Link href="/search">
                        <IconSymbol size={20} name="magnifyingglass" color={isDarkMode ? '#FFF' : '#000'} />
                    </Link>
                </TouchableOpacity>

                <TouchableOpacity style={styles.filterButton}>
                    <Link href="/filter">
                        <IconSymbol size={28} name="line.3.horizontal.decrease" color={isDarkMode ? '#FFF' : '#000'} />
                    </Link>
                </TouchableOpacity>


            </View>
            <View style={styles.segmentedControlContainer}>
                <SegmentedControl
                    values={['List', 'Map']}
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
                    {/* Barra filtri scrollabile */}
                    <FilterChips/>

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
