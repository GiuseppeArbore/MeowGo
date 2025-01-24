import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { useAppContext } from '../_layout';
import { User } from '@/components/models/user';
import { router, useNavigation, useRouter } from 'expo-router';

const cities = ['Bari', 'Turin'];

const cityBackgrounds: Record<string, any> = {
  Bari: require('@/assets/images/bari.jpg'), // Assicurati di avere le immagini corrette nel percorso
  Turin: require('@/assets/images/turin.jpeg'),
};

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
  const navigation = useNavigation();
  const router = useRouter();
  const { user, db, setUser } = useAppContext();
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(quizData[selectedCity!]?.length).fill(null));
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  useEffect(() => {
    // Imposta il titolo dello screen
    navigation.setOptions({ title: selectedCity ? `Quiz for ${selectedCity}` : 'Quiz', headerBackTitle: 'Back' });
  }, [selectedCity, navigation]);

  const handleBackOrExit = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(answers[currentQuestionIndex - 1]);
    } else {
      handleExitQuiz();
    }
  };

  const handleExitQuiz = () => {
    setSelectedCity(null);
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
    setSelectedAnswer(null);
  };

  const handleAnswerSelection = (answer: string) => {
    setSelectedAnswer(answer);
    setAnswers((prev) => {
      const updated = [...prev];
      updated[currentQuestionIndex] = answer;
      return updated;
    });
  };

  const handleNextQuestion = async () => {
    const questions = quizData[selectedCity!];
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      if (isCorrect) setCorrectAnswers((prev) => prev + 1);
    } else {
      const finalCorrectAnswers = correctAnswers + (isCorrect ? 1 : 0);

      if (finalCorrectAnswers === questions.length) {
        if (user) {
          try {
            const updatedUser = new User(
              user.username,
              user.password,
              user.name,
              user.surname,
              user.birthdate,
              [...user.local_legend_for, selectedCity!],
              user.taralli
            );
            setUser(updatedUser);
            await db.runAsync(`INSERT INTO users_ll_for (username, city) VALUES (?, ?)`, [
              user.username,
              selectedCity,
            ]);
            Alert.alert('Congratulations!', `You are now a Local Legend for ${selectedCity}!`);
          } catch (error) {
            Alert.alert('Error', 'There was an issue saving your data.');
          }
        }
      } else {
        Alert.alert('Quiz Finished', `You answered ${finalCorrectAnswers} out of ${questions.length} correctly.`);
      }

      handleExitQuiz();
    }
  };

  if (selectedCity) {
    const questions = quizData[selectedCity];
    const currentQuestion = questions[currentQuestionIndex];

    return (

      <ImageBackground
        source={cityBackgrounds[selectedCity]}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <View style={styles.card}>
            <View style={styles.progressContainer}>
              {/* Barra di progresso */}
              <View
                style={[
                  styles.progressBar,
                  { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` },
                ]}
              />
              {/* Testo al centro della barra */}
              <Text style={styles.progressText}>
                {currentQuestionIndex + 1}/{questions.length}
              </Text>
          </View>
          <View style={styles.divider} />
          <ScrollView contentContainerStyle={styles.quizContainer}>
            <Text style={styles.question}>{currentQuestion.question}</Text>
            {currentQuestion.options.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  selectedAnswer === option && { backgroundColor: '#a9a9aa' },
                ]}
                onPress={() => handleAnswerSelection(option)}
              >
                <Text style={[styles.optionText, selectedAnswer === option && { color: '#FFFFFF' }]}>{option}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.footer}>
            <TouchableOpacity style={styles.exitButton} onPress={handleBackOrExit}>
              <Text style={styles.exitButtonText}>
                {currentQuestionIndex === 0 ? 'Exit' : 'Back'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.nextButton, !selectedAnswer && { backgroundColor: '#ccc' }]}
              onPress={handleNextQuestion}
              disabled={!selectedAnswer}
            >
              <Text style={styles.nextButtonText}>
                {currentQuestionIndex + 1 < questions.length ? 'Next' : 'End'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('@/assets/images/quizBackground.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.card}>
        <ScrollView contentContainerStyle={styles.quizContainer}>
          <Text style={styles.question}>Choose a City</Text>
          {cities.map((city) => (
            <TouchableOpacity
              key={city}
              style={[styles.optionButton]}
              onPress={() => setSelectedCity(city)}
            >
              <Text style={styles.optionText}>{city}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

export default QuizSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Cambia l'opacità (0.4) per regolare la trasparenza
  },
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 30,
    height: 22,
    backgroundColor: '#c8c8c9',
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  progressBar: {
    position: 'absolute', 
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 8,
  },
  progressText: {
    textAlign: 'center',
    fontSize: 15,
    color: '#fff',
    fontWeight: 'bold',
    zIndex: 1, 
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 16,
  },
  quizContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  question: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  optionButton: {
    backgroundColor: '#e3e3e4',
    borderColor: '#a9a9aa',
    padding: 12,
    borderWidth: 0.2,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  optionText: {
    color: '#000',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  exitButton: {
    flex: 1,
    backgroundColor: '#FF6347',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  exitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
