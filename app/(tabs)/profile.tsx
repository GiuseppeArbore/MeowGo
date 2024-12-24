import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme, Dimensions, Image, TouchableOpacity, Modal, TextInput } from 'react-native';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { useRouter } from 'expo-router'; // Importa il router
import { FontAwesome } from '@expo/vector-icons'; // Importa l'icona FontAwesome
import DateTimePicker from '@react-native-community/datetimepicker';
const DATABASE_NAME = 'test.db';

const loadDatabase = async () => {
  const dbPath = `${FileSystem.documentDirectory}SQLite/${DATABASE_NAME}`;

  // Controlla se il database esiste già nella sandbox dell'app
  const dbExists = await FileSystem.getInfoAsync(dbPath);
  
  if (dbExists.exists) {
    console.log('Eliminazione del database esistente...');
    await FileSystem.deleteAsync(dbPath, { idempotent: true });
  }
  
  if (!dbExists.exists) {
    // Copia il file .db dalla cartella assets alla sandbox dell'app
    console.log('Copia del database preesistente...');
    const asset = Asset.fromModule(require('../../assets/test.db'));
    console.log('Percorso del database:', dbPath);
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


const ProfileScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const router = useRouter();

  // Stati per gestire i valori recuperati dal database
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [localLegends, setLocalLegends] = useState<string[]>([]);
  const [taralli, setTaralli] = useState<number | null>(null);
  // Stato per la gestione della visibilità del Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [inputText, setInputText] = useState('');

  const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDatePicker = () => {
        setShowDatePicker(true);
      };

  const screenHeight = Dimensions.get('window').height;
  const headerHeight = screenHeight * 0.1; // Adjust as necessary for the notification bar
  const contentPaddingTop = screenHeight * 0.01; // Adjust as necessary for header gap

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('fetching data');
        const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
        console.log('db opened');
        // voglio stampare la lista delle tabelle presenti nel db
        console.log(db.databasePath)
        const user = await db.getAllAsync('SELECT * FROM users WHERE username = ?', ['Peppe']);  //Per ora prendiamo manualmente quando avremo il login lo prendiamo veramente
        console.log('all users fetched');
        console.log(user);
        
        setFirstName((user as { name: string }[]).map((user) => user.name).join(', '));
        setLastName((user as { surname: string }[]).map((user) => user.surname).join(', '));
        setDateOfBirth((user as { birth: string }[]).map((user) => user.birth).join(', '));
        setTaralli((user as { taralli: number }[]).map((user) => user.taralli)[0] );
        // Recupera le città per cui l'utente è una Local Legend
        const cities = await db.getAllAsync('SELECT city FROM users_ll_for WHERE username = ?', [(user[0] as { username: string }).username]);
        setLocalLegends((cities as { city: string }[]).map((item) => item.city));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    
    fetchData();
  }, []);

  const styles = createStyles(isDarkMode, contentPaddingTop, headerHeight);
   // Funzione per mostrare il Modal
   const showModal = () => {
    setModalVisible(true);
  };

  // Funzione per nascondere il Modal
  const hideModal = () => {
    setModalVisible(false);
  };
  return (
    <View style={{ flex: 1 }}>
      {/* Header posizionato fuori dallo ScrollView */}
      <View style={styles.header}>
      <Text style={styles.title}>Profile</Text>
        <TouchableOpacity style={styles.taralliContainer} onPress={showModal}>
          <Image
            source={require('@/assets/images/tarallo.png')}
            style={styles.taralloIcon}
          />
          <View style={styles.tarallo}>
            <Text style={styles.taralloText}>{taralli}</Text>
          </View>
        </TouchableOpacity>
        
      </View>

  
      {/* Contenitore scrollabile */}
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>First Name</Text>
          <Text style={styles.value}>{firstName}</Text>
  
          <Text style={styles.label}>Last Name</Text>
          <Text style={styles.value}>{lastName}</Text>
  
          <Text style={styles.label}>Date of Birth</Text>
          <Text style={styles.value}>{dateOfBirth}</Text>

          <View >
                    <Text style={styles.label}>Date:</Text>
                    <TouchableOpacity onPress={handleDatePicker}>
                        <Text style={styles.input}>
                            {selectedDate.toLocaleDateString()}
                        </Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={selectedDate}
                            mode="date"
                            display = "default" //for iOS style
                        />
                    )}
      </View>
  
          {localLegends.length > 0 ? (
            <>
              <Text style={styles.label}>Local Legends Cities</Text>
              {localLegends.map((city, index) => (
                <View key={index} style={styles.legendItem}>
                  {city === 'Bari' ? (
                    <FontAwesome
                      name="anchor"
                      style={styles.iconCity}
                      color={styles.iconColor.color}
                    />
                  ) : city === 'Torino' ? (
                    <FontAwesome
                      name="cloud"
                      style={styles.iconCity}
                      color={styles.iconColor.color}
                    />
                  ) : (
                    <FontAwesome
                      name="map-marker"
                      style={styles.iconCity}
                      color={styles.iconColor.color}
                    />
                  )}
                  <Text style={styles.valueCity}>{city}</Text>
                </View>
              ))}
            </>
          ) : (
            <Text style={styles.noLegendMessage}>
              You're not a Local Legend yet
            </Text>
          )}
        </View>
  
        <View
          style={styles.buttonContainer}
          onTouchEnd={() => router.push('../pages/QuizScreen')}
        >
          {localLegends.length > 0 ? (
            <Text style={styles.button}>
              Become a Local Legend{'\n'}for another city
            </Text>
          ) : (
            <Text style={styles.button}>Become a Local Legend</Text>
          )}
        </View>
      </ScrollView>
  
      {/* Modal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={hideModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              editable={false}
              multiline={true}
              value="I taralli sono una moneta che puoi collezionare tramite la partecipazione agli eventi.
              Ogni evento a cui partecipi ottieni un tarallo.
              Più taralli hai, più amici avrai!"
            />
            <TouchableOpacity style={styles.closeButton} onPress={hideModal}>
              <Text style={styles.closeButtonText}>Chiudi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
  
};

export default ProfileScreen;

const createStyles = (isDarkMode: boolean, contentPaddingTop: number, headerHeight: number) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: isDarkMode ? '#000' : '#A1CEDC',
      padding: 16,
      marginTop: headerHeight, // Aggiungi margine per lasciare spazio all'heade
    },
    header: {
      height: headerHeight,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      position: 'absolute', // Posizionato sopra il contenuto principale
      top: 0, // Allineato alla parte superiore
      left: 0,
      right: 0,
      backgroundColor: isDarkMode ? '#000' : '#A1CEDC', // Sfondo dinamico
      zIndex: 10, // Garantisce che l'header rimanga sopra
      paddingVertical: 10, // Margine interno verticale
      textAlign: 'center', // Allineamento del titolo
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#fff',
      alignItems: 'center', // Nuova proprietà per centrare la scritta
      justifyContent: 'center', // Nuova proprietà per centrare la scritta
      marginLeft: 10, // Aggiunto margine a sinistra del titolo
      marginTop: headerHeight*0.5, // Aggiunto margine sopra il titolo
    },
    taralloIcon: {
      width: 20,
      height: 25,
      marginRight: 6,
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
      flexDirection: 'row',
      alignItems: 'center',
    },
    valueCity: {
      backgroundColor: isDarkMode ? '#333' : '#F0F0F0', // Colore dinamico
      borderRadius: 4,
      padding: 12,
      fontSize: 16,
      color: isDarkMode ? '#fff' : '#000', // Testo dinamico
      marginBottom: 16,
      borderWidth: 1,
      borderColor: isDarkMode ? '#444' : '#ccc', // Colore dinamico
      flexDirection: 'row',
      alignItems: 'center',
      width: '92%', // Larghezza fissa per la città 
    },
    noLegendMessage: {
      fontSize: 20, // Font più grande
      textAlign: 'center', // Testo centrato orizzontalmente
      padding: 16, // Margine interno per distanziarlo dal bordo
      color: isDarkMode ? '#aaa' : '#555', // Colore dinamico
      backgroundColor: isDarkMode ? '#333' : '#F0F0F0', // Sfondo dinamico
      borderRadius: 8, // Bordo arrotondato
      borderWidth: 1,
      borderColor: isDarkMode ? '#444' : '#ccc', // Bordo dinamico
    },
    tarallo: {
      backgroundColor: isDarkMode ? '#444' : '#1E90FF', // Colore dinamico
      borderRadius: 16,
      width: 32,
      height: 32,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 3,
      borderWidth: 1,
      borderColor: isDarkMode ? '#444' : '#ccc', // Colore dinamico del bordo
    },
    taralloText: {
      fontSize: 16,
      color: isDarkMode ? '#fff' : '#fff',
      textAlign: 'left',
    },
    taralliContainer: {
      flexDirection: 'row',
      alignItems: 'center', // Allineato verticalmente al centro
      justifyContent: 'flex-start', // Allineato orizzontalmente al centro
      borderRadius: 8, // Bordo arrotondato come gli altri container
      padding: 12, // Padding per uniformare l'aspetto
      backgroundColor: isDarkMode ? '#222' : '#fff', // Colore dinamico
      shadowColor: '#000', // Colore della ombra
      shadowOffset: { width: 0, height: 2 }, // Offset della ombra
      shadowOpacity: 0.1, // Opacità della ombra
      shadowRadius: 4, // Raggio della ombra
      elevation: 3, // Elevazione per la ombra
      marginTop: headerHeight*0.5, // Un po' di spazio sopra l'icona e il numero
      height: 40, // Altezza fissa per il container
      marginLeft: 10, // Aggiunto margine a sinistra
    },
    buttonContainer: {
      backgroundColor: isDarkMode ? '#002244' : '#002244', // Colore dinamico
      borderRadius: 8,
      overflow: 'hidden',
      alignItems: 'center',
      padding: 12,
    },
    button: {
      fontSize: 18,
      fontWeight: '600',
      color: isDarkMode ? '#fff' : '#fff',
      textAlign: 'center',
      width: 'auto', // Larghezza fissa del bottone
      flexShrink: 1, // Riduce la larghezza se è più larga dello spazio disponibile
      paddingHorizontal: 20, // Aggiunto per un margine orizzontale

    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8, // Per separare un po' gli elementi
    },
    iconColor: {
      color: isDarkMode ? '#ddd' : '#333', // Colore dinamico
      
    },
    iconCity: {
      fontSize: 20,
      marginRight: 8,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Sfondo semi-trasparente per il Modal
    },
  
    modalContent: {
      width: '80%', // Larghezza relativa del Modal
      padding: 20,
      backgroundColor: isDarkMode ? '#222' : '#FFF',
      borderRadius: 8,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
  
    input: {
      width: '100%',
      padding: 10,
      borderColor: isDarkMode ? '#444' : '#CCC',
      borderWidth: 1,
      borderRadius: 4,
      marginBottom: 15,
      color: isDarkMode ? '#FFF' : '#000',
    },
  
    closeButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: isDarkMode ? '#555' : '#EEE',
      borderRadius: 4,
      alignItems: 'center',
      width: '60%',
    },
  
    closeButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: isDarkMode ? '#FFF' : '#000',
    },
  });
