import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import { Audio } from 'expo-av';
import { Image } from 'react-native';
import { useNavigation } from 'expo-router';

export default function App() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const i = require('../assets/images/meowmeow.png');
  const navigation = useNavigation();

  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/music/meowmusic.mp3')
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }

  useEffect(() => {
    navigation.setOptions({ title: 'Discounts', headerBackTitle: 'Back', });

  }, [navigation]);

  useEffect(() => {
    return sound
      ? () => {
        console.log('Unloading Sound');
        sound.unloadAsync();
      }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.container}>
      <Text style={styles.message}>
      We have no promotions at the moment. Soon, we will have agreements with the best local spots in each city. Stay tuned!
      </Text>
      <Image source={i} style={styles.image} />
      <View style={styles.buttonContainer}>
        <Button title="Play Sound" onPress={playSound} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: 40,
  },
  message: {
    fontSize: 16,
    width: 350,
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    color: '#555',
  },
  image: {
    width: 350, // Aumenta la larghezza dell'immagine
    height: 350, // Aumenta l'altezza dell'immagine
    resizeMode: 'contain', // Mantiene le proporzioni dell'immagine
    
  },
  buttonContainer: {
    marginBottom: 20,
    width: 150,
  },
});
