import { Link, Stack } from 'expo-router';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, useColorScheme } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState } from 'react';
import { Event } from '@/components/models/event';
import { useSearchParams } from 'expo-router/build/hooks';
import { useAppContext } from './_layout';
import { Button } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';


export default function EventDetailsScreen() {
  const searchParams = useSearchParams();
  const eventId: string = searchParams.get('eventId')!;
  const allEvents = useAppContext().allEvents;
  const user = useAppContext().user;
  const myEvents = useAppContext().myEvents;
  const [event, setEvent] = React.useState<Event | null>(null);
  const e: Event = allEvents.find((e) => e.name === eventId)!;
  React.useEffect(() => {
    if (e) {
      setEvent(e);  //event. -> tutte le cose dell'evento
      console.log(e);
    }
  }, [e]);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const colors = {
    background: isDarkMode ? '#1C1C1C' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    overlay: 'rgba(0, 0, 0, 0.5)',
    buttonBackground: isDarkMode ? '#2E2E2E' : '#E0E0E0',
    rowText: isDarkMode ? '#CCCCCC' : '#555555',
  };

  const images = [
    require('@/assets/images/event1/event1_1.jpg'),
    require('@/assets/images/event1/event1_2.webp'),
    require('@/assets/images/event1/event1_3.jpg'),
  ];

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex < images.length - 1 ? prevIndex + 1 : 0));
  };

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : images.length - 1));
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: eventId,
          headerBackTitle: 'Back',
          headerRight: () => (
            <Text style={styles.joinText}>
              {myEvents.includes(eventId) ? 'Leave' : 'Join'}
            </Text>
          ),
        }} />
      {event === null ? (
        <ThemedView style={styles.container}>
          <ThemedText type="subtitle">Loading...</ThemedText>
        </ThemedView>
      ) : (
        <ScrollView style={styles.container}>
          {/*Info sull'evento */}
          <View style={[styles.card, { padding: 15 }]}>
            <Text style={styles.cardTitle}>Info</Text>
            <View style={styles.infoRow}>
              {event.local_legend_here && (
                <View style={styles.row}>
                  <IconSymbol name="star" size={20} color={colors.text} />
                  <Text style={styles.rowText}>There is a local legend here</Text>
                </View>
              )}
              <View style={styles.row}>
                <IconSymbol name="clock" size={20} color={colors.text} />
                <Text style={styles.rowText}>Today - {event.hour}</Text>
              </View>
              <View style={styles.row}>
                <IconSymbol name="location" size={20} color={colors.text} />
                <Text style={styles.rowText}>
                  {event.city} - {event.location}
                </Text>
              </View>
              <View style={styles.row}>
                <IconSymbol name="person.2" size={20} color={colors.text} />
                <Text style={styles.rowText}>{event.max_people}</Text>
              </View>
              <View style={styles.row}>
                <IconSymbol name="figure.run" size={20} color={colors.text} />
                <Text style={styles.rowText}>{event.type}</Text>
              </View>
              <View style={styles.row}>
                <IconSymbol name={event.place === "Outside" ? "sun.min" : "house.lodge"} size={20} color={colors.text} />
                <Text style={styles.rowText}>{event.place}</Text>
              </View>
            </View>
          </View>

          {/*Carosello immagini */}
          <View style={styles.card}>

            <View style={styles.imageCarousel}>
              <Image source={images[currentImageIndex]} style={styles.image} />
              <TouchableOpacity
                style={[styles.navButton, { left: 10 }]}
                onPress={handlePrev}
              >
                <IconSymbol name="chevron.backward" size={24} color={'white'} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.navButton, { right: 10 }]}
                onPress={handleNext}
              >
                <IconSymbol name="chevron.forward" size={24} color={'white'} />
              </TouchableOpacity>
            </View>
          </View>


          {/* Descrizione dell'evento */}
          <View style={[styles.card, { padding: 15 }]}>
            <Text style={styles.cardTitle}>Desription</Text>
            <Text style={styles.cardContent}>
              Questa descrizione è solo un esempio. Deve esssere inserita una descrizione nel database.
              Descrizione esempio, descrizione esempio, esempio, esempio. Esempio ewufwehbfeuhfbwejhbfhweefj
            </Text>
          </View>
        </ScrollView>

      )}

    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,

  },
  joinText: {
    color: 'blue', // Puoi personalizzare il colore
    fontWeight: 'bold', // Font-weight
    fontSize: 16, // Font-size
    marginRight: 10, // Spaziatura a destra
  },
  eventName: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardContent: {
    fontSize: 15,
    color: '#555',
    lineHeight: 20,
  },
  infoRow: {
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rowText: {
    fontSize: 15,
    marginLeft: 10,
  },
  imageCarousel: {
    position: 'relative',
    alignItems: 'center',
    height: 250,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  navButton: {
    position: 'absolute',
    top: '50%',

    borderRadius: 20,
    zIndex: 1,
  },
  navText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
