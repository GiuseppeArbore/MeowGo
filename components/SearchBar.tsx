import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { Link } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAppContext } from '@/app/_layout';
import { formatDateTime } from '@/hooks/dateFormat';

export function SearchBar() {
    const { searchFilters } = useAppContext();
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';


    

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
                {formatDateTime(searchFilters.date)}
            </Text>
            <Link href="/search">
                <IconSymbol size={20} name="magnifyingglass" color={isDarkMode ? '#FFF' : '#000'} />
            </Link>
        </TouchableOpacity>
    )
}