import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Filters, useAppContext } from '@/app/_layout';

// Default filters
const defaultFilters: Filters = {
  localLegend: false,
  eventType: null,
  maxPeople: 1,
  location: null,
}; 


export function FilterChips() {
    const { filters, setFilters } = useAppContext();
    const colorScheme = useColorScheme();
      const isDarkMode = colorScheme === 'dark';

    const filterTextMap: Record<string, string> = {
        localLegend: filters.localLegend ? 'Local Legend' : '',
        maxPeople: filters.maxPeople > 1 ? `< ${filters.maxPeople} people` : '',
        eventType: filters.eventType || '',
        location: filters.location ? `${filters.location}` : '',
    };

    // Handler to reset filter to default
    const handleRemoveFilter = (filterKey: keyof Filters) => {
        console.log("rimozione- filtro: "+ filterKey);
        setFilters((prevFilters) => ({
            ...prevFilters,
            [filterKey]: defaultFilters[filterKey],
        }));
    };

    const styles = StyleSheet.create({
        filterBar: {
            position: 'absolute',
            top: 10,
            left: 0,
            right: 0,
            flexDirection: 'row',
            paddingHorizontal: 10,
            paddingVertical: 5,
            zIndex: 10,
        },
        filterChipContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 5,
        },
        filterChip: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 15,
            paddingVertical: 8,
            borderRadius: 20,
            backgroundColor: isDarkMode ? '#444' : '#ddd',
        },
        filterText: {
            fontSize: 14,
            color: isDarkMode ? '#FFF' : '#000',
            marginRight: 5,
        },
    });

    return (
        <ScrollView
            style={styles.filterBar}
            horizontal
            showsHorizontalScrollIndicator={false}
        >
            {Object.entries(filterTextMap).map(([filterKey, displayText], index) =>
                displayText ? (
                    <View key={index} style={styles.filterChipContainer}>
                        <TouchableOpacity style={styles.filterChip} onPress={() => handleRemoveFilter(filterKey as keyof Filters)}>
                            <Text style={styles.filterText}>{displayText}</Text>
                            <IconSymbol
                                size={14}
                                name="xmark"
                                color={isDarkMode ? '#FFF' : '#000'}
                            />
                        </TouchableOpacity>
                    </View>
                ) : null
            )}
        </ScrollView>
    );
};