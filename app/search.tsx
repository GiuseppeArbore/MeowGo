import { StyleSheet, Text, View, TouchableOpacity, useColorScheme, TouchableWithoutFeedback, Platform } from 'react-native';
import React, { useState } from 'react';;
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

export default function Filter() {
    const colorScheme = useColorScheme();
    const navigation = useNavigation();
    const [selectedCity, setSelectedCity] = useState('Turin');
    const [showPickerAvailableCities, setShowPickerAvailableCities] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    // Funzioni per la gestione dei picker
    const toggleCityPicker = () => {
        setShowPickerAvailableCities(!showPickerAvailableCities);
        setShowDatePicker(false);
        setShowTimePicker(false);
    };

    const toggleDatePicker = () => {
        setShowDatePicker(!showDatePicker);
        setShowTimePicker(false);
        setShowPickerAvailableCities(false);
    };

    const toggleTimePicker = () => {
        setShowTimePicker(!showTimePicker);
        setShowDatePicker(false);
        setShowPickerAvailableCities(false);
    };

    const handleCancel = () => {
        navigation.goBack();
    };

    const handleApply = () => {
        console.log('Search done');
        navigation.goBack();
    };

    return (

        <TouchableWithoutFeedback onPress={() => {
            if (!showPickerAvailableCities)
                navigation.goBack();
        }}>
            <View style={styles.overlay}>

                <View style={styles.modal}>

                    <Text style={styles.headerText}>Discover new event</Text>

                    <View style={styles.card}>
                        <View style={styles.filterRow}>

                            <TouchableOpacity
                                style={styles.clickableArea}
                                onPress={toggleCityPicker}>
                                {Platform.OS === 'ios' &&<Text style={styles.searchLabel}>
                                    {selectedCity}
                                </Text>}
                                {Platform.OS === 'ios' &&<IconSymbol name="location" size={20} color={colorScheme === 'dark' ? '#FFF' : '#000'}/>}
                            </TouchableOpacity>
                        </View>
                        {((showPickerAvailableCities && Platform.OS === 'ios') || Platform.OS === 'android') &&
                            <Picker
                                selectedValue={selectedCity}
                                onValueChange={(cityValue) => {
                                    setSelectedCity(cityValue);
                                }}
                            >
                                <Picker.Item label="All cities" value="All cities" />
                                <Picker.Item label="Turin" value="Turin" />
                                <Picker.Item label="Bari" value="Bari" />
                            </Picker>
                        }
                    </View>

                    {/* Date Picker */}
                    <View style={styles.card}>
                        <View style={styles.filterRow}>
                        <TouchableOpacity
                            style={styles.clickableArea}
                            onPress={toggleDatePicker}
                        >
                            <Text style={styles.searchLabel}>
                                {selectedDate.toLocaleDateString()}
                            </Text>
                            <IconSymbol size={20} name="calendar" color={colorScheme === 'dark' ? '#FFF' : '#000'} />
                        </TouchableOpacity>
                    </View>

                    {showDatePicker && (
                        <DateTimePicker
                            value={selectedDate}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={(event, date) => {
                                setShowDatePicker(false)
                                if (date) setSelectedDate(date);
                            }}
                        />
                    )}
                </View>

                {/* Time Picker */}
                <View style={styles.card}>
                    <View style={styles.filterRow}>
                        <TouchableOpacity
                            style={styles.clickableArea}
                            onPress={toggleTimePicker}
                        >
                            <Text style={styles.searchLabel}>
                                {selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                            <IconSymbol size={20} name="clock" color={colorScheme === 'dark' ? '#FFF' : '#000'} />
                        </TouchableOpacity>
                    </View>
                    {showTimePicker && (
                        <DateTimePicker
                            value={selectedTime}
                            mode="time"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={(event, time) => {
                                setShowTimePicker(false);
                                if (time) setSelectedTime(time);
                            }}
                        />
                    )}
                </View>

                {/* Bottoni in Fondo */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.searchButton]} onPress={handleApply}>
                        <Text style={[styles.buttonText, styles.searchButtonText]}>Search</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        </TouchableWithoutFeedback >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
    },
    modal: {
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 20,
        paddingTop: 20,
        paddingBottom: 0, // Tolto padding sotto, bottoni faranno il bordo
        marginHorizontal: 20,
        maxHeight: '70%', // Massimo metà schermo
    },
    buttonContainer: {
        flexDirection: 'row',
        borderTopColor: '#ddd',
        marginTop: 10,
    },
    button: {
        flex: 1,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: '#f5f5f5',
        borderBottomLeftRadius: 20,
        borderRightWidth: 0.5,
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    searchButton: {
        backgroundColor: '#f5f5f5',
        borderBottomRightRadius: 20,
        borderLeftWidth: 0.5,
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    buttonText: {
        fontSize: 16,
        color: '#000',
    },
    searchButtonText: {
        fontWeight: 'bold',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    card: {
        width: '90%',
        minHeight: 50,
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        marginBottom: 10,
        elevation: 3, // Ombra per Android
        shadowColor: '#000', // Ombra per iOS
        shadowOffset: { width: 0, height: 2 },
        borderRadius: 25,
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    searchLabel: {
        flex: 1,
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    clickableArea: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
});