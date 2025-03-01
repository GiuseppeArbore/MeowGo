import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Button, useColorScheme } from 'react-native';
import { User } from './models/user';

interface ModalCitySelectorProps {
    isVisible: boolean;
    onSelectCity: (city: string) => void;
    onClose: () => void;
    llCities: string[];
}

const cities = ['Bari', 'Turin']; // Lista di tutte le città disponibili per l'app

const ModalCitySelector: React.FC<ModalCitySelectorProps> = ({ isVisible, onSelectCity, onClose, llCities }) => {

    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';
    const colors = {
        background: isDarkMode ? '#1C1C1C' : '#FFFFFF',
        text: isDarkMode ? '#FFFFFF' : '#000000',
        inputBackground: isDarkMode ? '#2E2E2E' : '#F5F5F5',
        buttonBackground: isDarkMode ? '#2E2E2E' : '#E0E0E0',
        buttonText: isDarkMode ? '#FFFFFF' : '#000000',
    };
    const styles = StyleSheet.create({
        modalOverlay: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
        citiesContainer: {
            flexDirection: 'row',
            padding: 15,
            flexWrap: 'wrap', // Permette la disposizione su più righe
            justifyContent: 'space-between',
            width: '100%',
        },
        textContainer: {
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            padding: 20,
        },
        cityButton: {
            backgroundColor: '#e3e3e4',
            borderColor: '#a9a9aa',
            width: '48%',
            padding: 12,
            borderWidth: 0.2,
            borderRadius: 8,
            marginBottom: 12,
            alignItems: 'center',
        },
        buttonContainer: {
            flexDirection: 'row',
            marginTop: 10,
        },
        cityText: {
            fontSize: 18,
        },
        cityButtonDisabled: {
            backgroundColor: '#d3d3d3',
            borderColor: '#a9a9aa',
            width: '48%',
            padding: 12,
            borderWidth: 0.2,
            borderRadius: 8,
            marginBottom: 12,
            alignItems: 'center',
        },
        cityTextDisabled: {
            fontSize: 18,
            color: '#808080',
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

    return (
        <Modal visible={isVisible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {llCities?.length == cities.length &&
                        <>
                            <Text style={styles.modalTitle}>You are already a Local Legend in all cities</Text>
                            <View style={styles.textContainer}>
                                <Text> We''ll add more cities in future</Text>
                                <Text> Stay tuned!!!</Text>
                            </View>
                        </>
                    }
                    {llCities?.length < cities.length &&
                        <>
                            <Text style={styles.modalTitle}>Choose a City</Text>
                            <View style={styles.citiesContainer}>
                                {cities.map((city) => {
                                    const isDisabled = llCities?.includes(city) || false;
                                    return (
                                        <TouchableOpacity
                                            key={city}
                                            style={isDisabled ? styles.cityButtonDisabled : styles.cityButton}
                                            onPress={() => !isDisabled && onSelectCity(city)}
                                            disabled={isDisabled} // Disabilita il pulsante se l'utente è già Local Legend
                                        >
                                            <Text style={isDisabled ? styles.cityTextDisabled : styles.cityText}>
                                                {city}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </>
                    }
                    {/* Bottone in Fondo */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={onClose}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ModalCitySelector;
