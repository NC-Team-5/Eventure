import * as React from "react";
import { useState } from "react";
import {
  TextInput,
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as Location from "expo-location";
import DateTimePickerModal from "react-native-modal-datetime-picker"
import { db, auth } from "../../firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";

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
    const collectionRef = collection(db, "test-events")

    // Event Data + upload
    const eventData = {
      eventName: eventName,
      eventDate: selectedDateTime,
      eventLocation: selectedLocation,
      eventHost: {
        hostUID: auth.currentUser?.uid,
        hostName: auth.currentUser?.displayName
      },
      eventGuests: []
    }

    if (eventName && selectedDateTime && selectedLocation) {
      const eventDocRef = await addDoc(collectionRef, eventData)
      // Items list upload
      if (itemsList.length > 0) {
        const subCollectionRef = collection(db, "test-events", eventDocRef.id, "eventItems")

        for (const item of itemsList) {
          await addDoc(subCollectionRef, {
            name: item,
            addedBy: auth.currentUser?.displayName,
            checkedBy: "",
          });
        }
      }

      setEventName("");
      setItemsList([]);
      setSelectedLocation(null);
      setSearchQuery("");

    }


  }

  return (
    <View style={{ padding: 50 }}>

      <Text style={{ fontSize: 32 }}>🎟️ Create Event</Text>
      <TextInput
        placeholder="Event Name"
        maxLength={75}
        onChangeText={(input) => setEventName(input)}
      ></TextInput>

      <Text style={{ fontSize: 32 }}>📋 Add Items</Text>
      <TextInput
        placeholder="Add Items"
        maxLength={75}
        returnKeyType="next"
        enablesReturnKeyAutomatically={true}
        onSubmitEditing={addItem}
        value={newItem}
        onChangeText={(input) => setNewItem(input)}
      ></TextInput>
      <FlatList
        data={itemsList}
        renderItem={({ item }) => <Text>{item}</Text>}
      />

      <Text style={{ fontSize: 32 }}>🗓️ Date & Time</Text>
      <Text onPress={showDatePicker} style={styles.dateTimeText}>
        {selectedDateTime.toLocaleString()}
      </Text>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        minimumDate={new Date()}
      />

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={selectedDateTime}
      />
      <Text style={{ fontSize: 32 }}>📍 Location</Text>
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
        title="Create Event ✨"
        onPress={submitEvent}
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
