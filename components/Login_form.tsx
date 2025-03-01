import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Modal,
    Text,
    TouchableOpacity,
    useColorScheme,
    Image
} from 'react-native';


import { useAppContext } from '../app/_layout';
import { User } from './models/user';

interface LoginFormProps {
    isModalVisible: boolean;
    setIsModalVisible: (visible: boolean) => void;
}


export function Login_form({ isModalVisible, setIsModalVisible }: LoginFormProps) {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';
    const { db } = useAppContext();
    const { user, setUser, setMyEvents } = useAppContext();
    const usersName = [
        { name: 'Peppe', image: require('@/assets/images/users/Peppe.jpg') },
        { name: 'Pio', image: require('@/assets/images/users/Pio.jpg') },
        { name: 'Caca',image: require('@/assets/images/users/cla.jpg') }, 
        { name: 'Fra', image: require('@/assets/images/users/fra.jpeg') }
    ];

    const colors = {
        background: isDarkMode ? '#1C1C1C' : '#FFFFFF',
        text: isDarkMode ? '#FFFFFF' : '#000000',
        inputBackground: isDarkMode ? '#2E2E2E' : '#F5F5F5',
        buttonBackground: isDarkMode ? '#2E2E2E' : '#E0E0E0',
        buttonText: isDarkMode ? '#FFFFFF' : '#000000',
        placeholder: isDarkMode ? '#888888' : '#AAAAAA',
    };

    const styles = StyleSheet.create({
        modalOverlay: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.4)',
        },
        modalContent: {
            alignItems: 'center',
            backgroundColor: colors.background,
            borderRadius: 20,
            paddingTop: 20,
            paddingBottom: 0, // Tolto padding sotto, bottoni faranno il bordo
            marginHorizontal: 20,
        },
        modalTitle: {
            fontSize: 20,
            marginBottom: 20,
            color: colors.text,
        },
        buttonContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap', // Permette la disposizione su più righe
            justifyContent: 'space-between',
            width: '100%',
        },

        usersContainer: {
            flexDirection: 'row',
            padding: 15,
            flexWrap: 'wrap', // Permette la disposizione su più righe
            justifyContent: 'space-between',
            width: '100%',
        },
        userButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.buttonBackground,
            padding: 15,
            borderRadius: 8,
            width: '48%',
            marginBottom: 15,
            borderWidth: 0.2,
            borderColor: isDarkMode ? '#444' : '#CCC',
        },
        avatar: {
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 10,
        },
        username: {
            fontSize: 18,
            fontWeight: '500',
            color: colors.buttonText,
        },
        buttonText: {
            fontSize: 16,
            color: colors.text,
        },
        button: {
            flex: 1,
            paddingVertical: 15,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.buttonBackground,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            borderWidth: 0.5,
            borderTopWidth: 1,
            borderColor: 'white',
        },
    });

    const handleLogin = async (name: string) => {
        try {
            if (!db) {
                throw new Error('Database not found');
            } else {
                console.log('Database opened at:', db.databasePath);
            }

            const result = await db.getAllAsync('SELECT * FROM users WHERE username = ?', [name]);
            console.log('Login Query result:', result);
            const local_legend_for = await db.getAllAsync('SELECT city FROM users_ll_for WHERE username = ?', [name]);
            console.log('Local legend for:', local_legend_for);

            if (result.length > 0) {
                const userResult = result[0] as { username: string, password: string, name: string, surname: string, birthdate: string, taralli: number };
                const ll_for = local_legend_for.map((ll: any) => ll.city);
                const eventsJoined = (await db.getAllAsync('SELECT event FROM users_events WHERE user = ?', [name])).map((ev: any) => ev.event);
                setMyEvents(eventsJoined);
                console.log('Joined events of ' + name + ": " + eventsJoined);
                setUser(new User(userResult.username, userResult.password, userResult.name, userResult.surname, new Date(userResult.birthdate), ll_for, userResult.taralli));
                setIsModalVisible(false);
            } else {
                console.error('Username non trovato');
            }

        } catch (error) {
            console.error('Error:', error);
        }
    };

    /*switch user*/
    return (
        <Modal
            visible={isModalVisible}
            transparent animationType="slide"
            onRequestClose={() => setIsModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Who are you?</Text>
                    <View style={styles.usersContainer}>
                        {usersName.map((user) => (
                            <TouchableOpacity
                                key={user.name}
                                style={styles.userButton}
                                onPress={() => handleLogin(user.name)}
                            >
                                <Image
                                    source={user.image ? user.image || require('@/assets/images/null.jpg') : require('@/assets/images/null.jpg')}
                                    style={styles.avatar}
                                />
                                <Text style={styles.username}>{user.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    {/* Bottone in Fondo */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => setIsModalVisible(false)}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </Modal>
    );

}
