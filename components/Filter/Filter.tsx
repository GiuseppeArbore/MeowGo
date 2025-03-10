import { StyleSheet, Text, View, Switch, TouchableOpacity, useColorScheme, TouchableWithoutFeedback, Platform, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import Slider from '@react-native-community/slider';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { SearchFilters, useAppContext } from '../../app/_layout';
import React from 'react';


type Props = {
  setShowedEvents: any;
  searchFilters: SearchFilters;
};

export const Filter: React.FC<Props> = ({ setShowedEvents, searchFilters }) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const { filters, setFilters, allEvents, myEvents } = useAppContext();
  const [filtersTemp, setFiltersTemp] = useState({ ...filters });
  const [showPickerLocation, setShowPickerLocation] = useState(false);
  const [showPickerEventType, setShowPickerEventType] = useState(false);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const colors = {
    background: isDarkMode ? '#1C1C1C' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    inputBackground: isDarkMode ? '#2E2E2E' : '#F5F5F5',
    buttonBackground: isDarkMode ? '#2E2E2E' : '#E0E0E0',
    buttonText: isDarkMode ? '#FFFFFF' : '#000000',
  };

  const applyFilters = () => {

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


  useEffect(() => {
    setFiltersTemp({ ...filters });
  }, [filters]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,

    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Sfondo semi-trasparente
      justifyContent: 'center', // Posiziona il contenuto in basso
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
      shadowColor: '#000',
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
    filterLabel: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
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
    filterValue: {
      fontSize: 16,
      color: '#555',
      textAlign: 'right',
      marginRight: 8,
      flex: 1,
    },
    slider: {
      width: '100%',
      height: 40,
      marginTop: 10,
    },
    buttonContainer: {
      flexDirection: 'row',
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
    applyButton: {
      backgroundColor: colors.buttonBackground,
      borderBottomRightRadius: 20,
      borderLeftWidth: 0.5,
      borderTopWidth: 1,
      borderColor: 'white',
    },
    buttonText: {
      fontSize: 16,
      color: colors.text,
    },
    applyButtonText: {
      color: colors.text,
      fontWeight: 'bold',
    },
    headerText: {
      color: colors.text,
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
  });

  // Funzione per aprire il picker location
  const handlePickerLocation = () => {
    setShowPickerLocation(!showPickerLocation);
    setShowPickerEventType(false);
  };

  //funzione per aprire/chiudere picker event type
  const handlePickerEventType = () => {
    setShowPickerEventType(!showPickerEventType);
    setShowPickerLocation(false);
  }

  const handleToggleLocalLegend = () => {
    setFiltersTemp({ ...filtersTemp, localLegend: !filtersTemp.localLegend });
  };

  const handleEventTypeChange = (value: any) => {
    setFiltersTemp({ ...filtersTemp, eventType: value });
  };

  const handleMaxPeopleChange = (value: any) => {
    setFiltersTemp({ ...filtersTemp, maxPeople: value });
  };

  const handleLocationChange = (value: any) => {
    setFiltersTemp({ ...filtersTemp, location: value });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleApply = () => {
    console.log('Filters applied');
    setFilters(filtersTemp);
    applyFilters();
    setIsModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity onPress={() => setIsModalVisible(true)}>
        <IconSymbol
          size={28}
          name="line.3.horizontal.decrease"
          color={colorScheme === 'dark' ? '#FFF' : '#000'}
        />
      </TouchableOpacity>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.overlay}>

          <View style={styles.modal}>

            <Text style={styles.headerText}>Filter</Text>

            {/* Local Legend Filter */}
            <View style={styles.card}>
              <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>Local Legend</Text>
                <Switch
                  value={filtersTemp.localLegend}
                  onValueChange={handleToggleLocalLegend}
                />
              </View>
            </View>

            {/* Event Type Filter */}
            <View style={styles.card}>
              <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>Event Type</Text>
                <TouchableOpacity
                  style={styles.clickableArea}
                  onPress={handlePickerEventType}
                >
                  {Platform.OS === 'ios' && <View style={styles.row}>
                    <Text style={styles.filterValue}>{filtersTemp.eventType || 'Select...'}</Text>
                    <IconSymbol size={16} name="chevron.right" color={colorScheme === 'dark' ? '#FFF' : '#000'} />
                  </View>}
                </TouchableOpacity>
              </View>
              {((showPickerEventType && Platform.OS === 'ios') || Platform.OS === 'android') &&
                (<Picker
                  selectedValue={filtersTemp.eventType}
                  onValueChange={handleEventTypeChange}
                >
                  <Picker.Item label="All" value="" />
                  <Picker.Item label="Social" value="Social" />
                  <Picker.Item label="Sport" value="Sport" />
                  <Picker.Item label="Adventure" value="Adventure" />
                  <Picker.Item label="Cultural" value="Cultural" />
                </Picker>
                )}
            </View>

            {/* Max People Filter */}
            <View style={styles.card}>
              <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>Max People</Text>
                <Text style={styles.filterValue}>{filtersTemp.maxPeople}</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={99}
                minimumTrackTintColor="black"
                maximumTrackTintColor="#ddd"
                step={1}
                value={filtersTemp.maxPeople}
                onValueChange={handleMaxPeopleChange}
              />
            </View>

            {/* Location Filter */}
            <View style={styles.card}>
              <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>Location Type</Text>
                <TouchableOpacity
                  style={styles.clickableArea}
                  onPress={handlePickerLocation}
                >
                  {Platform.OS === 'ios' && <View style={styles.row}>
                    <Text style={styles.filterValue}>{filtersTemp.location || 'Select...'}</Text>
                    <IconSymbol size={16} name="chevron.right" color={colorScheme === 'dark' ? '#FFF' : '#000'} />
                  </View>}
                </TouchableOpacity>
              </View>
              {((showPickerLocation && Platform.OS === 'ios') || Platform.OS === 'android') && (
                <Picker
                  selectedValue={filtersTemp.location}
                  onValueChange={handleLocationChange}
                >
                  <Picker.Item label="Everywhere" value="" />
                  <Picker.Item label="Outside" value="Outside" />
                  <Picker.Item label="Inside" value="Inside" />
                </Picker>
              )}
            </View>

            {/* Bottoni in Fondo */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.applyButton]} onPress={handleApply}>
                <Text style={[styles.buttonText, styles.applyButtonText]}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}