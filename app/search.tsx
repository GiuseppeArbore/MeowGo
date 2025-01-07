import { StyleSheet, Text, View, TouchableOpacity, useColorScheme, TouchableWithoutFeedback, Platform } from 'react-native';
import React, { useState } from 'react';;
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useAppContext } from './_layout';

export default function Filter() {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';
    const navigation = useNavigation();
    const { searchFilters, setSearchFilters  } = useAppContext();
    const [searchFiltersTemp, setSearchFiltersTemp] = useState({ ...searchFilters }); 

    const [showPickerAvailableCities, setShowPickerAvailableCities] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const colors = {
        background: isDarkMode ? '#1C1C1C' : '#FFFFFF',
        text: isDarkMode ? '#FFFFFF' : '#000000',
        inputBackground: isDarkMode ? '#2E2E2E' : '#F5F5F5',
        buttonBackground: isDarkMode ? '#2E2E2E' : '#E0E0E0',
        buttonText: isDarkMode ? '#FFFFFF' : '#000000',
      };

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
            backgroundColor: colors.background,
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
            backgroundColor: colors.buttonBackground,
            borderBottomLeftRadius: 20,
            borderRightWidth: 0.5,
            borderTopWidth: 1,
            borderColor: 'white',
        },
        searchButton: {
            backgroundColor: colors.buttonBackground,
            borderBottomRightRadius: 20,
            borderLeftWidth: 0.5,
            borderTopWidth: 1,
            borderColor: 'white',
        },
        buttonText: {
            fontSize: 16,
            color: colors.buttonText,
        },
        searchButtonText: {
            fontWeight: 'bold',
        },
        headerText: {
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 20,
            textAlign: 'center',
            color: colors.text,
        },
        card: {
            width: '90%',
            minHeight: 50,
            justifyContent: 'center',
            backgroundColor: colors.inputBackground,
            borderWidth: 1,
            borderColor: colors.inputBackground,
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
            color: colors.text,
        },
        clickableArea: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
        },
    });


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
        setSearchFilters(searchFiltersTemp);
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
                                    {searchFiltersTemp.city}
                                </Text>}
                                {Platform.OS === 'ios' &&<IconSymbol name="location" size={20} color={colorScheme === 'dark' ? '#FFF' : '#000'}/>}
                            </TouchableOpacity>
                        </View>
                        {((showPickerAvailableCities && Platform.OS === 'ios') || Platform.OS === 'android') &&
                            <Picker
                                selectedValue={searchFiltersTemp.city}
                                onValueChange={(cityValue) => setSearchFiltersTemp({ ...searchFiltersTemp, city: cityValue })}
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
                                {searchFiltersTemp.date.toLocaleDateString()}
                            </Text>
                            <IconSymbol size={20} name="calendar" color={colorScheme === 'dark' ? '#FFF' : '#000'} />
                        </TouchableOpacity>
                    </View>

                    {showDatePicker && (
                        <DateTimePicker
                            value={searchFiltersTemp.date}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={(event, date) => {
                                if (Platform.OS === 'android') setShowDatePicker(false)
                                if (date) setSearchFiltersTemp({ ...searchFiltersTemp, date: date });
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
                                {searchFiltersTemp.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                            <IconSymbol size={20} name="clock" color={colorScheme === 'dark' ? '#FFF' : '#000'} />
                        </TouchableOpacity>
                    </View>
                    {showTimePicker && (
                        <DateTimePicker
                            value={searchFiltersTemp.date}
                            mode="time"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={(event, time) => {
                                if (Platform.OS === 'android') setShowTimePicker(false);
                                if (time) setSearchFiltersTemp({ ...searchFiltersTemp, date: time });
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