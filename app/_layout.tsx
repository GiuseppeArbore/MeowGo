import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SQLiteProvider, useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState, Suspense, useContext, createContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';


import { DATABASE_NAME } from '../utils/database';
import { Event } from '../components/models/event';
import { User } from '../components/models/user';
import {migrateDbIfNeeded } from '../utils/database';


const defaultUser: User = new User("Peppe", "password", "Giuseppe", "Arbore", new Date(2001, 10, 11), ["Turin", "Bari"], 10);

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
  //const [user, setUser] = useState<User | null>(defaultUser); //per testing iniziale
  const [user, setUser] = useState<User | null>(null); //per testing con login


  const colorScheme = useColorScheme();


  useEffect(() => {
    async function fetchData() {
      const db: SQLite.SQLiteDatabase = await SQLite.openDatabaseAsync(DATABASE_NAME);
      setDb(db);
      const users = await db.getAllAsync('SELECT * FROM users');
      const events = await db.getAllAsync('SELECT * FROM events');
      setAllUsers(users.map((user: any) => new User(user.username, user.password, user.name, user.surname, user.birthdate)));
      setAllEvents(events.map((event: any) => new Event(event.name, event.location, event.latitude, event.longitude, event.date, event.description, event.hour, event.max_people, event.creator, event.place, event.local_legend_here, event.secret_code, event.type, event.city)));
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
