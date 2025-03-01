import { Link, Stack } from 'expo-router';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, useColorScheme, Alert, Linking, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useEffect, useState } from 'react';
import { Event } from '@/components/models/event';
import { useSearchParams } from 'expo-router/build/hooks';
import { useAppContext } from './_layout';
import { Icon } from 'react-native-elements';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { formatDateTime } from '@/hooks/dateFormat';


export default function EventDetailsScreen() {
  const searchParams = useSearchParams();
  const eventId: string = searchParams.get('eventId')!;
  const allEvents = useAppContext().allEvents;
  const user = useAppContext().user;
  const {myEvents, setMyEvents} = useAppContext();
  const [images, setImages] = useState<any[]>([]);
  const [event, setEvent] = useState<Event | null>(null);
  const db = useAppContext().db;
  const e: Event = allEvents.find((e) => e.name === eventId)!;
  console.log(myEvents);

  useEffect(() => {
    var i;
    if (e) {
      setEvent(e);
      console.log(`Loading images for event: ${e.name}`);
      switch (e.name) {
        case 'Polito Party':
          i = [
            require('@/assets/images/events/Polito Party/img1.jpg'),
            require('@/assets/images/events/Polito Party/img2.jpg'),
            require('@/assets/images/events/Polito Party/img3.jpg'),
          ];
          break;
        case 'Boat trip':
          i = [
            require('@/assets/images/events/Boat Trip/img1.jpg'),
            require('@/assets/images/events/Boat Trip/img2.jpg'),
            require('@/assets/images/events/Boat Trip/img3.jpg'),
          ];
          break;
        case 'Karaoke':
          i = [
            require('@/assets/images/events/Karaoke Night/img1.jpg'),
            require('@/assets/images/events/Karaoke Night/img2.jpg'),
            require('@/assets/images/events/Karaoke Night/img3.jpg'),
          ];
          break;
        case 'Art Exhibition':
          i = [
            require('@/assets/images/events/Art Exhibition/img1.jpg'),
            require('@/assets/images/events/Art Exhibition/img2.jpg'),
            require('@/assets/images/events/Art Exhibition/img3.jpg'),
          ];
          break;
        case 'Art Show':
          i = [
            require('@/assets/images/events/Art Show/img1.jpg'),
            require('@/assets/images/events/Art Show/img2.jpg'),
            require('@/assets/images/events/Art Show/img3.jpg'),
          ];
          break;
        case 'Bari Food Festival':
          i = [
            require('@/assets/images/events/Bari Food Festival/img1.jpg'),
            require('@/assets/images/events/Bari Food Festival/img2.jpg'),
            require('@/assets/images/events/Bari Food Festival/img3.jpg'),
          ];
          break;
        case 'Bari Jazz Festival':
          i = [
            require('@/assets/images/events/Bari Jazz Festival/img1.jpg'),
            require('@/assets/images/events/Bari Jazz Festival/img2.jpg'),
            require('@/assets/images/events/Bari Jazz Festival/img3.jpg'),
          ];
          break;
        case 'Bari Marathon':
          i = [
            require('@/assets/images/events/Bari Marathon/img1.jpg'),
            require('@/assets/images/events/Bari Marathon/img2.jpg'),
            require('@/assets/images/events/Bari Marathon/img3.jpg'),
          ];
          break;
        case 'Beach Party':
          i = [
            require('@/assets/images/events/Beach Party/img1.jpg'),
            require('@/assets/images/events/Beach Party/img2.jpg'),
            require('@/assets/images/events/Beach Party/img3.jpg'),
          ];
          break;
        case 'Boat Trip':
          i = [
            require('@/assets/images/events/Boat Trip/img1.jpg'),
            require('@/assets/images/events/Boat Trip/img2.jpg'),
            require('@/assets/images/events/Boat Trip/img3.jpg'),
          ];
          break;
        case 'Charity Run':
          i = [
            require('@/assets/images/events/Charity Run/img1.jpg'),
            require('@/assets/images/events/Charity Run/img2.jpg'),
            require('@/assets/images/events/Charity Run/img3.jpg'),
          ];
          break;
        case 'Craft Workshop':
          i = [
            require('@/assets/images/events/Craft Workshop/img1.jpg'),
            require('@/assets/images/events/Craft Workshop/img2.jpg'),
            require('@/assets/images/events/Craft Workshop/img3.jpg'),
          ];
          break;
        case 'Film Screening':
          i = [
            require('@/assets/images/events/Film Screening/img1.jpg'),
            require('@/assets/images/events/Film Screening/img2.jpg'),
            require('@/assets/images/events/Film Screening/img3.jpg'),
          ];
          break;
        case 'Jazz Night':
          i = [
            require('@/assets/images/events/Jazz Night/img1.jpg'),
            require('@/assets/images/events/Jazz Night/img2.jpg'),
            require('@/assets/images/events/Jazz Night/img3.jpg'),
          ];
          break;
        case 'Karaoke Night':
          i = [
            require('@/assets/images/events/Karaoke Night/img1.jpg'),
            require('@/assets/images/events/Karaoke Night/img2.jpg'),
            require('@/assets/images/events/Karaoke Night/img3.jpg'),
          ];
          break;
        case 'Meditation Day':
          i = [
            require('@/assets/images/events/Meditation Retreat/img1.jpg'),
            require('@/assets/images/events/Meditation Retreat/img2.jpg'),
            require('@/assets/images/events/Meditation Retreat/img3.jpg'),
          ];
          break;
        case 'Outdoor Yoga':
          i = [
            require('@/assets/images/events/Outdoor Yoga/img1.jpg'),
            require('@/assets/images/events/Outdoor Yoga/img2.jpg'),
            require('@/assets/images/events/Outdoor Yoga/img3.jpg'),
          ];
          break;
        case 'Photo Workshop': 
          i = [
            require('@/assets/images/events/Photo Workshop/img1.jpg'),
            require('@/assets/images/events/Photo Workshop/img2.jpg'),
            require('@/assets/images/events/Photo Workshop/img3.jpg'),
          ];
          break;
        case 'Rock Concert':
          i = [
            require('@/assets/images/events/Rock Concert/img1.jpg'),
            require('@/assets/images/events/Rock Concert/img2.jpg'),
            require('@/assets/images/events/Rock Concert/img3.jpg'),
          ];
          break;
        case 'Tech Talk':
          i = [
            require('@/assets/images/events/Tech Talk/img1.jpg'),
            require('@/assets/images/events/Tech Talk/img2.jpg'),
            require('@/assets/images/events/Tech Talk/img3.jpg'),
          ];
          break;
        case 'Theater Play':
          i = [
            require('@/assets/images/events/Theater Play/img1.jpg'),
            require('@/assets/images/events/Theater Play/img2.jpg'),
            require('@/assets/images/events/Theater Play/img3.jpg'),
          ];
          break;
        case 'Wine Tasting':
          i = [
            require('@/assets/images/events/Wine Tasting/img1.jpg'),
            require('@/assets/images/events/Wine Tasting/img2.jpg'),
            require('@/assets/images/events/Wine Tasting/img3.jpg'),
          ];
          break;
        default:
          i = [
            require('@/assets/images/events/Polito Party/img1.jpg'),
            require('@/assets/images/events/Polito Party/img2.jpg'),
            require('@/assets/images/events/Polito Party/img3.jpg'),
          ];
          console.log('Event not found');
      }
      setImages(i);
    }
  }, [e]);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const colors = {
    background: isDarkMode ? '#1C1C1C' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    cardBackground: isDarkMode ? '#2E2E2E' : '#ffffff',
    buttonBackground: isDarkMode ? '#2E2E2E' : '#E0E0E0',
    buttonText: isDarkMode ? '#FFFFFF' : '#000000',
  }


  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex < images.length - 1 ? prevIndex + 1 : 0));
  };

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : images.length - 1));
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    joinText: {
      fontSize: 18,
    },
    eventName: {
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    card: {
      flex: 1,
      backgroundColor: colors.cardBackground,
      borderRadius: 8,
      marginTop: 8,
      marginBottom: 8,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: colors.text,
    },
    cardContent: {
      fontSize: 15,
      color: colors.text,
      lineHeight: 25,
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
      color: colors.text
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
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    columnContainer: {
      flex: 1.5,
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    mapsIcon: {
      width: 35,
      height: 50,
      //marginBottom: 10,
    },
    dotContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 15,
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginHorizontal: 5,
    },
    dotActive: {
      backgroundColor: '#FFFFFF',
    },
    dotInactive: {
      backgroundColor: '#A9A9A9',
    },
  });

  const handleJoinLeaveEvent = () => {
    if (!user) return;
  
    if (myEvents.includes(eventId)) {
      // Alert per confermare l'abbandono dell'evento
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
                  [user.username, eventId]
                );
                console.log('Event left successfully');
                // Aggiorna lo stato locale
                setMyEvents(myEvents.filter(e => e !== eventId));
              } catch (error) {
                console.error('Error leaving event:', error);
              }
            },
          },
        ]
      );
    } else {
      // Alert per confermare l'adesione all'evento
      Alert.alert(
        'Event Status',
        'Are you sure you want to join the event?',
        [
          { text: 'Cancel' },
          {
            text: 'Yes',
            onPress: async () => {
              try {
                await db.runAsync(
                  'INSERT INTO users_events (user, event) VALUES (?, ?)',
                  [user.username, eventId]
                );
                console.log('Event joined successfully');
                // Aggiorna lo stato local
                setMyEvents([...myEvents, eventId]);
              } catch (error) {
                console.error('Error joining event:', error);
              }
            },
          },
        ]
      );
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: eventId,
          headerTitleStyle: {
            fontSize: 20,  // Aumenta la dimensione del font
          },
          headerBackTitle: 'Back',
        }} />
      {event === null ? (
        <ThemedView style={styles.container}>
          <ThemedText type="subtitle">Loading...</ThemedText>
        </ThemedView>
      ) : (
        <ScrollView style={styles.container}>
          <View style={styles.rowContainer}>
            {/*Info sull'evento */}
            <View style={[styles.card, { padding: 15, flex: 3, marginRight: 8 }]}>
              <Text style={styles.cardTitle}>Info</Text>
              <View style={styles.infoRow}>
                {event.local_legend_here && (
                  <View style={styles.row}>
                    <IconSymbol name="star" size={20} color={colors.text} />
                    <Text style={styles.rowText}>Local legend here</Text>
                  </View>
                )}
                <View style={styles.row}>
                  <IconSymbol name="clock" size={20} color={colors.text} />
                  <Text style={styles.rowText}>{formatDateTime(new Date(event.date))}</Text>
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
            <View style={styles.columnContainer}>

              {/* Status Card */}
              <TouchableOpacity onPress={handleJoinLeaveEvent}>
                <View style={[styles.card, { padding: 18, marginLeft: 8 }]}>
                    <View style={{ alignItems: 'center' }}>
                    {Platform.OS === 'ios' ? (
                      <IconSymbol name={myEvents.includes(eventId) ? 'person.badge.minus' : 'person.badge.plus'}
                      size={65}
                      color={myEvents.includes(eventId) ? 'red' : '#007AFF'}
                      />
                    ) : (
                      <Icon name={myEvents.includes(eventId) ? 'user-minus' : 'user-plus'}
                      type="font-awesome-5"
                      size={65}
                      color={myEvents.includes(eventId) ? 'red' : '#007AFF'}
                      />
                    )}
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: myEvents.includes(eventId) ? 'red' : '#007AFF' }}>
                      {myEvents.includes(eventId) ? 'Leave' : 'Join'}
                    </Text>
                    </View>
                </View>
              </TouchableOpacity>

              {/* Maps Card */}
              <TouchableOpacity onPress={() => Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${event.latitude},${event.longitude}`)}>
              <View style={[styles.card, { alignContent:'center', alignItems:'center', justifyContent:'space-between', padding: 15, marginLeft: 8 }]}>
                
                  <Image
                    source={require('@/assets/images/maps2.png')}
                    style={styles.mapsIcon}
                  />
                  <Text style={{ textAlign:'center', fontSize: 15, color: colors.text }}> Google Maps</Text>              
              </View>
              </TouchableOpacity>
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
              {/* Aggiungi i pallini sovrapposti */}
              <View style={styles.dotContainer}>
                {images.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      currentImageIndex === index ? styles.dotActive : styles.dotInactive,
                    ]}
                  />
                ))}
              </View>
            </View>
          </View>


          {/* Descrizione dell'evento */}
          <View style={[styles.card, { padding: 15 }]}>
            <Text style={styles.cardTitle}>Description</Text>
            <Text style={styles.cardContent}>
              {event.description}
            </Text>
          </View>
        </ScrollView>

      )}

    </>
  );
}
