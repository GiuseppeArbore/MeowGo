import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assicurati di installare @expo/vector-icons o usare un'altra libreria di icone

const SearchBar = ({ placeholder, onSearch }) => {
  const [searchText, setSearchText] = useState('');
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="#888" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder || 'Cerca...'}
        value={searchText}
        
      />
      {searchText.length > 0 && (
        <TouchableOpacity  style={styles.clearButton}>
          <Ionicons name="close" size={20} color="#888" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 10,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  clearButton: {
    marginLeft: 8,
  },
});

export default SearchBar;