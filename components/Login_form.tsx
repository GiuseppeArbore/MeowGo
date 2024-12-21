import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Modal,
    TextInput,
    Text,
    TouchableOpacity,
    useColorScheme
} from 'react-native';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
const DATABASE_NAME = 'mydb.db';

const loadDatabase = async () => {
  const dbPath = `${FileSystem.documentDirectory}SQLite/${DATABASE_NAME}`;

  // Controlla se il database esiste già
  const dbExists = await FileSystem.getInfoAsync(dbPath);

  if (!dbExists.exists) {
    // Copia il file .db dalla cartella assets alla sandbox dell'app
    console.log('Copia del database preesistente...');
    const asset = Asset.fromModule(require('../assets/mydb.db'));
    await asset.downloadAsync();

    await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}SQLite`, {
      intermediates: true,
    });

    await FileSystem.copyAsync({
      from: asset.localUri!,
      to: dbPath,
    });
    console.log('Database copiato con successo!');
  } else {
    console.log('Database già esistente.');
  }

  // Apri il database
  const db = SQLite.openDatabaseSync(DATABASE_NAME);
  console.log('Database aperto:', DATABASE_NAME);

  return db;
};

// Carica e inizializza il database
loadDatabase();

export function Login_form() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isModalVisible, setModalVisible] = useState<boolean>(true);
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';
    

    const colors = {
        background: isDarkMode ? '#1C1C1C' : '#FFFFFF',
        text: isDarkMode ? '#FFFFFF' : '#000000',
        inputBackground: isDarkMode ? '#2E2E2E' : '#F5F5F5',
        buttonBackground: isDarkMode ? '#2E2E2E' : '#E0E0E0',
        buttonText: isDarkMode ? '#FFFFFF' : '#000000',
        placeholder: isDarkMode ? '#888888' : '#AAAAAA',
    };
    
    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        map: {
            ...StyleSheet.absoluteFillObject,
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.4)',
        },
        modalContent: {
            width: '85%',
            backgroundColor: colors.background,
            borderRadius: 15,
            padding: 20,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        input: {
            width: '100%',
            height: 50,
            backgroundColor: colors.inputBackground,
            borderRadius: 10,
            marginBottom: 15,
            paddingHorizontal: 15,
            color: colors.text,
            fontSize: 16,
        },
        button: {
            backgroundColor: colors.buttonBackground,
            paddingVertical: 12,
            paddingHorizontal: 30,
            borderRadius: 10,
            marginTop: 10,
            borderWidth: 1,
            borderColor: isDarkMode ? '#444' : '#CCC',
        },
        buttonText: {
            color: colors.buttonText,
            fontWeight: '600',
            fontSize: 16,
        },

        title: {
            fontSize: 22,
            fontWeight: 'bold',
            marginBottom: 20,
            color: colors.text,
        },
        errorText: {
            color: 'red',
            marginBottom: 10,
            textAlign: 'center',
        },
    });
    
    const handleLogin = async () => {
        try {
            console.log('Opening database...');
            const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
            console.log('Database opened at:', db.databasePath);
    
            const result = await db.getAllAsync('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
            console.log('Query result:', result);

            if (result.length > 0) {
                setModalVisible(false);
            } else {
                setErrorMessage('Username o password errati');
            }

        } catch (error) {  
            console.error('Error:', error);
            setErrorMessage('Errore durante il login');
        }
    };

    return (
        <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Login</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        placeholderTextColor={colors.placeholder}
                        value={username}
                        onChangeText={setUsername}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor={colors.placeholder}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                    />
                    {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    



}
