import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme, Alert } from 'react-native';
import { useAppContext } from '../_layout';
import { useRouter } from 'expo-router';
import { User } from '@/components/models/user';

const cities = ['Bari', 'Turin']; // Elenco delle città disponibili
const quizData: Record<string, { question: string; options: string[]; correctAnswer: string }[]> = {
  Bari: [
    {
      question: 'What is Bari famous for?',
      options: ['Seafood', 'Mountains', 'Deserts', 'Forests'],
      correctAnswer: 'Seafood',
    },
    {
      question: 'What sea is Bari located near?',
      options: ['Mediterranean', 'Adriatic', 'Baltic', 'Black'],
      correctAnswer: 'Adriatic',
    },
    {
      question: 'What is the historic center of Bari called?',
      options: ['Bari Vecchia', 'Bari Moderna', 'Bari Antica', 'Bari Nuova'],
      correctAnswer: 'Bari Vecchia',
    },
  ],
  Turin: [
    {
      question: 'What is Turin famous for?',
      options: ['Chocolate', 'Beaches', 'Volcanoes', 'Lakes'],
      correctAnswer: 'Chocolate',
    },
    {
      question: 'Which river flows through Turin?',
      options: ['Tiber', 'Po', 'Adige', 'Arno'],
      correctAnswer: 'Po',
    },
    {
      question: 'What is a popular dish in Turin?',
      options: ['Bagna Cauda', 'Risotto', 'Pizza', 'Gelato'],
      correctAnswer: 'Bagna Cauda',
    },
  ],
};

const QuizSelectionScreen: React.FC = () => {
  const { user, db, setUser } = useAppContext();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const styles = createStyles(isDarkMode);
  const router = useRouter();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvailableCities = async () => {
      if (db && user) {
        const results = await db.getAllAsync(
          'SELECT city FROM users_ll_for WHERE username = ?',
          [user.username]
        );
        const localLegendCities = results.map((result: any) => result.city);
        const filteredCities = cities.filter((city) => !localLegendCities.includes(city));
        setAvailableCities(filteredCities);
      }
    };

    fetchAvailableCities();
  }, [db, user]);

 const handleAnswerSelection = (selectedAnswer: string) => {
  setSelectedAnswer(selectedAnswer); // Memorizza la risposta selezionata
};
const handleNextQuestion = async () => {
  const questions = quizData[selectedCity!];
  const currentQuestion = questions[currentQuestionIndex];

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  if (currentQuestionIndex + 1 < questions.length) {
    // Avanza alla prossima domanda
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setSelectedAnswer(null); // Resetta la selezione
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
    }
  } else {
    // Ultima domanda: calcola il totale corretto
    const finalCorrectAnswers = correctAnswers + (isCorrect ? 1 : 0);

    if (finalCorrectAnswers === questions.length) {
      if (user) {
        try {
          // Esegui l'inserimento nel database
          if (selectedCity) {
            
          user.local_legend_for.push(selectedCity);
          setUser(user);
          const result = await db.runAsync(
            `INSERT INTO users_ll_for (username, city) VALUES (?, ?)`,
            [user.username, selectedCity]
          );
          console.log('Inserted into database:', result.lastInsertRowId, result.changes);
        }
        Alert.alert('Congratulations!', `You are now a Local Legend for ${selectedCity}!`, [
          {
            text: 'OK',
            onPress: () => {
              // Una volta che l'utente chiude l'alert, naviga alla pagina del profilo
              router.push('../'); // Assicurati che il percorso della pagina profilo sia corretto
            },
          },
        ]);
          
        } catch (error) {
          // Gestione errori
          console.error('Error inserting into database:', error);
          Alert.alert('Error', 'There was an issue saving your data.');
        }
      }
    } else {
      Alert.alert(
        'Quiz Finished',
        `You answered ${finalCorrectAnswers} out of ${questions.length} correctly.`,[ 
          {
            text: 'OK',
            onPress: () => {
              // Una volta che l'utente chiude l'alert, naviga alla pagina del profilo
              router.push('../'); // Assicurati che il percorso della pagina profilo sia corretto
            },
          },
        ]
      );
    }

    // Reset dello stato del quiz
    setSelectedCity(null);
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
    setSelectedAnswer(null);
  }
};

  
if (selectedCity) {
  const questions = quizData[selectedCity];
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz for {selectedCity}</Text>
      <Text style={styles.question}>{currentQuestion.question}</Text>
      {currentQuestion.options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.optionButton,
            selectedAnswer === option && { backgroundColor: isDarkMode ? '#555' : '#87CEEB' },
          ]}
          onPress={() => handleAnswerSelection(option)}
          disabled={selectedAnswer !== null} // Disabilita i pulsanti se una risposta è stata selezionata
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
      {selectedAnswer && (
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNextQuestion}
        >
          <Text style={styles.nextButtonText}>
            {currentQuestionIndex + 1 < questions.length ? 'Next' : 'End'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose a City</Text>
      </View>
      <View style={styles.cityContainer}>
        {availableCities.length > 0 ? (
          availableCities.map((city) => (
            <TouchableOpacity
              key={city}
              style={styles.cityButton}
              onPress={() => setSelectedCity(city)}
            >
              <Text style={styles.cityButtonText}>{city}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noCitiesText}>You are a Local Legend for all available cities!</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default QuizSelectionScreen;

const createStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: isDarkMode ? '#000' : '#A1CEDC',
      padding: 16,
    },
    header: {
      alignItems: 'center',
      marginBottom: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#000',
      marginTop: 40,
    },
    cityContainer: {
      backgroundColor: isDarkMode ? '#222' : '#fff',
      borderRadius: 8,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cityButton: {
      backgroundColor: isDarkMode ? '#444' : '#1E90FF',
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
      alignItems: 'center',
    },
    cityButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    noCitiesText: {
      fontSize: 16,
      color: isDarkMode ? '#aaa' : '#555',
      textAlign: 'center',
    },
    question: {
      fontSize: 18,
      color: isDarkMode ? '#fff' : '#000',
      marginBottom: 16,
      textAlign: 'center',
    },
    optionButton: {
      backgroundColor: isDarkMode ? '#444' : '#1E90FF',
      padding: 12,
      borderRadius: 8,
      marginBottom: 12,
      alignItems: 'center',
    },
    optionText: {
      color: '#fff',
      fontSize: 16,
    },
    nextButton: {
      backgroundColor: isDarkMode ? '#444' : '#1E90FF',
      padding: 12,
      borderRadius: 8,
      marginTop: 16,
      alignItems: 'center',
    },
    nextButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
