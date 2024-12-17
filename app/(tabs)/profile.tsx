import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme } from 'react-native';

const ProfileScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // Stati con valori predefiniti (non modificabili)
  const firstName = 'Mario';
  const lastName = 'Rossi';
  const dateOfBirth = '12/04/1998';

  const styles = createStyles(isDarkMode);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>First Name</Text>
        <Text style={styles.value}>{firstName}</Text>

        <Text style={styles.label}>Last Name</Text>
        <Text style={styles.value}>{lastName}</Text>

        <Text style={styles.label}>Date of Birth</Text>
        <Text style={styles.value}>{dateOfBirth}</Text>
      </View>

      <View style={styles.buttonContainer} onTouchEnd={() => { /* Handle button click here */ }}>
        <Text style={styles.button}>
          Become a Local Legend
        </Text>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

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
    formContainer: {
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
    label: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
      color: isDarkMode ? '#ddd' : '#333', // Colore dinamico
    },
    value: {
      backgroundColor: isDarkMode ? '#333' : '#F0F0F0', // Colore dinamico
      borderRadius: 4,
      padding: 12,
      fontSize: 16,
      color: isDarkMode ? '#fff' : '#000', // Testo dinamico
      marginBottom: 16,
      borderWidth: 1,
      borderColor: isDarkMode ? '#444' : '#ccc', // Colore dinamico
    },
    buttonContainer: {
      backgroundColor: isDarkMode ? '#444' : '#1E90FF', // Colore dinamico
      borderRadius: 8,
      overflow: 'hidden',
      alignItems: 'center',
      padding: 12,
    },
    button: {
      fontSize: 18,
      fontWeight: '600',
      color: isDarkMode ? '#fff' : '#fff',
    },
  });
