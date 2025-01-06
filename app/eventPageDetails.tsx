import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { Event } from '@/components/models/event';
import { useSearchParams } from 'expo-router/build/hooks';
import { useAppContext } from './_layout';
import { Button } from 'react-native';


export default function EventDetailsScreen() {
  const searchParams = useSearchParams();
  const eventId : string = searchParams.get('eventId')!;
  const allEvents = useAppContext().allEvents;
  const [event, setEvent] = React.useState<Event | null>(null);
  const e: Event = allEvents.find((e) => e.name === eventId)!;
  React.useEffect(() => {
    if (e) {
      setEvent(e);  //event. -> tutte le cose dell'evento
      console.log(e);
    }
  }, [e]);

  return (
    <>
      <Stack.Screen options={{ title: 'Event page: '.concat(eventId) }} />
      {event === null ? (
        <ThemedView style={styles.container}>
          <ThemedText type="subtitle">Loading...</ThemedText>
        </ThemedView>
      ) : (
        <ThemedView style={styles.container}>
          <ThemedText type="subtitle">This screen exists.</ThemedText>
          <ThemedText type="title">Event ID: {e.name}</ThemedText>
          <Link href="/" style={styles.link}>
            <ThemedText type="link">Go to home screen!</ThemedText>
          </Link>
        </ThemedView>
      )}

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
