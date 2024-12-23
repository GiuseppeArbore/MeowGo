import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import QuizScreen from './pages/QuizScreen'; import * as SQLite from 'expo-sqlite';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SQLiteProvider, useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import { useEffect, useState, Suspense } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { DATABASE_NAME } from '../utils/database';
import { Event } from '../components/models/event';
import { User } from '../components/models/user';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [myEvents, setMyEvents] = useState<String[]>([]); //id degli eventi a cui partecipo


  const colorScheme = useColorScheme();


  useEffect(() => {
    async function fetchData() {
      const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
      const users = await db.getAllAsync('SELECT * FROM users');
      /*
     
      console.log(allUsers);
      console.log(allEvents);
      */
    }
    fetchData();
  }, []);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;  //capire se serve
  }


  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Suspense fallback={<View style={StyleSheet.absoluteFill}><Text>Loading...</Text></View>}>
        <SQLiteProvider databaseName={DATABASE_NAME} onInit={migrateDbIfNeeded} useSuspense >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
            <Stack.Screen name="filter" options={{ presentation: 'transparentModal', headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </SQLiteProvider>
      </Suspense>
    </ThemeProvider>
  );
}


async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  let result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let currentDbVersion = result ? result.user_version : 0;
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }
  if (currentDbVersion === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      CREATE TABLE todos (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, intValue INTEGER);
    `);
    console.log('Created table todos');
    await db.runAsync('INSERT INTO todos (value, intValue) VALUES (?, ?)', 'hello', 1);
    await db.runAsync('INSERT INTO todos (value, intValue) VALUES (?, ?)', 'world', 2);
    console.log('Inserted some todos');
    currentDbVersion = 1;
  }
  if (currentDbVersion === 1) {
    console.log('Migrating to version 2');
  }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);

  try {
    const result = await db.getAllAsync<{ name: string }>("SELECT name FROM sqlite_master WHERE type='table';");
    result.forEach((table) => {
      console.log('TABLE:', table.name);
      /* se volete stampare i tipi di ogni colonna
      const columns =
        db.getAllAsync<{ name: string, type: string }>(`PRAGMA table_info(${table.name});`).then(columns => {
          columns.forEach(column => {
            console.log(`Column: ${column.name}, Type: ${column.type}`);
          });
        });
        */
      const values = db.getAllAsync(`SELECT * FROM ${table.name};`).then(values => {
        values.forEach(value => {
          console.log('Value:', value);
        });
      });


    });
    // Puoi accedere a result per ottenere un array con i nomi delle tabelle
  } catch (error) {
    console.error('Error listing tables:', error);
  }
}
