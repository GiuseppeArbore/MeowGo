import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import QuizScreen from './pages/QuizScreen'; import * as SQLite from 'expo-sqlite';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SQLiteProvider, useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import { useEffect, useState, Suspense, useContext, createContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { DATABASE_NAME } from '../utils/database';
import { Event } from '../components/models/event';
import { User } from '../components/models/user';


const defaultUser : User = new User("Peppe", "password", "Giuseppe", "Arbore", new Date(2001, 10, 11), ["Turin", "Bari"], 10);

export const AppContext = createContext<{
  allEvents: Event[];
  allUsers: User[];
  myEvents: String[];
  user: User | null; // null se non loggato  
  setUser: (users: User) => void;
  db: SQLite.SQLiteDatabase;
} | null>(null);

// Exportiamo un hook per semplificare l'uso del contesto
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [myEvents, setMyEvents] = useState<String[]>([]); //id degli eventi a cui partecipo
  const [db, setDb] = useState<SQLite.SQLiteDatabase | undefined>(undefined);
  const [user, setUser] = useState<User | null>(null);

  setUser(defaultUser); //TODO: per ora momentaneo, poi @Caca metti quello che si logga nel momento del login


  const colorScheme = useColorScheme();


  useEffect(() => {
    async function fetchData() {
      const db: SQLite.SQLiteDatabase = await SQLite.openDatabaseAsync(DATABASE_NAME);
      setDb(db);
      const users = await db.getAllAsync('SELECT * FROM users');
      const events = await db.getAllAsync('SELECT * FROM events');
      setAllUsers(users.map((user: any) => new User(user.username, user.password, user.name, user.surname, user.birthdate)));
      setAllEvents(events.map((event: any) => new Event(event.name, event.location, event.latitude, event.longitude, event.date, event.description, event.hour, event.max_people, event.creator, event.place, event.local_legend_here, event.secred_code, event.type, event.string)));
      /*
      setAllUsers(users.map((user: any) => new User(user.username, user.password, user.name, user.surname, user.birthdate)));
      setAllEvents((await db.getAllAsync('SELECT * FROM events')).map((event: any) => new Event(event.name, event.location, event.date, event.location, event.participants, event.maxParticipants, event.creator, event.description, event.category, event.image, event.price, event.duration, event.latitude, event.longitude)));
      console.log(allUsers);
      console.log(allEvents);
      */
      console.log("Utenti che passo per l'app", allUsers);
      console.log("Eventi che passo per l'app", allEvents);
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
    <AppContext.Provider value={{ allEvents, allUsers, myEvents, user, setUser, db: db! }}>

      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Suspense fallback={<View style={StyleSheet.absoluteFill}><Text>Loading...</Text></View>}>
          <SQLiteProvider databaseName={DATABASE_NAME} onInit={migrateDbIfNeeded} useSuspense >
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} initialParams={{ allEvents, allUsers, myEvents }}
              />

              <Stack.Screen name="+not-found" />
              <Stack.Screen name="filter" options={{ presentation: 'transparentModal', headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
          </SQLiteProvider>
        </Suspense>
      </ThemeProvider>
    </AppContext.Provider>

  );
}
/*initialParams={ { allEvents: allEvents, allUsers: allUsers, myEvents:myEvents}}/>*/



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
    console.log('Your Tables are:', result);
    result.forEach((table) => {
      /* se volete stampare i tipi di ogni colonna
      const columns =
        db.getAllAsync<{ name: string, type: string }>(`PRAGMA table_info(${table.name});`).then(columns => {
          console.log(`Columns of table ${table.name}:`);
          columns.forEach(column => {
            console.log(`Column: ${column.name}, Type: ${column.type}`);
          });
        });
        */
      db.getAllAsync(`SELECT * FROM ${table.name};`).then(values => {
        values.forEach(value => {
          console.log(`Table ${table.name} Value:`, value);
        });
      });


    });
  } catch (error) {
    console.error('Error listing tables:', error);
  }
}
