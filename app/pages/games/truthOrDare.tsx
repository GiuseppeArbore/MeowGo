import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated } from 'react-native';
import { useNavigation } from 'expo-router';
import { useAppContext } from '../../_layout';
import { Circle, Svg } from 'react-native-svg';
import { useLocalSearchParams } from 'expo-router';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const TruthOrDare: React.FC = () => {
  const navigation = useNavigation();
  const { db } = useAppContext();
  const params = useLocalSearchParams();
  const nGamers= Number(params.max_people);
  const [gameData, setGameData] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const progress = useState(new Animated.Value(0))[0];


  useEffect(() => {
    navigation.setOptions({ title: 'Never Have I Ever', headerBackTitle: 'Back' });
    const fetchQuestions = async () => {
      try {
        const questions = await db.getAllAsync<{ question: string }>(
          `SELECT question FROM truth_or_dare ORDER BY RANDOM() LIMIT ${nGamers};`
        );
        setGameData(questions.map((q) => q.question));
      } catch (error) {
        console.error('Error fetching questions:', error);
        Alert.alert('Errore', 'Impossibile caricare le domande.');
      }
    };

    fetchQuestions();
  }, [navigation, db]);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: (currentQuestionIndex + 1) / nGamers,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [currentQuestionIndex]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < gameData.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      Alert.alert('End of the game', 'You have completed all the statement! You can start a new game or close the app and enjoy the event!');
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
        <Text style={styles.turnText}>{currentQuestionIndex + 1}/{nGamers}</Text>
      </View>

      <View style={styles.wordContainer}>
        <Text style={styles.word}>
          {gameData.length > 0 ? gameData[currentQuestionIndex] : 'Caricamento...'}
        </Text>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNextQuestion}>
        <Text style={styles.nextButtonText}>
          {currentQuestionIndex + 1 < gameData.length ? 'Next' : 'End'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#005f99',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  wordContainer: {
    marginBottom: 50,
    marginHorizontal: 40
  },
  word: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  progressContainer: {
    position: 'absolute',
    top: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  turnText: {
    position: 'absolute',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  nextButton: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#005f99',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default TruthOrDare;
