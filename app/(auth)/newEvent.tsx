import * as React from "react";
import { useState } from "react";
import {
  ScrollView,
  TextInput,
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Location from "expo-location";
import { app } from "../../firebaseConfig";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { nanoid } from "nanoid";

export default function EventCreation() {
  const [eventName, setEventName] = useState("");
  const [itemsList, setItemsList] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const addItem = () => {
    if (newItem) {
      setItemsList([...itemsList, newItem]);
      setNewItem("");
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setSelectedDateTime(date);
    hideDatePicker();
  };
  const searchLocations = async (text) => {
    setSearchQuery(text);
    if (text.length > 2) {
      try {
        const results = await Location.geocodeAsync(text);

        const addressDetails = await Promise.all(
          results.map(async (result) => {
            const address = await Location.reverseGeocodeAsync({
              latitude: result.latitude,
              longitude: result.longitude,
            });
            return {
              ...address[0],
              latitude: result.latitude,
              longitude: result.longitude,
            };
          })
        );
        setSearchResults(addressDetails);
      } catch (error) {
        console.log("Error:", error);
      }
    }
  };

  const submitEvent = async () => {
    const db = getFirestore(app);
    const eventId = nanoid();

    // Convert date to timestamp for Firestore
    const eventData = {
      eventName: eventName,
      eventDate: selectedDateTime.toISOString(),
      location: selectedLocation,
      createdAt: new Date().toISOString(),
    };

    try {
      console.log("Submitting event data:", eventData);

      const newDocRef = doc(db, "events", eventId);
      await setDoc(newDocRef, eventData);
      console.log("Event created successfully with ID:", eventId);

      // Add items as a subcollection
      if (itemsList.length > 0) {
        const itemsSubRef = collection(db, "events", eventId, "items");
        for (const item of itemsList) {
          await addDoc(itemsSubRef, { name: item });
        }
        console.log("Items added successfully");
      }

      // Clear form
      setEventName("");
      setItemsList([]);
      setSelectedLocation(null);
      setSearchQuery("");

      alert("Event created successfully!");
    } catch (error) {
      console.log("Error creating event:", error);
      alert("Failed to create event. Please try again.");
    }
  };

  return (
    <View style={{ padding: 50 }}>
      <Text style={{ fontSize: 32 }}>Create Event</Text>
      <TextInput
        placeholder="Event Name"
        maxLength={75}
        onChangeText={(input) => setEventName(input)}
      ></TextInput>
      <Text style={{ fontSize: 32 }}>Add Items</Text>
      <TextInput
        placeholder="Add Items"
        maxLength={75}
        returnKeyType="next"
        onSubmitEditing={addItem}
        value={newItem}
        onChangeText={(input) => setNewItem(input)}
      ></TextInput>
      <FlatList
        data={itemsList}
        renderItem={({ item }) => <Text>{item}</Text>}
      />
      <TouchableOpacity onPress={showDatePicker} style={styles.dateTimeButton}>
        <Text style={styles.dateTimeText}>
          {selectedDateTime.toLocaleString()}
        </Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={selectedDateTime}
      />
      <Text style={{ fontSize: 32 }}>Location</Text>
      <TextInput
        placeholder="Search for a location"
        value={searchQuery}
        onChangeText={searchLocations}
        style={{
          height: 44,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 5,
          paddingHorizontal: 10,
          marginBottom: 10,
        }}
      />
      {searchResults.length > 0 && (
        <View style={{ maxHeight: 200 }}>
          {searchResults.map((result, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                const eventLocation = {
                  latitude: result.latitude,
                  longitude: result.longitude,
                  fullAddress: `${result.name}, ${result.city}, ${result.postalCode}`,
                };
                setSelectedLocation(eventLocation);
                setSearchQuery(`${result.street}, ${result.postalCode}`);
                setSearchResults([]);
              }}
              style={{
                padding: 10,
                borderBottomWidth: 1,
                borderColor: "#eee",
              }}
            >
              <Text>{`${result.name}, ${result.city}, ${result.postalCode}`}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <Button
        title="Create Event"
        onPress={() => {
          console.log("Button pressed!");
          submitEvent();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dateTimeButton: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 5,
  },
  dateTimeText: {
    fontSize: 16,
  },
});
