import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, Image, useColorScheme, SafeAreaView } from 'react-native';
import { useAppContext } from '../_layout';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from 'expo-router';
import { Login_form } from '@/components/Login_form';
import ModalCitySelector from '@/components/LLCityPopup';


const ProfileScreen: React.FC = () => {
  const { user, allEvents } = useAppContext();

  const userImages: { [key: string]: any } = {
    Peppe: require('@/assets/images/users/Peppe.jpg'),
    Pio: require('@/assets/images/users/Pio.jpg'),
    Fra: require('@/assets/images/users/fra.jpeg'),
    Caca: require('@/assets/images/users/cla.jpg'),
  };

  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const nEventsCreated = allEvents.filter((ev) => ev.creator === user?.username).length;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCityModalVisible, setIsCityModalVisible] = useState(false);


  const colors = {
    background: isDarkMode ? '#1C1C1C' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    cardBackground: isDarkMode ? '#2E2E2E' : '#ffffff',
    buttonBackground: isDarkMode ? '#2E2E2E' : '#E0E0E0',
    buttonText: isDarkMode ? '#FFFFFF' : '#000000',
  }

  const handleCitySelect = (city: string) => {
    setIsCityModalVisible(false);  // Chiudiamo il modale della città quando la città è selezionata
    router.push(`../pages/quiz/${city}`);
  };

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
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
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
      backgroundColor: colors.cardBackground,
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
      backgroundColor: colors.cardBackground,
      padding: 16,
      borderRadius: 8,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
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
        <Login_form isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible}/>
        <View style={styles.userContainer}>
          <View style={styles.userInfo}>
            <Image
              source={user?.username ? userImages[user.username] || require('@/assets/images/null.jpg') : require('@/assets/images/null.jpg')}
              style={styles.userAvatar}
            />
            <Text style={styles.userName}>{user?.name + " " + user?.surname}</Text>
          </View>
          <Button title="Logout" onPress={()=>setIsModalVisible(true)}/>
        </View>

        {/* Card per le città */}
        <View style={[styles.cardFullWidth, { justifyContent: 'space-between' }]}>
          <Text style={styles.title}>Your local legend cities </Text>
          <IconSymbol size={65} name="globe.europe.africa" color={colors.text} />
          {user ? (user.local_legend_for.length > 0 ?
            <Text style={styles.infoText}>{user.local_legend_for.join(', ')}</Text>
            : <Text style={styles.infoItalicText}>You're not a Local Legend yet</Text>)
            : <Text style={styles.infoItalicText}>You're not a Local Legend yet</Text>
          }
          <Button
            title="Add city"
            //onPress={() => router.push('../pages/QuizScreen')}
            onPress={() => setIsCityModalVisible(true)}
          />
        </View>

        {/* ModalCitySelector */}
        <ModalCitySelector
          isVisible={isCityModalVisible}
          onSelectCity={handleCitySelect}
          onClose={() => setIsCityModalVisible(false)}
          llCities={ user ? user.local_legend_for : [] }
        />

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
            style={[styles.taralloIcon, { tintColor: colors.text }]}
          />
          <Text style={styles.infoText}>{user?.taralli} taralli</Text>
          <Text style={styles.infoItalicText}>
            At every event you attend, you get a tarallo.
            The more taralli you have, the more discounts you'll have in future! [Coming soon]
          </Text>
          <Button
            title="View Discounts"
            onPress={() => router.push('../discounts')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default ProfileScreen;
