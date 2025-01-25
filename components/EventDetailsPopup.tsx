import React from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    useColorScheme,
} from 'react-native';
import { IconSymbol } from './ui/IconSymbol'; // Importa il tuo componente IconSymbol
import { Event } from '@/components/models/event'; // Importa il modello Event
import { formatDateTime } from '@/hooks/dateFormat';

interface EventDetailsPopupProps {
    visible: boolean;
    onClose: () => void;
    onDetails: () => void;
    event: Event;
}

const EventDetailsPopup: React.FC<EventDetailsPopupProps> = ({
    visible,
    onClose,
    onDetails,
    event,
}) => {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    const colors = {
        background: isDarkMode ? '#1C1C1C' : '#FFFFFF',
        text: isDarkMode ? '#FFFFFF' : '#000000',
        overlay: 'rgba(0, 0, 0, 0.5)',
        buttonBackground: isDarkMode ? '#2E2E2E' : '#E0E0E0',
        rowText: isDarkMode ? '#CCCCCC' : '#555555',
    };

    const styles = StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: colors.overlay,
            justifyContent: 'center',
            alignItems: 'center'
        },
        modal: {
            backgroundColor: colors.background,
            borderRadius: 20,
            paddingTop: 20,
            marginLeft: 20,
            width: '80%',
            alignItems: 'center',
            marginHorizontal: 20,
        },
        headerText: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 20,
            textAlign: 'center',
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 8,
        },
        rowText: {
            fontSize: 16,
            color: colors.rowText,
            marginLeft: 10,
        },
        buttonContainer: {
            flexDirection: 'row',
            marginTop: 20,
            borderColor: colors.buttonBackground,
        },
        button: {
            flex: 1,
            paddingVertical: 15,
            alignItems: 'center',
            justifyContent: 'center',
        },
        cancelButton: {
            backgroundColor: colors.buttonBackground,
            borderBottomLeftRadius: 20,
            borderRightWidth: 0.5,
            borderTopWidth: 1,
            borderColor: 'white',
        },
        detailsButton: {
            backgroundColor: colors.buttonBackground,
            borderBottomRightRadius: 20,
            borderLeftWidth: 0.5,
            borderTopWidth: 1,
            borderColor: 'white',
        },
        buttonText: {
            fontSize: 16,
            color: colors.text,
        },
        detailsButtonText: {
            fontWeight: 'bold',
        },
    });

    return (
        <Modal
            transparent={true}
            animationType="slide"
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <View style={styles.modal}>
                        <Text style={styles.headerText}>{event.name}</Text>

                        {/* Event Details */}
                        <View>
                            {event.local_legend_here && (
                                <View style={styles.row}>
                                    <IconSymbol name="star" size={20} color={colors.text} />
                                    <Text style={styles.rowText}>There is a local legend here</Text>
                                </View>
                            )}
                            <View style={styles.row}>
                                <IconSymbol name="clock" size={20} color={colors.text} />
                                <Text style={styles.rowText}>{formatDateTime(event.date)}</Text>
                            </View>
                            <View style={styles.row}>
                                <IconSymbol name="location" size={20} color={colors.text} />
                                <Text style={styles.rowText}>
                                    {event.city} - {event.location}
                                </Text>
                            </View>
                            <View style={styles.row}>
                                <IconSymbol name="person.2" size={20} color={colors.text} />
                                <Text style={styles.rowText}>{event.max_people}</Text>
                            </View>
                            <View style={styles.row}>
                                <IconSymbol name="figure.run" size={20} color={colors.text} />
                                <Text style={styles.rowText}>{event.type}</Text>
                            </View>
                            <View style={styles.row}>
                                <IconSymbol name={event.place === "Outside" ? "sun.min" : "house.lodge"} size={20} color={colors.text} />
                                <Text style={styles.rowText}>{event.place}</Text>
                            </View>
                        </View>

                        {/* Footer Buttons */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={onClose}
                            >
                                <Text style={styles.buttonText}>Close</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.detailsButton]}
                                onPress={onDetails}
                            >
                                <Text style={[styles.buttonText, styles.detailsButtonText]}>Details</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default EventDetailsPopup;
