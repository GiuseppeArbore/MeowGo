import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { Link } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAppContext } from '@/app/_layout';

export function SearchBar() {
    const { searchFilters } = useAppContext();
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';


    // Funzione per determinare se la data è oggi o domani
    const formatDate = (date: Date) => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString(); // Fallback al formato normale
        }
    };

    const styles = StyleSheet.create({
        fakeSearchBar: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDarkMode ? '#333' : '#e3e3e4',
            borderRadius: 20,
            paddingHorizontal: 10,
            marginLeft: 10,
            height: 40,
        },
        cityText: {
            fontSize: 16,
            fontWeight: 'bold',
            marginRight: 5,
            color: isDarkMode ? '#FFF' : '#000',
        },
        dateTimeText: {
            flex: 1,
            fontSize: 14,
            textAlign: 'center',
            color: isDarkMode ? '#FFF' : '#000',
        },
    });

    return (
        <TouchableOpacity style={styles.fakeSearchBar} onPress={() => console.log('Bar clicked!')}>
            <Text style={styles.cityText}>{searchFilters.city}</Text>
            <Text style={styles.dateTimeText}>
                {formatDate(searchFilters.date)} {'-'} {searchFilters.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            <Link href="/search">
                <IconSymbol size={20} name="magnifyingglass" color={isDarkMode ? '#FFF' : '#000'} />
            </Link>
        </TouchableOpacity>
    )
}