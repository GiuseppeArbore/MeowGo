import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import * as SQLite from 'expo-sqlite';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SQLiteProvider, useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import { useEffect, useState, Suspense, useContext, createContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

import { Event } from '../components/models/event';
import { User } from '../components/models/user';




export const DATABASE_NAME = "mydb.db";

export const loadDatabase = async () => {
  const dbPath = `${FileSystem.documentDirectory}SQLite/${DATABASE_NAME}`;

  // Controlla se il database esiste già
  const dbExists = await FileSystem.getInfoAsync(dbPath);

  if (dbExists.exists) {
    // Copia il file .db dalla cartella assets alla sandbox dell'app
    console.log('Copia del database preesistente...');
    const asset = Asset.fromModule(require('../assets/mydb.db'));
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

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
    const DATABASE_VERSION = 3;
    let result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
    //let currentDbVersion = result ? result.user_version : 0;
    let currentDbVersion = 0;
    if (currentDbVersion >= DATABASE_VERSION) {
      console.log('Database is up to date, version:', currentDbVersion);
      currentDbVersion = 1;
      return;
    }
  
    if (currentDbVersion === 0) {
      console.log('Migrating to version 1');
  
      await db.execAsync(`
        PRAGMA journal_mode = 'wal';
        DROP TABLE IF EXISTS "users";
        DROP TABLE IF EXISTS "events";
        DROP TABLE IF EXISTS "users_ll_for";
        DROP TABLE IF EXISTS "users_events";
        DROP TABLE IF EXISTS "todos";
        CREATE TABLE "users" (
          "username"	TEXT NOT NULL,
          "password"	TEXT NOT NULL,
          "name"	TEXT NOT NULL,
          "surname"	TEXT NOT NULL,
          "birthdate"	TEXT NOT NULL,
          "taralli"	INTEGER NOT NULL,
          PRIMARY KEY("username")
        );
        CREATE TABLE "events" (
          "name"	TEXT NOT NULL,
          "location"	TEXT NOT NULL,
          "latitude"	TEXT NOT NULL,
          "longitude"	TEXT NOT NULL,
          "date"	TEXT NOT NULL,
          "hour"	TEXT NOT NULL,
          "max_people"	INTEGER NOT NULL,
          "creator"	TEXT NOT NULL,
          "place"	TEXT NOT NULL,
          "local_legend_here"	TEXT NOT NULL,
          "secret_code"	INTEGER NOT NULL,
          "type"	TEXT NOT NULL,
          "city"	TEXT NOT NULL,
          "ended"	TEXT,
          PRIMARY KEY("name"),
          FOREIGN KEY("creator") REFERENCES "users"("username") ON DELETE CASCADE
        );
        CREATE TABLE "users_ll_for" (
          "username"	TEXT NOT NULL,
          "city"	TEXT NOT NULL,
          PRIMARY KEY("username","city"),
          FOREIGN KEY("username") REFERENCES "users"("username") ON DELETE CASCADE
        );
        CREATE TABLE "users_events" (
          "user"	TEXT NOT NULL,
          "event"	TEXT NOT NULL,
          PRIMARY KEY("user","event"),
          FOREIGN KEY("event") REFERENCES "events"("name") ON DELETE CASCADE,
          FOREIGN KEY("user") REFERENCES "users"("username") ON DELETE CASCADE
        );
      `);
  
      //await db.runAsync('INSERT INTO todos (value, intValue) VALUES (?, ?)', 'hello', 1);
      await db.runAsync(`INSERT INTO "users" ("username","password","name","surname","birthdate","taralli")
        VALUES ('Peppe','password','Giuseppe','Arbore','2001-10-11',10),
                ('Caca','password','Claudia','Maggiulli','2002-03-26',0),
                ('Pio','password','Michele Pio','Mucci','1999-12-26',3);
      `);
      await db.runAsync(`INSERT INTO "events" ("name","location","latitude","longitude","date","hour","max_people","creator","place","local_legend_here","secret_code","type","city","ended") 
        VALUES ('Boat trip','Murazzi','45.05985','7.692342','23-12-2024','16:00',10,'Peppe','Outside','true',13,'Adventure','Turin',NULL),
            ('Karaoke & Beer','Il Cantinone','45.064005','7.694438','2025-01-22','20:00',8,'Peppe','Inside','true',45,'Social','Turin','');  
      `);
  
      await db.runAsync(`INSERT INTO "users_ll_for" ("username","city")
        VALUES ('Peppe','Turin'),
              ('Caca','Turin'),
              ('Caca','Bari');
      `);
      await db.runAsync(`INSERT INTO "users_events" ("user","event")
        VALUES ('Peppe','Boat trip'),
              ('Peppe','Karaoke & Beer'),
              ('Caca','Boat trip');
               ('Pio','Karaoke & Beer');
  
      `);
  
  
      await loadDatabase();
  
      currentDbVersion = 1;
    }
    else if (currentDbVersion === 1) {
      console.log('Migrating to version 2');
      await loadDatabase();
      currentDbVersion = 2;
    }
    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
  
    try {
      const result = await db.getAllAsync<{ name: string }>("SELECT name FROM sqlite_master WHERE type='table';");
      console.log('Your Tables are:', result.map((table) => table.name));
      result.forEach((table) => {
         //se volete stampare i tipi di ogni colonna
         /*
        const columns =
          db.getAllAsync<{ name: string, type: string }>(`PRAGMA table_info(${table.name});`).then(columns => {
            console.log(`\n COLUMNS OF TABLE ${table.name}:`);
            columns.forEach(column => {
              console.log(`\t Column: ${column.name}, Type: ${column.type}`);
            });
          });
         */
        db.getAllAsync(`SELECT * FROM ${table.name};`).then(values => {
          values.forEach(value => {
            console.log(`Table ${table.name} \t Value:`, value);
          });
        });
  
  
      });
    } catch (error) {
      console.error('Error listing tables:', error);
    }
  }