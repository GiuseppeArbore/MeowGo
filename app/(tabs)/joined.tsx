import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, useColorScheme, Image, Alert } from 'react-native';
import { useAppContext } from '../_layout'; // Percorso al file RootLayout
import { Event } from '@/components/models/event';
import { router } from 'expo-router';
import { formatDateTime } from '@/hooks/dateFormat';
import { IconSymbol } from '@/components/ui/IconSymbol';

const liststyles = (colorScheme: string) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff',
        paddingTop: 45,
        paddingBottom: 80,
    },
    divider: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 5,
    },
    groupContainer: {
        marginBottom: 20,
    },
    groupHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colorScheme === 'dark' ? '#fff' : '#333',
        marginTop: 20,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    eventTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    listContent: {
        flexGrow: 1,
        marginHorizontal: 10,
        paddingHorizontal: 10,
    },
    eventCard: {
        backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#f9f9f9',
        padding: 20, // Ingrandito
        marginVertical: 5, // Spaziatura tra elementi aumentata
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
        width: 20, // Dimensione icona
        height: 20,
        resizeMode: 'contain',
        marginLeft: 5,
    },
    emptyText: {
        color: colorScheme === 'dark' ? '#bbb' : '#666',
        fontSize: 16,

    },
    iceBreakerButton: {
        backgroundColor: '#007AFF', // Blu iOS style
        paddingVertical: 8,
        paddingHorizontal: 15,
        height: 40,
        width: 130,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    leaveButton: {
        backgroundColor: '#FF3B30', // Rosso per Leave
        paddingVertical: 8,
        paddingHorizontal: 15,
        height: 40,
        width: 130,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    exploreButton: {
        backgroundColor: '#007AFF', // Blu iOS style
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 10,
    },
});

export default function HomeScreen() {
    const { db, allEvents, myEvents, setMyEvents } = useAppContext(); // Ottieni la lista di eventi dal context
    const user = useAppContext().user; // Ottieni l'utente dal context
    const colorScheme = useColorScheme() || 'light';
    const currentListStyles = liststyles(colorScheme);

    //Filtra gli eventi per visualizzare solo quelli in myEvents
    const joinedEvents = allEvents.filter((event: Event) =>
        myEvents.includes(event.name) // Confronta con il nome dell'evento
    );

    // Raggruppa gli eventi in base alla data
    const groupedEvents = joinedEvents.reduce((groups: any, event: Event) => {
        const today = new Date(); // Data di oggi
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1); // Aggiunge 1 giorno per ottenere "domani"

        let groupName = "Next days";

        if (new Date(event.date) === today
            || new Date(event.date) <= new Date() && new Date(event.ended) >= new Date()
        ) {
            groupName = "Today";
        } else if (new Date(event.date) === tomorrow) {
            groupName = "Tomorrow";
        }

        if (!groups[groupName]) {
            groups[groupName] = [];
        }
        groups[groupName].push(event);
        return groups;
    }, {});

    const handleLeaveEvent = (eventName: string) => {
        Alert.alert(
            'Event Status',
            'Are you sure you want to leave the event?',
            [
                { text: 'Cancel' },
                {
                    text: 'Yes',
                    onPress: async () => {
                        try {
                            await db.runAsync(
                                'DELETE FROM users_events WHERE user = ? AND event = ?',
                                [user?.username ?? '', eventName]
                            );
                            console.log('Event left successfully');
                            // Aggiorna lo stato locale
                            setMyEvents(myEvents.filter(e => e !== eventName));
                        } catch (error) {
                            console.error('Error leaving event:', error);
                        }
                    },
                },
            ]
        );
    }


    // Funzione per renderizzare ogni evento nella FlatList
    const renderEvent = ({ item }: { item: Event }) => {
        let nrPeople = 0;
        db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM users_events WHERE event = ?', [item.name])
            .then(result => {
                if (result) {
                    nrPeople = result.count;
                }
            })
            .catch(error => {
                console.error('Error fetching number of people:', error);
            });
        return (
            <TouchableOpacity
                style={currentListStyles.eventCard}
                onPress={() => router.push(`/eventPageDetails?eventId=${item.name}`)}
            >
                <View>
                    <View style={currentListStyles.eventTitleContainer}>
                        <Text style={currentListStyles.eventName}>{item.name.toUpperCase()}</Text>
                        {item.local_legend_here && ( // Mostra l'immagine solo se local_legend_here è true
                            <Image source={require('@/assets/images/LL2.png')} style={currentListStyles.eventImage} />
                        )}
                    </View>
                    <Text style={currentListStyles.eventDetails}>{formatDateTime(
                        new Date(item.date) <= new Date() && new Date(item.ended) >= new Date()
                            ? new Date() // Se è in corso -> data di oggi
                            : new Date(item.date) // Altrimenti -> data originale
                    )}</Text>
                </View>

                <TouchableOpacity
                    style={(new Date(item.date) == new Date()
                        || new Date(item.date) <= new Date() && new Date(item.ended) >= new Date()
                    ) ? currentListStyles.iceBreakerButton : currentListStyles.leaveButton}
                    onPress={() => {
                        if (new Date(item.date) == new Date()
                            || new Date(item.date) <= new Date() && new Date(item.ended) >= new Date()
                        ) {
                            router.push({ pathname: '../pages/gamelist', params: { max_people: nrPeople } });
                        } else {
                            console.log("Leaving event:", item.name);
                            handleLeaveEvent(item.name);
                        }
                    }}
                >
                    <Text style={currentListStyles.buttonText}>
                        {(new Date(item.date) == new Date()
                            || new Date(item.date) <= new Date() && new Date(item.ended) >= new Date()
                        ) ? "ICE-BREAKER" : "LEAVE"}
                    </Text>
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <View style={currentListStyles.container}>
            <FlatList
                data={["Today", "Tomorrow", "Next days"].filter(group => groupedEvents[group])}
                contentContainerStyle={currentListStyles.listContent}
                keyExtractor={(groupName) => groupName}
                renderItem={({ item: groupName }) => (
                    <View style={currentListStyles.groupContainer}>
                        {/* Intestazione del gruppo */}
                        <Text style={currentListStyles.groupHeader}>{groupName}</Text>
                        <View style={currentListStyles.divider} />
                        <FlatList
                            data={groupedEvents[groupName]}
                            renderItem={renderEvent}
                            keyExtractor={(event, index) => index.toString()}
                        />
                    </View>
                )}
                ListEmptyComponent={
                    <View style={currentListStyles.emptyContainer}>
                        <TouchableOpacity

                            onPress={() => router.push('/')} // Naviga alla pagina di creazione evento
                        >
                            <IconSymbol name="calendar.badge.plus" size={100} color={colorScheme === 'dark' ? 'white' : 'black'} />
                        </TouchableOpacity>
                        <Text style={currentListStyles.emptyText}>No events joined yet.</Text>
                        <Text style={currentListStyles.emptyText}>Add new events to your plans.</Text>
                    </View>
                }
            />
        </View>
    );
}