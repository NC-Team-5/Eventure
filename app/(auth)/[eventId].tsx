import { ScrollView, Text, View, StyleSheet, SafeAreaView, Linking, Platform } from "react-native";
import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import ItemList from "@/components/ItemList";
import GuestList from "@/components/guestList";
import Photos from "@/components/camera";
import DividerLine from "@/components/DividerLine";

export default function Event() {
  const { eventId } = useLocalSearchParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) {
        setError("No event ID provided");
        setLoading(false);
        router.back();
        return;
      }

      try {
        const eventDoc = doc(db, "test-events", eventId);
        const eventSnapshot = await getDoc(eventDoc);

        if (eventSnapshot.exists()) {
          setEvent(eventSnapshot.data());
        } else {
          setError("Event not found");
        }
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Failed to fetch event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const openMaps = (address) => {
    const encodedAddress = encodeURIComponent(address);
    let url;

    if (Platform.OS === "ios") {
      url = `http://maps.apple.com/?q=${encodedAddress}`;
    } else {
      url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    }

    Linking.openURL(url).catch((err) =>
      console.error("Failed to open maps app:", err)
    );
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>{error}</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>{event.eventName}</Text>
          <Text style={styles.subTitle}>
            👤 {event.eventHost.hostName} is your host
          </Text>
          <Text style={styles.location}>
            📍{" "}
            <Text
              style={{ textDecorationLine: "underline" }}
              onPress={() => openMaps(event.eventLocation.fullAddress)}
            >
              {event.eventLocation.fullAddress}
            </Text>
          </Text>
          <DividerLine style={styles.divider} />
          <ItemList eventId={eventId} />
          <DividerLine />
          <GuestList eventId={eventId} />
          <DividerLine />
          <Photos eventId={eventId} />
          {/* <Map /> */}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingBottom: 50,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 50,
  },
  title: {
    fontWeight: "bold",
    color: "#4CA19E",
    fontSize: 28,
    textAlign: "center",
    padding: 20,
    paddingBottom: 10,
  },
  subTitle: {
    fontWeight: "bold",
    color: "#a9a591",
    fontSize: 24,
    textAlign: "center",
    paddingBottom: 10,
  },
  location: {
    margin: 10,
    fontWeight: "400",
    color: "#a9a591",
    fontSize: 20,
    textAlign: "center",
  },
});
