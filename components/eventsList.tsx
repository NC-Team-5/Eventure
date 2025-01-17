import React, { useState, useEffect } from "react";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { View, Text, ScrollView } from "react-native";

import EventCard from "./eventCard";

const EventsList = () => {
  const [events, setEvents] = useState<
    {
      id: number;
      location: string;
      name: string;
      numOfGuests: number;
      date: Timestamp;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsCollection = collection(db, "test-events"); // Replace "events" with your collection name
        const querySnapshot = await getDocs(eventsCollection);

        // Collect event data
        const allEvents = querySnapshot.docs.map((doc) => ({
          // Ensure you have a unique identifier for each event
          location: doc.data().eventLocation,
          numOfGuests: doc.data().eventGuests,
          date: doc.data().eventDate,
          name: doc.data().eventName,
          host: doc.data().eventHost.hostName,
        }));
        setEvents(allEvents);
      } catch (err) {
        console.error("Error fetching documents:", err);
        setError("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  if (error)
    return (
      <View>
        <Text>{error}</Text>
      </View>
    );
  if (events.length === 0)
    return (
      <View>
        <Text>No events available</Text>
      </View>
    );

  return (
    <ScrollView>
      {events.map((event) => (
        <EventCard event={event} key={event.id} />
      ))}
    </ScrollView>
  );
};

export default EventsList;
