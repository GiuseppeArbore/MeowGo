import { StyleSheet, Text, View, Switch, TouchableOpacity, useColorScheme, TouchableWithoutFeedback, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import Slider from '@react-native-community/slider';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useNavigation } from '@react-navigation/native';

export default function Filter() {
  const [isLocalLegendEnabled, setIsLocalLegendEnabled] = useState(false);
  const [eventType, setEventType] = useState(null);
  const [maxPeople, setMaxPeople] = useState(1);
  const [location, setLocation] = useState(null);
  const [showPickerLocation, setShowPickerLocation] = useState(false);
  const [showPickerEventType, setShowPickerEventType] = useState(false);
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

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

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleApply = () => {
    console.log('Filters applied');
    navigation.goBack();
  };

  return (
    <TouchableWithoutFeedback onPress={() => {
      if (!showPickerLocation && !showPickerEventType) {
        navigation.goBack();
      }
    }}>
      <View style={styles.overlay}>

        <View style={styles.modal}>

          <Text style={styles.headerText}>Filter</Text>

          {/* Local Legend Filter */}
          <View style={styles.card}>
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Local Legend</Text>
              <Switch
                value={isLocalLegendEnabled}
                onValueChange={setIsLocalLegendEnabled}
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
                  <Text style={styles.filterValue}>{eventType || 'Select...'}</Text>
                  <IconSymbol size={16} name="chevron.right" color={colorScheme === 'dark' ? '#FFF' : '#000'} />
                </View>}
              </TouchableOpacity>
            </View>
            {((showPickerEventType && Platform.OS === 'ios') || Platform.OS === 'android') &&
              (<Picker
                selectedValue={eventType}
                onValueChange={(itemValue) => {
                  setEventType(itemValue === "Select..." ? null : itemValue);
                }}
              >
                <Picker.Item label="Select..." value="Select..." />
                <Picker.Item label="Social" value="Fun" />
                <Picker.Item label="Sport" value="Karaoke" />
                <Picker.Item label="Adventure" value="Run" />
                <Picker.Item label="Cultural" value="Karate" />
              </Picker>
              )}
          </View>

          {/* Max People Filter */}
          <View style={styles.card}>
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Max People</Text>
              <Text style={styles.filterValue}>{maxPeople}</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={99}
              minimumTrackTintColor="black"
              maximumTrackTintColor="#ddd"
              step={1}
              value={maxPeople}
              onValueChange={(value) => setMaxPeople(value)}
            />
          </View>

          {/* Location Filter */}
          <View style={styles.card}>
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Location</Text>
              <TouchableOpacity
                style={styles.clickableArea}
                onPress={handlePickerLocation}
              >
                {Platform.OS === 'ios'&&<View style={styles.row}>
                  <Text style={styles.filterValue}>{location || 'Select...'}</Text>
                  <IconSymbol size={16} name="chevron.right" color={colorScheme === 'dark' ? '#FFF' : '#000'} />
                </View>}
              </TouchableOpacity>
            </View>
            {((showPickerLocation && Platform.OS === 'ios') || Platform.OS === 'android') && (
              <Picker
                selectedValue={location}
                onValueChange={(itemValue) => {
                  setLocation(itemValue === "Select..." ? null : itemValue);
                }}
              >
                <Picker.Item label="Select..." value={"Select..."} />
                <Picker.Item label="Everywhere" value="Everywhere" />
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
    </TouchableWithoutFeedback>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Sfondo semi-trasparente
    justifyContent: 'center', // Posiziona il contenuto in basso
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
  filterLabel: {
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
  pickerContainer: {
    width: '100%',
        backgroundColor: '#EFEFF0',
        alignItems: 'center',
        borderRadius: 20,
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
  applyButton: {
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
  applyButtonText: {
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});