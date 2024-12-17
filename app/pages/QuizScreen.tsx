import React from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme } from 'react-native';

const QuizScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const styles = createStyles(isDarkMode);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Quiz</Text>
      </View>

      <View style={styles.quizContainer}>
        {/* Aggiungi qui il contenuto del quiz */}
        <Text>Question 1: Che anno è?</Text>
        {/* Aggiungi input per risposte e logica di risposta qui */}
      </View>
    </ScrollView>
  );
};

export default QuizScreen;

const createStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: isDarkMode ? '#000' : '#A1CEDC', // Colore dinamico
      padding: 16,
      marginBottom: 24,
    },
    header: {
      alignItems: 'center',
      marginBottom: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#fff',
      marginTop: 40,
    },
    quizContainer: {
      backgroundColor: isDarkMode ? '#222' : '#fff', // Colore dinamico
      borderRadius: 8,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      marginBottom: 16,
    },
  });
