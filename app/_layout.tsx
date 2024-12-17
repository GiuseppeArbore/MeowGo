import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import * as SQLite from 'expo-sqlite';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SQLiteProvider, useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import { useEffect, useState, Suspense } from 'react';
import { View, Text, StyleSheet } from 'react-native';



// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const colorScheme = useColorScheme();
  useEffect(() => {
    async function fetchData() {
      const db = await SQLite.openDatabaseAsync('db.db');
      const allUsers = await db.getAllAsync('SELECT * FROM users');
      console.log(allUsers);
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
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Suspense fallback={<View style={StyleSheet.absoluteFill}><Text>Loading...</Text></View>}>
        <SQLiteProvider databaseName="test.db" useSuspense>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </SQLiteProvider>
      </Suspense>
    </ThemeProvider>
  );
}
