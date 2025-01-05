import React from 'react';
import { StyleSheet, View, Text, FlatList, Button, Image, useColorScheme, SafeAreaView } from 'react-native';
import { useAppContext } from '../_layout';
import { IconSymbol } from '@/components/ui/IconSymbol';


const ProfileScreen: React.FC = () => {
  const { user, allEvents } = useAppContext();

  const userImages: { [key: string]: any } = {
    Peppe: require('@/assets/images/Peppe.jpg'),
    Pio: require('@/assets/images/Pio.jpg'),
  };

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const nEventsCreated = allEvents.filter((ev) => ev.creator === user?.username).length;


  const colors = {
    background: isDarkMode ? '#1C1C1C' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    inputBackground: isDarkMode ? '#2E2E2E' : '#F5F5F5',
    buttonBackground: isDarkMode ? '#2E2E2E' : '#E0E0E0',
    buttonText: isDarkMode ? '#FFFFFF' : '#000000',
  }

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      marginTop: 40,
    },
    container: {
      flex: 1,
      padding: 16,
      paddingBottom: 50,
    },
    userContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    userAvatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
    },
    userName: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
    },
    taralloIcon: {
      width: 60,
      height: 65,
    },
    cardFullWidth: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: colors.inputBackground,
      padding: 16,
      marginBottom: 16,
      borderRadius: 8,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    cardTwoColumns: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    cardEvents: {
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.inputBackground,
      padding: 16,
      borderRadius: 8,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    title: {
      fontSize: 18,
      textAlign: 'center',
      fontWeight: 'bold',
      color: colors.text,
    },
    infoText: {
      fontSize: 16,
      color: colors.text,
    },
    infoItalicText: {
      fontSize: 14,
      fontStyle: 'italic',
      color: colors.text,
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Nome dell'utente in alto */}
        <View style={styles.userContainer}>
          <Image
            source={user?.username ? userImages[user.username] || require('@/assets/images/null.jpg') : require('@/assets/images/null.jpg')}
            style={styles.userAvatar}
          />
          <Text style={styles.userName}>{user?.name + " " + user?.surname}</Text>
        </View>

        {/* Card per le città */}
        <View style={[styles.cardFullWidth, { justifyContent: 'space-between' }]}>
          <Text style={styles.title}>Your local legend cities </Text>
          <IconSymbol size={65} name="globe.europe.africa" color={colors.text} />
          {user?.local_legend_for.length > 0 ?
            <Text style={styles.infoText}>{user.local_legend_for.join(', ')}</Text>
            : <Text style={styles.infoItalicText}>You're not a Local Legend yet</Text>
          }
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
          <View style={[styles.cardEvents, { marginRight: 8 }]}>
            <Text style={styles.title}>{'Events\ncompleted'}</Text>
            <IconSymbol size={65} name="checklist.checked" color={colors.text} />
            <Text style={styles.infoText}>{user?.taralli} events</Text>
          </View>
          <View style={[styles.cardEvents, { marginLeft: 8 }]}>
            <Text style={styles.title}>{'Events \n created'}</Text>
            <IconSymbol size={65} name="plus.circle" color={colors.text} />

            <Text style={styles.infoText}>{nEventsCreated} events</Text>
          </View>
        </View>

        <View style={[styles.cardFullWidth, { justifyContent: 'space-between' }]}>
          <Text style={styles.title}>Taralli</Text>
          <Image
            source={require('@/assets/images/tarallo.png')}
            style={[styles.taralloIcon,{ tintColor: colors.text }]}
            />
          <Text style={styles.infoText}>{user?.taralli} taralli</Text>
          <Text style={styles.infoItalicText}>
            At every event you attend, you get a tarallo.
            The more taralli you have, the more friends you'll have!
          </Text>

        </View>
      </View>
    </SafeAreaView>
  );
}

export default ProfileScreen;
