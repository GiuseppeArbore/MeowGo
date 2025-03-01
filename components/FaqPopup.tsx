import { StyleSheet, Text, View, TouchableOpacity, useColorScheme, Modal, ScrollView, Platform } from 'react-native';
import { useState } from 'react';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Icon } from 'react-native-elements';
import React from 'react';

export function Faq() {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const colors = {
    background: isDarkMode ? '#1C1C1C' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    buttonBackground: isDarkMode ? '#2E2E2E' : '#E0E0E0',
    buttonText: isDarkMode ? '#FFFFFF' : '#000000',
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modal: {
      width: '90%',
      backgroundColor: colors.background,
      borderRadius: 20,
      paddingTop: 20,
      paddingHorizontal: 0, // Rimosso padding laterale per il bottone
      paddingBottom: 0, // Il bottone farà il bordo inferiore
      maxHeight: '85%',
      overflow: 'hidden', // Assicura che il bottone copra tutto
    },
    headerText: {
      color: colors.text,
      fontSize: 22,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 15,
    },
    scrollContainer: {
      flexGrow: 1, // Evita lo spazio extra sotto
      paddingHorizontal: 25, // Riportato padding solo nel contenuto
    },
    faqText: {
      color: colors.text,
      fontSize: 16,
      lineHeight: 24,
    },
    question: {
      fontWeight: 'bold',
      fontSize: 18,
      color: colors.text,
      marginTop: 10,
    },
    buttonContainer: {
      width: '100%', // Copre tutta la larghezza del modal
      borderTopWidth: 1,
      borderColor: isDarkMode ? '#555' : '#CCC',
      alignSelf: 'stretch', // Assicura che il contenitore si estenda
    },
    button: {
      backgroundColor: colors.buttonBackground,
      paddingVertical: 15,
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      width: '100%', // Copre tutta la larghezza disponibile
    },
    buttonText: {
      fontSize: 16,
      color: colors.buttonText,
    },
  });

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity onPress={() => setIsModalVisible(true)}>
        {Platform.OS === 'ios' ? (
          <IconSymbol size={24} name="questionmark" color={colorScheme === 'dark' ? '#FFF' : '#000'} />
        ) : (
          <Icon name="question" type="font-awesome" size={18} color={colorScheme === 'dark' ? '#FFF' : '#000'} />
        )}
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent={true} animationType="fade" onRequestClose={handleCancel}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.headerText}>Frequently Asked Questions</Text>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <Text style={styles.faqText}>
                <Text style={styles.question}>What is this app about?</Text> {'\n'}
                This app helps solo travelers find events that match their interests in the city they are visiting. These events offer a great opportunity to meet new people, explore exciting places, and have unique experiences.
                {'\n\n'}

                <Text style={styles.question}>Who is the Local Legend?</Text> {'\n'}
                A Local Legend is someone who knows the city inside out and can provide valuable tips and insights. They enhance events by sharing their expertise and helping travelers discover the best the city has to offer.
                {'\n\n'}

                <Text style={styles.question}>How do I become a Local Legend?</Text> {'\n'}
                To earn the title of Local Legend, you must pass a quiz about the city. If you answer correctly, you’ll gain the role and the ability to assist others in their adventures!
                {'\n\n'}

                <Text style={styles.question}>How are events structured?</Text> {'\n'}
                You can browse and join events that match your interests. Once you attend, you'll meet new people and engage in conversations with the help of a fantastic feature—icebreakers!
                {'\n\n'}

                <Text style={styles.question}>What are Icebreakers?</Text> {'\n'}
                Icebreakers are fun games designed to make socializing easier and more enjoyable. They help spark conversations and create connections with new people. Try them out and see how they transform your experience!
                {'\n\n'}

                <Text style={styles.question}>Why should I join events?</Text> {'\n'}
                Participating in events is not only about meeting people and having fun—it's also rewarding! By joining and engaging in events, you can collect <Text style={{ fontWeight: 'bold' }}>Taralli</Text>, so don’t miss out!
                {'\n\n'}

                <Text style={styles.question}>Why MEOW?</Text> {'\n'}
                Meet, Explore, Observe, Wonder are our core values. We believe that every journey should be an adventure, and we strive to make it happen also if you're a solo traveller. Join us and discover the world in a new light!

              </Text>
            </ScrollView>

            {/* Close Button - Ora copre tutta la larghezza del modal */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleCancel}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
    </>
  );
}
