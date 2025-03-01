import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, useColorScheme } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';

const icebreakers = [
  {
    id: '1',
    name: 'Heads Up',
    file: 'headsUp', //inserito nome file gioco collegato
    type: 'Interactive Game',
    rules: 'One player places a card or a phone displaying a word on their forehead without looking at it, while the other players provide clues to help them guess the word before time runs out. Clues can be given in different ways depending on the chosen category—players might describe the word, act it out, use synonyms, or even make sound effects. The guesser can tilt the phone or move to the next card to pass on a difficult word or confirm a correct guess. The goal is to guess as many words as possible within the time limit, making it a fast, energetic, and hilarious game perfect for any gathering.',
    image: require('@/assets/images/heads_up.jpg')
  },
  {
    id: '2',
    name: 'Never Have I Ever',
    file: 'truthOrDare', //inserito nome file gioco collegato
    type: 'Party Game',
    rules: 'Never Have I Ever" is a fun and revealing game where a phone generates random statements, and players take turns reading them aloud. Anyone who has done the action must acknowledge it—by raising a hand, sharing a story, or laughing along. To spice things up, especially in a bar or social setting, those who have done it can take a sip of their drink or complete a dare chosen by the group. The game keeps going with new statements, sparking laughter, unexpected confessions, and a great way to break the ice.',
    image: require('@/assets/images/never.jpg')
  },
  {
    id: '3',
    name: 'Under Cover',
    file: '',
    type: '',
    rules: 'Coming Soon..',
    image: require('@/assets/images/undercover.png')
  },
  {
    id: '4',
    name: 'Taboo',
    file: '',
    type: '',
    rules: 'Coming Soon..',
    image: require('@/assets/images/unnamed.png')
  },
];

export default function Icebreakers() {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const colorScheme = useColorScheme() || 'light';
  const params = useLocalSearchParams();
  const nGamers = Number(params.max_people);
  const styles = getStyles(colorScheme);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: 'Icebreakers', headerBackTitle: 'Back', });

  }, [navigation]);

  const toggleExpand = (itemId: string) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  const renderGameItem = ({ item }: { item: { id: string; name: string; file: string; type: string; rules: string; image: any } }) => {
    const isExpanded = expandedItem === item.id;

    return (
      <TouchableOpacity
        style={styles.gameItem}
        onPress={() => toggleExpand(item.id)}
        activeOpacity={0.8}
      >
        <View style={styles.gameHeader}>
          <Image source={item.image} style={styles.gameIcon} />
          <View style={styles.gameInfo}>
            <Text style={styles.gameTitle}>{item.name}</Text>
            <Text style={styles.gameType}>{item.type}</Text>
          </View>
          <IconSymbol name={isExpanded ? 'chevron.up' : 'chevron.down'} size={24} color={colorScheme === 'dark' ? '#fff' : '#666'} />
        </View>
        {isExpanded && (
          <View style={styles.rulesContainer}>
            {item.id !== '3'&& item.id !=='4' &&
            <Text style={styles.rulesTitle}>Rules</Text>}
            <Text style={styles.rulesText}>{item.rules}</Text>
            {item.id !== '3'&& item.id !=='4' && ( // Nasconde il pulsante "Play" per "Coming Soon"
              <TouchableOpacity style={styles.playButton}
                onPress={() =>{
                  router.push({
                    pathname: `../pages/games/${item.file}`,
                    params: { max_people: nGamers }
                  })
                  }
                }>
                <IconSymbol name={'play.fill'} size={18} color={'white'} />
                <Text style={styles.playButtonText}>Play</Text>
              </TouchableOpacity>
            )}
          </View>
        )
        }
      </TouchableOpacity >
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={icebreakers}
        keyExtractor={(item) => item.id}
        renderItem={renderGameItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const getStyles = (colorScheme: string) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff',
  },
  list: {
    paddingVertical: 10,
    marginHorizontal: 10,
  },
  gameItem: {
    backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#f9f9f9',
    padding: 20, // 🔹 Larghezza migliorata
    marginVertical: 8,
    borderRadius: 15,
    borderColor: colorScheme === 'dark' ? '#333' : '#ddd',
    borderWidth: 1,
    width: '95%', // 🔹 Aumentata la larghezza della card
    alignSelf: 'center', // 🔹 Centrata la card per uniformità
    elevation: 3,
  },
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameIcon: {
    width: 65, // 🔹 Immagine leggermente più grande
    height: 65,
    borderRadius: 32,
    marginRight: 12,
  },
  gameInfo: {
    flex: 1,
  },
  gameTitle: {
    fontSize: 20, // 🔹 Titolo più grande
    fontWeight: 'bold',
    color: colorScheme === 'dark' ? '#fff' : '#333',
  },
  gameType: {
    fontSize: 16,
    color: colorScheme === 'dark' ? '#bbb' : '#666',
  },
  rulesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colorScheme === 'dark' ? '#444' : '#eee',
  },
  rulesTitle: {
    fontSize: 16, // 🔹 Più leggibile
    fontWeight: 'bold',
    marginBottom: 4,
    color: colorScheme === 'dark' ? '#fff' : '#333',
  },
  rulesText: {
    fontSize: 15, // 🔹 Testo più leggibile
    color: colorScheme === 'dark' ? '#ccc' : '#333',
  },
  playButton: {
    flexDirection:'row',
    marginTop: 20,
    backgroundColor: '#005f99', // 🔹 Blu più scuro
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    alignSelf: 'center',
  },
  playButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 18,
    
  },
});  
