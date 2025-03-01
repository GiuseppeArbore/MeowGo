import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, useColorScheme, Alert, FlatList, Image } from 'react-native';
import { Link, router } from 'expo-router';
import { Event } from '../components/models/event';
import { Filters, useAppContext } from '@/app/_layout';
import { formatDateTime } from '@/hooks/dateFormat';
import { FilterChips } from './Filter/FilterChips';

export function EventList() {

    const { allEvents, filters, searchFilters, myEvents } = useAppContext(); // Accediamo ai dati dal contesto

    // Verifica se ci sono filtri attivi
    const hasActiveFilters = Object.values(filters).some(
        (value) => value !== null && value !== false && value !== 99
    );

    const liststyles = (colorScheme: string) => StyleSheet.create({

        listMargin: {
            marginTop: hasActiveFilters ? 65 : 20,  // Aggiungi marginTop solo se ci sono filtri attivi
        },

        listcontainer: {
            flex: 1,
            backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff',
            paddingBottom: 80,
        },
        textContainer: {
            flex: 1, // Occupa tutto lo spazio disponibile
            marginRight: 10, // Aggiunge spazio tra il testo e l'immagine
        },
        listContent: {
            flexGrow: 1,
            marginHorizontal: 10,
            paddingHorizontal: 10,
        },
        eventCard: {
            backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#f9f9f9',
            padding: 20, // Ingrandito
            marginBottom: 10, // Spaziatura tra elementi aumentata
            borderRadius: 15,
            borderColor: colorScheme === 'dark' ? '#333' : '#ddd',
            borderWidth: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 85, // Fissa l'altezza della card
        },
        eventName: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colorScheme === 'dark' ? '#fff' : '#333',
        },
        eventDetails: {
            marginTop: 3,
            fontSize: 14,
            color: colorScheme === 'dark' ? '#bbb' : '#666',
        },
        eventImage: {
            width: 40, // Dimensione icona
            height: 40,
        },
        emptyText: {
            textAlign: 'center',
            color: colorScheme === 'dark' ? '#bbb' : '#666',
            marginTop: 20,
            fontSize: 16,
        },
    });

    let [showedEvents, setShowedEvents] = useState<Event[]>(allEvents
        .filter(event => event.city == searchFilters.city &&
            (searchFilters.date || new Date(event.date) > new Date(searchFilters.date as string)))
        .filter(event => (!filters.localLegend || event.local_legend_here) &&
            (filters.maxPeople == 1 || event.max_people <= filters.maxPeople) &&
            (!filters.eventType || event.type === filters.eventType) &&
            (!filters.location || event.place.toLowerCase() === filters.location.toLowerCase()))
    );

    const colorScheme = useColorScheme() || 'light';
    const currentListStyles = liststyles(colorScheme);

    useEffect(() => {
        const showed = allEvents.filter(event => {
            return (
                (
                    event.city == searchFilters.city &&
                    (searchFilters.date || new Date(event.date) > new Date(searchFilters.date as string))
                ) &&
                (
                    (
                        (!filters.localLegend || event.local_legend_here) &&
                        (filters.maxPeople == 1 || event.max_people <= filters.maxPeople) &&
                        (!filters.eventType || event.type === filters.eventType) &&
                        (!filters.location || event.place.toLowerCase() === filters.location.toLowerCase())
                    )
                ) &&
                (
                    !myEvents.includes(event.name)
                )
            );
        });
        setShowedEvents(showed);
    }, [filters, searchFilters, myEvents]);



    const renderListEvent = ({ item }: { item: Event }) => {
        return (
            <TouchableOpacity
                style={currentListStyles.eventCard}

                onPress={() => router.push(`/eventPageDetails?eventId=${item.name}`)}
            >
                <View style={currentListStyles.textContainer}>
                    <Text style={currentListStyles.eventName}>{item.name.toUpperCase()}</Text>
                    <Text style={currentListStyles.eventDetails}>{formatDateTime(new Date(item.date))} |  {item.city} - {item.location} </Text>
                </View>
                {item.local_legend_here && ( // Mostra l'immagine solo se local_legend_here è true
                    <Image source={require('@/assets/images/LL2.png')} style={currentListStyles.eventImage} />
                )}
            </TouchableOpacity>
        );
    };

    return (

        <View style={currentListStyles.listcontainer}>
            <FilterChips />
            <View style={currentListStyles.listMargin}>
                <FlatList
                    data={showedEvents}
                    renderItem={renderListEvent}
                    keyExtractor={(item, index) => index.toString()} // Usa un indice come chiave
                    contentContainerStyle={currentListStyles.listContent}
                    ListEmptyComponent={<Text style={currentListStyles.emptyText}>Nessun evento disponibile</Text>} // Caso lista vuota
                />
            </View>
        </View>
    );
}

