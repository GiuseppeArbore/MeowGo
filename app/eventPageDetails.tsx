import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { useSearchParams } from 'expo-router/build/hooks';
import { useAppContext } from './_layout';

export default function EventDetailsScreen() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');
  const allEvents = useAppContext().allEvents;
  const event = allEvents.find((e) => e.name === eventId);  //event. -> tutte le cose dell'evento

  return (
    <>
      <Stack.Screen options={{ title: 'Event page: '.concat(event!.name) }} />
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle">This screen exists.</ThemedText>
        <ThemedText type="title">Event ID: {eventId}</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type="link">Go to home screen!</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
