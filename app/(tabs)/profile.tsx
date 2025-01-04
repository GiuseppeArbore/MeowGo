import React from 'react';
import { StyleSheet, View, Text, FlatList, Button, Image, useColorScheme } from 'react-native';
import { useAppContext } from '../_layout';
import { IconSymbol } from '@/components/ui/IconSymbol';



const ProfileScreen: React.FC = () => {
  const { user,  } = useAppContext();

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  

  const colors = {
    background: isDarkMode ? '#1C1C1C' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    overlay: 'rgba(0, 0, 0, 0.5)',
    buttonBackground: isDarkMode ? '#2E2E2E' : '#E0E0E0',
    rowText: isDarkMode ? '#CCCCCC' : '#555555',
  };
  return (
    <View style={styles.container}>
      {/* Mostrare il nome dell'utente in alto */}
      <Text style={styles.userName}>{user?.name + " " + user?.surname}</Text>

      {/* Card per le città */}
      <View style={styles.cardFullWidth}>
        <Text style={styles.title}>Your local legend cities </Text>
        <FlatList
          data={user?.local_legend_for}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={styles.cityText}>{item}</Text>
          )}
        />
        <Button
          title="Add city"
          onPress={() => {
            // Funzione per aggiungere nuove città (da implementare)
            alert('Funzione non implementata');
          }}
        />
      </View>

      {/* Card per punti guadagnati e eventi partecipati (affiancati) */}
      <View style={styles.cardTwoColumns}>
        <View style={styles.cardEventsJoined}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Events completed</Text>
          </View>
          <IconSymbol size={65} name="checklist.checked" color={colors.text} />
          <View style={styles.infoContainer}>
          <Text style={styles.infoText}>{user?.taralli} events</Text>
          </View>
        </View>

        <View style={styles.cardTaralli}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Taralli</Text>
          </View>
          <View style={styles.iconContainer}>
            <Image
              source={require('@/assets/images/tarallo.jpg')}
              style={styles.taralloIcon} />
          </View>
          <View style={styles.infoContainer}>
          <Text style={styles.infoText}>{user?.taralli} taralli</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 60
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  iconContainer: {
    alignItems: 'center',
  },
  titleContainer: {
    height: 60,
    justifyContent: 'center'
  },
  infoContainer: {
    height: 60,
    justifyContent: 'center'
  },
  taralloIcon: {
    width: 60,
    height: 65,
  },
  cardFullWidth: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTwoColumns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardEventsJoined: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flex: 1,
    marginRight: 8,
  },
  cardTaralli: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flex: 1,
    marginLeft: 8,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cityText: {
    fontSize: 16,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 16,
  },
});
