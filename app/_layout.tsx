import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SQLiteProvider, useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState, Suspense, useContext, createContext, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { DATABASE_NAME } from '../utils/database';
import { Event } from '../components/models/event';
import { User } from '../components/models/user';
import {migrateDbIfNeeded } from '../utils/database';
import { dismissBrowser } from 'expo-web-browser';


export interface SearchFilters {
  city: string,
  date: string
}

const defaultSearchFilters: SearchFilters = {
  city: 'Turin',
  date: new Date().toISOString(),
};

export type Filters = {
  localLegend: boolean;
  eventType: string | null;
  maxPeople: number;
  location: string | null;
};

// Default filters
const defaultFilters: Filters = {
  localLegend: false,
  eventType: null,
  maxPeople: 99,
  location: null,
};

export type RootStackParamList = {
  Home: undefined;
  search: undefined;
};


export const AppContext = createContext<{
  allEvents: Event[];
  allUsers: User[];
  myEvents: string[];
  setMyEvents: (events: string[]) => void;
  user: User | null; // null se non loggato  
  setUser: (users: User) => void;
  db: SQLite.SQLiteDatabase;
  filters: Filters; // Aggiunto filters
  setFilters: (filters: Filters) => void;
  searchFilters: SearchFilters;
  setSearchFilters: (searchFilters: SearchFilters) => void;
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
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>(defaultSearchFilters);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [myEvents, setMyEvents] = useState<string[]>([]); //id degli eventi a cui partecipo
  const [db, setDb] = useState<SQLite.SQLiteDatabase | undefined>(undefined);
  const [user, setUser] = useState<User | null>(null); //lo carico dal db al primo accesso
  const [local_legend_for, setLocal_legend_for] = useState<string[]>([]);


  const colorScheme = useColorScheme();


  useMemo(() => {

    async function fetchData() {
      const db: SQLite.SQLiteDatabase = await SQLite.openDatabaseAsync(DATABASE_NAME);
      setDb(db);
      const users: User[] = await db.getAllAsync('SELECT * FROM users');
      const events : Event[] = await db.getAllAsync('SELECT * FROM events');
      const defaultUserRes = await db.getFirstAsync('SELECT * FROM users WHERE username = ?', ['Peppe']) as { username: string, password: string, name: string, surname: string, birthdate: string, taralli: number };
      
      setLocal_legend_for((await db.getAllAsync('SELECT city FROM users_ll_for WHERE username = ?', ['Peppe'])).map((city: any) => city.city));
      
      const defaultUser = new User(defaultUserRes.username, defaultUserRes.password, defaultUserRes.name, defaultUserRes.surname, new Date(defaultUserRes.birthdate), local_legend_for, defaultUserRes.taralli);

      const eventsJoined : string[] = (await db.getAllAsync('SELECT event FROM users_events WHERE user = ?', ['Peppe'])).map((ev: any) => ev.event);
      setMyEvents(eventsJoined);

      setAllUsers(users.map((user: any) => new User(user.username, user.password, user.name, user.surname, user.birthdate)));
      setAllEvents(events.map((event: any) => new Event(event.name, event.location, event.latitude, event.longitude, event.date, event.description, event.hour, event.max_people, event.creator, event.place, event.local_legend_here, event.secret_code, event.type, event.ended,event.city)));
      setUser(defaultUser);
    }

    if (!user){
      fetchData();
    } 
  }, [local_legend_for]);

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
    <AppContext.Provider value={{allEvents, allUsers, myEvents, setMyEvents, user, setUser, db: db!, filters, setFilters, searchFilters, setSearchFilters}}>

      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Suspense fallback={<View style={StyleSheet.absoluteFill}><Text>Loading...</Text></View>}>
          <SQLiteProvider databaseName={DATABASE_NAME} onInit={migrateDbIfNeeded} useSuspense >
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} initialParams={{ allEvents, allUsers, myEvents }}
              />
              <Stack.Screen name="eventPageDetails" initialParams={{ eventId: null }} />
              <Stack.Screen name="discounts" />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </SQLiteProvider>
        </Suspense>
      </ThemeProvider>
    </AppContext.Provider>

  );
}
