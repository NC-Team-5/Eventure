import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Alert, Linking, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const Map = ({ eventId }) => {
    const [eventLocation, setEventLocation] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchEventLocation = async () => {
        setLoading(true);
        try {
            const docRef = doc(db, 'test-events', eventId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log('Fetched Event Location:', docSnap.data().eventLocation);
                setEventLocation(docSnap.data().eventLocation);
            } else {
                console.error('No such document!');
            }
        } catch (error) {
            console.error('Error fetching event location:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (eventId) {
            fetchEventLocation();
        }
    }, [eventId]);

    const openInMaps = (latitude, longitude, fullAddress) => {
        const encodedAddress = encodeURIComponent(fullAddress);

        // Create the map links for Apple Maps and Google Maps
        const appleMapsURL = `http://maps.apple.com/?ll=${latitude},${longitude}&q=${encodedAddress}`;
        const googleMapsURL = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}&query_place_id=${latitude},${longitude}`;

        // Use platform-specific URL
        const url = Platform.OS === 'ios' ? appleMapsURL : googleMapsURL;

        Linking.openURL(url).catch((err) => {
            console.error('Failed to open maps:', err);
            Alert.alert('Error', 'Could not open the maps application.');
        });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!eventLocation) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Event location not found.</Text>
            </View>
        );
    }

    const { latitude, longitude, fullAddress } = eventLocation;

    return (
        <View style={styles.mapContainer}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude,
                    longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
                pitchEnabled={false}
                rotateEnabled={false}
            >
                <Marker
                    coordinate={{ latitude, longitude }}
                    onPress={() =>
                        Alert.alert(
                            'Open in Maps?',
                            `Would you like to view "${fullAddress}" in your device's maps app?`,
                            [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Open', onPress: () => openInMaps(latitude, longitude, fullAddress) },
                            ]
                        )
                    }
                />
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    mapContainer: {
        height: 200, // Adjusted height for better visibility
        width: "100%",
    },
    map: {
        flex: 1,
        borderRadius: 15,
        margin: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
    },
});

export default Map;
