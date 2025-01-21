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
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Location from "expo-location";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { db, auth } from "../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { ThemedText } from "@/components/ThemedText";

import BouncyCheckbox from "react-native-bouncy-checkbox";

export default function EventCreation() {
  const [eventName, setEventName] = useState("");
  const [itemsList, setItemsList] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedEventType, setSelectedEventType] = useState<string | null>(
    null
  );

  const isButtonDisabled = !eventName || !selectedDateTime || !selectedLocation;

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

    const eventData = {
      eventName: eventName,
      eventDate: selectedDateTime.toISOString(),
      eventLocation: selectedLocation,
      eventHost: {
        hostUID: auth.currentUser?.uid,
        hostName: auth.currentUser?.displayName,
      },
      eventGuests: [],
      eventType: selectedEventType,
    };

    if (eventName && selectedDateTime && selectedLocation) {
      const eventDocRef = await addDoc(collectionRef, eventData);

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
      setSelectedLocation(null);
      setSearchQuery("");
      setSelectedEventType(null);
    }
  };

  const renderItem = ({ item }) => (
    <Text style={styles.item}>{`☑️ ${item}`}</Text>
  );

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
  const handleEventTypeChange = (eventType: string) => {
    if (selectedEventType === eventType) {
      setSelectedEventType(null);
    } else {
      setSelectedEventType(eventType);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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

              <Text style={styles.sectionTitle}>🎂 Event Type</Text>
              <View style={styles.checkboxContainer}>
                {["BBQ", "House Party", "Camping Trip", "Graduation"].map(
                  (eventType) => (
                    <View key={eventType} style={styles.checkboxRow}>
                      <Text style={styles.checkboxLabel}>{eventType}</Text>
                      <View>
                        <BouncyCheckbox
                          size={35}
                          style={styles.checkbox}
                          isChecked={selectedEventType === eventType}
                          onPress={() => handleEventTypeChange(eventType)}
                          fillColor="#4CA19E"
                          iconStyle={{
                            borderColor: "#4CA19E",
                            borderRadius: 5,
                          }}
                          innerIconStyle={{ borderRadius: 5 }}
                        />
                      </View>
                    </View>
                  )
                )}
              </View>

              <Text style={styles.sectionTitle}>🏷️ Event Name</Text>
              <TextInput
                style={styles.input}
                autoCapitalize="words"
                returnKeyType="next"
                placeholder="Event Name"
                maxLength={75}
                value={eventName}
                onChangeText={(input) => setEventName(input)}
              />

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

              {itemsList.length === 0 ? (
                <>
                  <Text style={styles.noItemsText}>
                    No items yet? Add some!
                  </Text>
                </>
              ) : (
                <View>
                  <FlatList
                    data={itemsList}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `${item}-${index}`}
                  />
                </View>
              )}

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

              <Text style={styles.sectionTitle}>📍 Location</Text>
              <TextInput
                placeholder="Search for a location"
                value={searchQuery}
                onChangeText={searchLocations}
                style={styles.searchInput}
              />
              {renderSearchResults()}

              <TouchableOpacity
                onPress={submitEvent}
                style={[
                  styles.button,
                  isButtonDisabled && styles.buttonDisabled,
                ]}
                disabled={isButtonDisabled}
              >
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
    padding: 5,
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
  checkboxContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 10,
  },
  checkbox: {
    marginLeft: 10,
  },
  checkboxLabel: {
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
  buttonDisabled: {
    backgroundColor: "#A0D3D0",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
