import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, useColorScheme, Alert, FlatList, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Linking } from 'react-native';
import { Link, router } from 'expo-router';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { DATABASE_NAME } from '../utils/database';
import { Event } from  '../components/models/event';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useAppContext } from '@/app/_layout';



const liststyles  = (colorScheme: string) => StyleSheet.create({

    listcontainer: {
        flex: 1,
        backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff',
    },
    textContainer: {
        flex: 1, // Occupa tutto lo spazio disponibile
        marginRight: 10, // Aggiunge spazio tra il testo e l'immagine
    },
    listContent: {
        paddingVertical: 10,
        marginHorizontal: 10,
        paddingHorizontal: 10,
    },
    eventCard: {
        backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#f9f9f9',
        padding: 20, // Ingrandito
        marginVertical: 10, // Spaziatura tra elementi aumentata
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
        resizeMode: 'contain',
    },
    emptyText: {
        textAlign: 'center',
        color: colorScheme === 'dark' ? '#bbb' : '#666',
        marginTop: 20,
        fontSize: 16,
    },
});



export function EventList() {
    const { allEvents } = useAppContext(); // Accediamo ai dati dal contesto
    const colorScheme = useColorScheme() || 'light';
    const currentListStyles = liststyles(colorScheme);

    const renderListEvent = ({ item }: { item: Event }) => {
            console.log(`[RenderEvent] Rendering evento: ${item.name}`);
            return (
                <TouchableOpacity
                    style={currentListStyles.eventCard}

                    onPress={() => router.push(`/eventPageDetails?eventId=${item.name}`)}
                >
                    <View style={currentListStyles.textContainer}>
                        <Text style={currentListStyles.eventName}>{item.name.toUpperCase()}</Text>
                        <Text style={currentListStyles.eventDetails}>Today {item.hour}  |  {item.city} - {item.location} </Text>
                    </View>
                    {item.local_legend_here && ( // Mostra l'immagine solo se local_legend_here è true
                        <Image source={require('@/assets/images/LL.png')} style={currentListStyles.eventImage} />
                    )}
                </TouchableOpacity>
            );
        };

    return ( 
    
    <View style={currentListStyles.listcontainer}>
        <FlatList
            data={allEvents}
            renderItem={renderListEvent}
            keyExtractor={(item, index) => index.toString()} // Usa un indice come chiave
            contentContainerStyle={currentListStyles.listContent}
            ListEmptyComponent={<Text style={currentListStyles.emptyText}>Nessun evento disponibile</Text>} // Caso lista vuota
        />
    </View>
    );
}

