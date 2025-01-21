import * as React from "react";
import { useState } from "react";
import {
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as Location from "expo-location";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { db, auth } from "../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { ThemedText } from "@/components/ThemedText";

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

  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const formatDateWithOrdinal = (date) => {
    const weekday = date.toLocaleString("en-GB", { weekday: "short" });
    const month = date.toLocaleString("en-GB", { month: "long" });
    const day = date.getDate();
    const year = date.getFullYear();
    const time = date.toLocaleString("en-GB", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return `${weekday} ${month} ${day}${getOrdinalSuffix(day)} ${year} @ ${time}`;
  };

  const handleDateConfirm = (date) => {
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
    const collectionRef = collection(db, "test-events");

    // Event Data + upload
    const eventData = {
      eventName: eventName,
      eventDate: selectedDateTime.toISOString(),
      eventLocation: selectedLocation,
      eventHost: {
        hostUID: auth.currentUser?.uid,
        hostName: auth.currentUser?.displayName,
      },
      eventGuests: [],
    };

    if (eventName && selectedDateTime && selectedLocation) {
      const eventDocRef = await addDoc(collectionRef, eventData);
      // Items list upload
      if (itemsList.length > 0) {
        const subCollectionRef = collection(
          db,
          "test-events",
          eventDocRef.id,
          "eventItems"
        );

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
      setSelectedLocation("");
      setSearchQuery("");
    }
  };

  const renderItem = ({ item }) => <Text style={styles.item}>{`☑️ ${item}`}</Text>;

  const renderSearchResults = () => (
    <View style={styles.searchResultsContainer}>
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
          style={styles.searchResult}
        >
          <Text style={styles.searchResultText}>
            {`${result.name}, ${result.city}, ${result.postalCode}`}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <KeyboardAwareScrollView
            style={styles.container}
            resetScrollToCoords={{ x: 0, y: 0 }}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: -20 }}
            keyboardShouldPersistTaps="handled"
          >
            <View>
              <Text style={styles.title}>🎟️ Create Your Next Event</Text>
              {/* Event Name Input */}
              <Text style={styles.sectionTitle}>🏷️ Event Name</Text>
              <TextInput
                style={styles.input}
                autoCapitalize="words"
                returnKeyType="next"
                placeholder="Event Name"
                maxLength={75}
                onChangeText={(input) => setEventName(input)}
              />

              {/* Add Item Input */}
              <Text style={styles.sectionTitle}>📋 Items</Text>
              <TextInput
                style={styles.input}
                placeholder="Add Items"
                autoCapitalize="words"
                maxLength={75}
                returnKeyType="next"
                enablesReturnKeyAutomatically={true}
                blurOnSubmit={false}
                onSubmitEditing={addItem}
                value={newItem}
                onChangeText={(input) => setNewItem(input)}
              />

              {/* Items List (using FlatList) */}
              {itemsList.length === 0 ? (
                <><Text style={styles.noItemsText}>No items yet? Add some!</Text>
                </>
              ) : (
                <FlatList
                  data={itemsList}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => `${item}-${index}`}
                />
              )}

              {/* Date and Time */}
              <Text style={styles.sectionTitle}>🗓️ Date & Time</Text>
              <Text onPress={showDatePicker} style={styles.dateTimeText}>
                {formatDateWithOrdinal(selectedDateTime)}
              </Text>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                onConfirm={handleDateConfirm}
                onCancel={hideDatePicker}
                minimumDate={new Date()}
              />

              {/* Location Search */}
              <Text style={styles.sectionTitle}>📍 Location</Text>
              <TextInput
                placeholder="Search for a location"
                value={searchQuery}
                onChangeText={searchLocations}
                style={styles.searchInput}
              />
              {renderSearchResults()}

              {/* Submit Button */}
              <TouchableOpacity onPress={submitEvent} style={styles.button}>
                <Text style={styles.buttonText}>Create Event ✨</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#F9F9F9",
    flexGrow: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4CA19E",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CA19E",
    marginVertical: 10,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#4CA19E",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  item: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  noItemsText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  dateTimeText: {
    fontSize: 18,
    color: "#4CA19E",
    textDecorationLine: "underline",
    marginBottom: 10,
    marginTop: 5,
  },
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderColor: "#4CA19E",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 16,
    color: "#333",
  },
  searchResultsContainer: {
    maxHeight: 200,
    marginBottom: 20,
  },
  searchResult: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  searchResultText: {
    fontSize: 14,
    color: "#4CA19E",
  },
  button: {
    backgroundColor: "#4CA19E",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});