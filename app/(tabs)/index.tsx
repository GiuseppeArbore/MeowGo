
import React, { useEffect, useState } from 'react';
import { Button, Image, StyleSheet, Text, View, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
const DATABASE_NAME = 'mydb.db';

export default function HomeScreen() {

  
  const loadDatabase = async () => {
    const dbPath = `${FileSystem.documentDirectory}SQLite/${DATABASE_NAME}`;
  
    // Controlla se il database esiste già
    const dbExists = await FileSystem.getInfoAsync(dbPath);
  
    if (!dbExists.exists) {
      // Copia il file .db dalla cartella assets alla sandbox dell'app
      console.log('Copia del database preesistente...');
      const asset = Asset.fromModule(require('../../assets/mydb.db'));
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

  interface Event {
    name: string;
    location: string;
    date: string;
    hour: string;
    max_people: number;
    place: string;
    local_legend_here: boolean;
    type: string;
    city: string;
  }

  const [tableData, setTableData] = useState<Event[]>([]);

  const fetchEvents = async () => {
    try {
      console.log('Opening database...');
      const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
      console.log('Database opened.');

      const events: Event[] = []; // Inizializza un array per accumulare gli eventi

      const results= await db.getAllAsync('SELECT name, location, date, hour, max_people, place, local_legend_here, type, city FROM events', []);
        
     
      results.forEach((row: any) => {
          events.push({
            name: row.name,
            location: row.location,
            date: row.date,
            hour: row.hour,
            max_people: row.max_people,
            place: row.place,
            local_legend_here: row.local_legend_here,
            type: row.type,
            city: row.city,
          });
    });

      // Log per controllare i dati recuperati
      console.log('Fetched Events:', results);

      // Imposta lo stato con gli eventi accumulati
      setTableData(events);
    
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      padding:40

    },
    item: {
      padding: 10,
      marginBottom: 10,
      backgroundColor: '#f9f9f9',
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#ddd',
    },
    name: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    details: {
      fontSize: 14,
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Event List</Text>
      <FlatList
        data={tableData}
        keyExtractor={(item) => item.name} // Assumendo che "name" sia unico
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.details}>
              Location: {item.location}, Date: {item.date}, Hour: {item.hour}
            </Text>
            <Text style={styles.details}>
              Max People: {item.max_people}, Type: {item.type}, City: {item.city}
            </Text>
          </View>
        )}
      />
    </View>
  );
};



