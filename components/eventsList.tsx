import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { View, Text, ScrollView, SafeAreaView } from "react-native";
import EventCard from "./eventCard";

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      const eventsCollection = collection(db, "test-events");
      const querySnapshot = await getDocs(eventsCollection);
      const allEvents = querySnapshot.docs.map((doc) => ({
        eventId: doc.id,
        numOfGuests: doc.data().eventGuests.length,
        date: new Date(doc.data().eventDate).toLocaleString(),
        name: doc.data().eventName,
        host: doc.data().eventHost.hostName,
      }));
      setEvents(allEvents);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [])
  );

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>{error}</Text>;
  if (events.length === 0) return <Text>No events available</Text>;

  return (
    <SafeAreaView>
      <ScrollView style={{ marginBottom: 150 }}>
        {events.map((event, index) => (
          <EventCard key={index} event={event} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventsList;
