import React from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import { IconSymbol } from './ui/IconSymbol'; // Importa il tuo componente IconSymbol
import { Event } from '@/components/models/event'; // Importa il modello Event

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
                                    <IconSymbol name="house.fill" size={20} color="#000" />
                                    <Text style={styles.rowText}>There is a local legend here</Text>
                                </View>
                            )}
                            <View style={styles.row}>
                                <IconSymbol name="paperplane.fill" size={20} color="#000" />
                                <Text style={styles.rowText}>
                                    Today - {event.hour}
                                </Text>
                            </View>
                            <View style={styles.row}>
                                <IconSymbol name="person.crop.circle" size={20} color="#000" />
                                <Text style={styles.rowText}>
                                    {event.city} - {event.location}
                                </Text>
                            </View>
                            <View style={styles.row}>
                                <IconSymbol name="list.number" size={20} color="#000" />
                                <Text style={styles.rowText}>
                                    {event.max_people}
                                </Text>
                            </View>
                            <View style={styles.row}>
                                <IconSymbol name="chevron.right" size={20} color="#000" />
                                <Text style={styles.rowText}>{event.type}</Text>
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
                                <Text style={[styles.buttonText, styles.detailsButtonText]}>
                                    Details
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default EventDetailsPopup;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Sfondo semi-trasparente
        justifyContent: 'center',
    },
    modal: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        paddingTop: 20,
        width: '90%',
        marginLeft: 20,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8, // Distanza tra le righe
    },
    rowText: {
        fontSize: 16,
        color: '#555',
        marginLeft: 10, // Spazio tra icona e testo
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 20,
        borderTopWidth: 0.3,
        borderColor: '#ddd',
    },
    button: {
        flex: 1,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: '#f5f5f5',
        borderBottomLeftRadius: 20,
        borderRightWidth: 1,
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    detailsButton: {
        backgroundColor: '#f5f5f5',
        borderBottomRightRadius: 20,
        borderLeftWidth: 0.5,
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    buttonText: {
        fontSize: 16,
        color: '#000',
    },
    detailsButtonText: {
        fontWeight: 'bold',
    },
});
