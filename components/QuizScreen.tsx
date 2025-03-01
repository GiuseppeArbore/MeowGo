import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { useAppContext } from '../app/_layout';
import { User } from '@/components/models/user';
import { useNavigation } from 'expo-router';

interface QuizProps {
  quizData: { question: string; options: string[]; correctAnswer: string }[];
  cityBackground: any;
  selectedCity: string;
}

const QuizSelectionScreen: React.FC<QuizProps> = ({ quizData, cityBackground, selectedCity }) => {
  const navigation = useNavigation();
  const { user, db, setUser } = useAppContext();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(quizData.length).fill(null));
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  useEffect(() => {
    const title = `Quiz for ${selectedCity}`;
    navigation.setOptions({ title, headerBackTitle: 'Back' });
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
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    navigation.goBack();
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
    if (isLastQuestion()) {
      finishQuiz();
    } else {
      moveToNextQuestion();
    }
  };

  const isLastQuestion = () => {
    return currentQuestionIndex + 1 === quizData.length;
  };

  const finishQuiz = () => {
    // Calcolare il punteggio alla fine
    let finalCorrectAnswers = 0;
    quizData.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        finalCorrectAnswers++;
      }
    });

    if (finalCorrectAnswers === quizData.length) {
      handlePerfectQuizCompletion();
    } else {
      Alert.alert('Quiz Finished', `You answered ${finalCorrectAnswers} out of ${quizData.length} correctly.`);
    }

    handleExitQuiz();
  };

  const handlePerfectQuizCompletion = async () => {
    if (user) {
      try {
        const updatedUser = new User(
          user.username,
          user.password,
          user.name,
          user.surname,
          user.birthdate,
          [...user.local_legend_for, selectedCity],
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
  };

  const moveToNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setSelectedAnswer(null);
  };

  const currentQuestion = quizData[currentQuestionIndex];


  return (

    <ImageBackground
      source={cityBackground}
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
              { width: `${((currentQuestionIndex + 1) / quizData.length) * 100}%` },
            ]}
          />
          {/* Testo al centro della barra */}
          <Text style={styles.progressText}>
            {currentQuestionIndex + 1}/{quizData.length}
          </Text>
        </View>
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
              {currentQuestionIndex + 1 < quizData.length ? 'Next' : 'End'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  cityButton: {
    backgroundColor: '#e3e3e4',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  cityText: {
    fontSize: 16,
  },
});
