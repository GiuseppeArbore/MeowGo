import React, {useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, useColorScheme, Modal, Platform } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Filters, useAppContext } from '@/app/_layout';
import { formatDateTime } from '@/hooks/dateFormat';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

//props per la funzione SearchBar

type Props = {
    setShowedEvents: any;
    filters: Filters;
};

export const SearchBar: React.FC<Props> = ({ setShowedEvents, filters }) => {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(true);
    const { searchFilters, setSearchFilters, allEvents, myEvents } = useAppContext();
    const [searchFiltersTemp, setSearchFiltersTemp] = useState({ ...searchFilters });
    const [showPickerAvailableCities, setShowPickerAvailableCities] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';


    const colors = {
        background: isDarkMode ? '#1C1C1C' : '#FFFFFF',
        text: isDarkMode ? '#FFFFFF' : '#000000',
        inputBackground: isDarkMode ? '#2E2E2E' : '#F5F5F5',
        buttonBackground: isDarkMode ? '#2E2E2E' : '#E0E0E0',
        buttonText: isDarkMode ? '#FFFFFF' : '#000000',
    };

    const handleCityChange = (cityValue: any) => {
        setSearchFiltersTemp({ ...searchFiltersTemp, city: cityValue });
    };

    const applyFilters = async () => {
        const showed = allEvents.filter(event => {
            return (
                (
                    event.city == searchFilters.city &&
                    (searchFilters.date || new Date(event.date) > new Date(searchFilters.date as string))
                ) &&
                (
                    (
                        (!filters.localLegend || event.local_legend_here) &&
                        (filters.maxPeople == 1 || event.max_people <= filters.maxPeople) &&
                        (!filters.eventType || event.type === filters.eventType) &&
                        (!filters.location || event.place.toLowerCase() === filters.location.toLowerCase())
                    )
                ) &&
                (
                    ! myEvents.includes(event.name)
                )
            );
        });
        setShowedEvents(showed);
    }

    const styles = StyleSheet.create({
        fakeSearchBar: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDarkMode ? '#333' : '#e3e3e4',
            borderRadius: 20,
            paddingHorizontal: 10,
            marginLeft: 10,
            height: 40,
        },
        cityText: {
            fontSize: 16,
            fontWeight: 'bold',
            marginRight: 5,
            color: isDarkMode ? '#FFF' : '#000',
        },
        dateTimeText: {
            flex: 1,
            fontSize: 14,
            textAlign: 'center',
            color: isDarkMode ? '#FFF' : '#000',
        },

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
            marginBottom: 16,
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
        setIsModalVisible(false);
    };

    const handleApply = async () => {
        console.log(searchFiltersTemp);
        setSearchFilters(searchFiltersTemp);
        await applyFilters();
        setIsModalVisible(false);
    };

    return (
        <>
            {
                <TouchableOpacity style={styles.fakeSearchBar} onPress={() => setIsModalVisible(true)}>
                    <Text style={styles.cityText}>{searchFilters.city}</Text>
                    <Text style={styles.dateTimeText}>
                        {formatDateTime(new Date(searchFilters.date))}
                    </Text>
                    <IconSymbol size={20} name="magnifyingglass" color={isDarkMode ? '#FFF' : '#000'} />
                </TouchableOpacity>
            }
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.overlay}>

                    <View style={styles.modal}>

                        <Text style={styles.headerText}>Discover new event</Text>

                        <View style={styles.card}>
                            <View style={styles.filterRow}>

                                <TouchableOpacity
                                    style={styles.clickableArea}
                                    onPress={toggleCityPicker}>
                                    {Platform.OS === 'ios' && <Text style={styles.searchLabel}>
                                        {searchFiltersTemp.city}
                                    </Text>}
                                    {Platform.OS === 'ios' && <IconSymbol name="location" size={20} color={colorScheme === 'dark' ? '#FFF' : '#000'} />}
                                </TouchableOpacity>
                            </View>
                            {((showPickerAvailableCities && Platform.OS === 'ios') || Platform.OS === 'android') &&
                                <Picker
                                    selectedValue={searchFiltersTemp.city}
                                    onValueChange={handleCityChange}
                                >
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
                                        {`Starting from ${new Date(searchFiltersTemp.date).toLocaleDateString()}`}
                                    </Text>
                                    <IconSymbol size={20} name="calendar" color={colorScheme === 'dark' ? '#FFF' : '#000'} />
                                </TouchableOpacity>
                            </View>

                            {showDatePicker && (
                                <DateTimePicker
                                    value={new Date(searchFiltersTemp.date)}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={(event, date) => {
                                        if (Platform.OS === 'android') setShowDatePicker(false)
                                        if (date) setSearchFiltersTemp({ ...searchFiltersTemp, date: date.toISOString() });
                                    }}
                                />)}
                        </View>

                        {/* Time Picker */}
                        <View style={styles.card}>
                            <View style={styles.filterRow}>
                                <TouchableOpacity
                                    style={styles.clickableArea}
                                    onPress={toggleTimePicker}
                                >
                                    <Text style={styles.searchLabel}>
                                        {new Date(searchFiltersTemp.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                    <IconSymbol size={20} name="clock" color={colorScheme === 'dark' ? '#FFF' : '#000'} />
                                </TouchableOpacity>
                            </View>
                            {showTimePicker && (
                                <DateTimePicker
                                    value={new Date(searchFiltersTemp.date)}
                                    mode="time"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={(event, time) => {
                                        if (Platform.OS === 'android') setShowTimePicker(false);
                                        if (time) setSearchFiltersTemp({ ...searchFiltersTemp, date: time.toISOString() });
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

            </Modal>
        </>
    )
}