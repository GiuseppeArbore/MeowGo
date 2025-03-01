import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewCluster from 'react-native-map-clustering';
import { useAppContext } from '../_layout';
import { Event } from '../../components/models/event';
import { useColorScheme } from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import EventDetailsPopup from '@/components/EventDetailsPopup';
import { EventList } from '@/components/EventList';
import { FilterChips } from '@/components/Filter/FilterChips';
import { SearchBar } from '@/components/SearchBar/SearchBar';
import { Filter } from '@/components/Filter/Filter';
import { Faq } from '@/components/FaqPopup';
import { router } from 'expo-router';

const TabThreeScreen: React.FC = () => {
  const { allEvents, myEvents } = useAppContext();
  const [selectedView, setSelectedView] = useState(1);
  const { filters, searchFilters } = useAppContext();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [showedEvents, setShowedEvents] = useState<Event[]>([]);
  const [inMapRegion, setInMapRegion] = useState({
    latitude: 45.066685,
    longitude: 7.6738884,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [mapRegion, setMapRegion] = useState({
    latitude: 45.066685,
    longitude: 7.6738884,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); // Stato per forzare il re-render della mappa

  useEffect(() => {
    const newRegion = getInitLocation(searchFilters.city);
    setMapRegion({
      latitude: newRegion.latitude,
      longitude: newRegion.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
    setInMapRegion({
      latitude: newRegion.latitude,
      longitude: newRegion.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
    console.log('New region:', newRegion);
  }, [searchFilters.city]);

  const getInitLocation = (city: string) => {
    switch (city) {
      case "Turin":
        return { latitude: 45.066685, longitude: 7.6738884 };
      case "Bari":
        return { latitude: 41.117143, longitude: 16.87187 };
      default:
        return { latitude: 45.0, longitude: 7.6 };
    }
  };

  const handleRegionChange = (region: any) => {
    setMapRegion(region);
  };

  useEffect(() => {
    const showed = allEvents.filter(event => {
      return (
        event.city == searchFilters.city &&
        (searchFilters.date || new Date(event.date) > new Date(searchFilters.date as string)) &&
        (!filters.localLegend || event.local_legend_here) &&
        (filters.maxPeople == 1 || event.max_people <= filters.maxPeople) &&
        (!filters.eventType || event.type === filters.eventType) &&
        (!filters.location || event.place.toLowerCase() === filters.location.toLowerCase()) &&
        !myEvents.includes(event.name) 
      );
    });
    setShowedEvents(showed);
    setLoading(false);
  }, [filters, searchFilters, allEvents, mapRegion]);

  useEffect(() => {
      // Forza un refresh della mappa quando si passa alla vista "Map"
      setRefreshKey(prevKey => prevKey + 1);    
  }, [selectedView, searchFilters.city]);


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
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.filterSearchContainer}>
        {/* Faq */}
        <TouchableOpacity style={styles.filterButton}>
          <Faq />
        </TouchableOpacity>

        {/* Barra finta cliccabile */}
        <SearchBar setShowedEvents={setShowedEvents} filters={filters} />
        <TouchableOpacity style={styles.filterButton}>
          <Filter setShowedEvents={setShowedEvents} searchFilters={searchFilters} />
        </TouchableOpacity>
      </View>
      <View style={styles.segmentedControlContainer}>
        <SegmentedControl
          values={['List', 'Map']}
          selectedIndex={selectedView}
          onChange={event => {
            setSelectedView(event.nativeEvent.selectedSegmentIndex);
          }}
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
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#000'} />
            </View>
          ) : (
            <MapViewCluster
              key={`${refreshKey}`} // Usa la chiave per forzare il re-render
              style={styles.map}
              region={inMapRegion}
              onRegionChangeComplete={handleRegionChange}
            >
              {showedEvents.length > 0 ? showedEvents.map((event, index) => {
                const latitude = parseFloat(event.latitude.toString());
                const longitude = parseFloat(event.longitude.toString());

                if (!isNaN(latitude) && !isNaN(longitude)) {
                  return (
                    <Marker
                      key={index}
                      coordinate={{
                        latitude,
                        longitude,
                      }}
                      onPress={() => handleMarkerPress(event)}
                    />
                  );
                } else {
                  console.warn(`Invalid coordinates for event: ${event.name}`, event);
                  return null;
                }
              }) : <View style={styles.loadingContainer}><ActivityIndicator size="large" animating={false} color={isDarkMode ? '#fff' : '#000'} /></View>}

            </MapViewCluster>
          )}
        </View>
      )}

      {/* Render del pop-up */}
      {selectedEvent && (
        <EventDetailsPopup
          visible={isPopupVisible}
          onClose={handleClosePopup}
          onDetails={() => {
            router.push(`/eventPageDetails?eventId=${selectedEvent.name}`);
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
