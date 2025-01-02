import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, useColorScheme, Image } from 'react-native';
import { useAppContext } from '../_layout'; // Percorso al file RootLayout
import { Event } from '@/components/models/event';

export default function HomeScreen() {
    const { allEvents } = useAppContext(); // Ottieni la lista di eventi dal context
    const colorScheme = useColorScheme(); // Rileva se è light o dark mode
    const styles = colorScheme === 'dark' ? darkStyles : lightStyles; // Cambia gli stili dinamicamente

    console.log('[HomeScreen] Eventi disponibili:', allEvents);

    // Funzione per renderizzare ogni evento nella FlatList
    const renderEvent = ({ item }: { item: Event }) => {
        console.log(`[RenderEvent] Rendering evento: ${item.name}`);
        return (
            <TouchableOpacity
                style={styles.eventCard}
                onPress={() => console.log(`[RenderEvent] Hai cliccato su: ${item.city}`)}
            >
                <View>
                    <Text style={styles.eventName}>{item.name.toUpperCase()}</Text>
                    <Text style={styles.eventDetails}>Today {item.hour}  |  {item.city}</Text>
                </View>
                {item.local_legend_here && ( // Mostra l'immagine solo se local_legend_here è true
                    <Image source={require('@/assets/images/LL.png')} style={styles.eventImage} />
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={allEvents}
                renderItem={renderEvent}
                keyExtractor={(item, index) => index.toString()} // Usa un indice come chiave
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={<Text style={styles.emptyText}>Nessun evento disponibile</Text>} // Caso lista vuota
            />
        </View>
    );
}

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingTop: 50,
    },
    listContent: {
        paddingVertical: 10,
    },
    eventCard: {
        backgroundColor: '#f9f9f9',
        padding: 20, // Ingrandito
        marginVertical: 5, // Spaziatura tra elementi aumentata
        borderRadius: 15,
        borderColor: '#ddd',
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 85, // Fissa l'altezza della card
    },
    eventName: {
        fontSize: 18, 
        fontWeight: 'bold',
        color: '#333',
    },
    eventDetails: {
        marginTop: 3,
        fontSize: 14,
        color: '#666',
    },
    eventImage: {
        width: 80, // Dimensione icona
        height: 70,
        resizeMode: 'contain',
      
    },
    emptyText: {
        textAlign: 'center',
        color: '#666',
        marginTop: 20,
        fontSize: 16,
    },
});

// Stili per Modalità Dark
const darkStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        paddingHorizontal: 10,
        paddingTop: 50,
    },
    listContent: {
        paddingVertical: 10,
    },
    eventCard: {
        backgroundColor: '#1E1E1E',
        padding: 20, // Ingrandito
        marginVertical: 5, // Spaziatura tra elementi aumentata
        borderRadius: 15,
        borderColor: '#333',
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 85, 
    },
    eventName: {
        fontSize: 18, // Ingrandito
        fontWeight: 'bold',
        color: '#fff',
    },
    eventDetails: {
        fontSize: 14,
        color: '#bbb',
        marginTop: 3,
    },
    eventImage: {
        width: 80, // Dimensione icona
        height: 70,
        resizeMode: 'contain',
    },
    emptyText: {
        textAlign: 'center',
        color: '#bbb',
        marginTop: 20,
        fontSize: 16,
    },
});
