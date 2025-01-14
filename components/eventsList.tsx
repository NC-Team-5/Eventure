import React, { useState, useEffect } from "react";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { View, Text } from "react-native";

import EventCard from "./eventCard";

const EventsList = () => {
  const [events, setEvents] = useState<{ location: string; name: string; numOfGuests: number; date: Timestamp }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsCollection = collection(db, "events"); // Replace "events" with your collection name
        const querySnapshot = await getDocs(eventsCollection);

        // Collect event data
        const allEvents = querySnapshot.docs.map((doc) => ({
          location: doc.data().location, // Ensure you have a unique identifier for each event
          name: doc.data().name,
          numOfGuests: doc.data().numOfGuests,
          date: doc.data().date
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
    <View>
      <Text >Events List</Text>
      {events.map((event) => (
        <EventCard event={event} />
      ))}
    </View>
  );
};

export default EventsList;



