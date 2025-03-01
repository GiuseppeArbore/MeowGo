import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated } from 'react-native';
import { useNavigation } from 'expo-router';
import { useAppContext } from '../../_layout';
import { Circle, Svg } from 'react-native-svg';
import { useLocalSearchParams } from 'expo-router';


const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const HeadsUp: React.FC = () => {
  const navigation = useNavigation();
  const { db } = useAppContext();
  const params = useLocalSearchParams();
  const nGamers = Number(params.max_people);
  const [gameData, setGameData] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const progress = useState(new Animated.Value(0))[0];

  useEffect(() => {
    
    navigation.setOptions({ title: 'Heads Up', headerBackTitle: 'Back' });

    const fetchWords = async () => {
      try {
        const words = await db.getAllAsync<{ word: string }>(
          `SELECT word FROM heads_up ORDER BY RANDOM() LIMIT ${nGamers};`
        );
        setGameData(words.map((w) => w.word));
      } catch (error) {
        console.error('Error fetching words:', error);
        Alert.alert('Errore', 'Impossibile caricare le parole.');
      }
    };

    fetchWords();
  }, [navigation, db]);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: (currentWordIndex + 1) / nGamers,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [currentWordIndex]);

  const handleNextWord = () => {
    if (currentWordIndex + 1 < gameData.length) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      Alert.alert('End of the game', 'You have completed all the words! You can start a new game or close the app and enjoy the event!');
      navigation.goBack();
    }
  };

  const radius = 25;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View style={styles.container}>
      {/* Barra di progresso in alto a sinistra */}
      <View style={styles.progressContainer}>
        <Svg width={60} height={60} viewBox="0 0 60 60">
          <Circle cx="30" cy="30" r={radius} stroke="white" strokeWidth="5" fill="none" opacity={0.3} />
          <AnimatedCircle
            cx="30"
            cy="30"
            r={radius}
            stroke="white"
            strokeWidth="5"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 30 30)"
          />
        </Svg>
        <Text style={styles.turnText}>{currentWordIndex + 1}/{nGamers}</Text>
      </View>

      {/* Testo ruotato (molto grande) */}
      <View style={styles.wordContainer}>
        <Text style={styles.word}>
          {gameData.length > 0 ? gameData[currentWordIndex] : 'Caricamento...'}
        </Text>
      </View>

      {/* Contenitore per il pulsante Next */}
      <View style={styles.buttonContainer}>
        {/* Pulsante Next in basso a sinistra */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNextWord}>
          <Text style={styles.nextButtonText}>
            {currentWordIndex + 1 < gameData.length ? 'Next' : 'End'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#005f99',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordContainer: {
    transform: [{ rotate: '90deg' }],
    flex: 1,
    justifyContent: 'center',
  },
  word: {
    fontSize: 85,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  progressContainer: {
    position: 'absolute',
    left: 20,
    top: 20,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '90deg' }],
  },
  turnText: {
    position: 'absolute',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    position: 'absolute',
    left: 0,
    bottom: 55,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    transform: [{ rotate: '90deg' }],
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#005f99',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default HeadsUp;
