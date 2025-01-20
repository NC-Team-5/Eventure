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
} from "react-native";
import * as Location from "expo-location";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { db, auth } from "../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

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
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  }

  const formatDateWithOrdinal = (date) => {
    const weekday = date.toLocaleString('en-GB', { weekday: 'short' });
    const month = date.toLocaleString('en-GB', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();
    const time = date.toLocaleString('en-GB', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    return `${weekday} ${month} ${day}${getOrdinalSuffix(day)} ${year} @ ${time}`;
  }

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

  const renderItem = ({ item }) => <Text style={styles.item}>{item}</Text>;

  const renderSectionHeader = (title) => (
    <Text style={styles.sectionTitle}>{title}</Text>
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <FlatList
          data={[
            { id: 'event-name', content: renderSectionHeader('🎟️ Create Event') },
            {
              id: 'event-name-input', content: (
                <TextInput
                  style={styles.input}
                  autoCapitalize="words"
                  returnKeyType="next"
                  placeholder="Event Name"
                  maxLength={75}
                  onChangeText={(input) => setEventName(input)}
                />
              )
            },
            { id: 'add-items', content: renderSectionHeader('📋 Add Items') },
            {
              id: 'add-item-input', content: (
                <TextInput
                  autoCapitalize="words"
                  enterKeyHint="next"
                  placeholder="Add Items"
                  maxLength={75}
                  returnKeyType="next"
                  enablesReturnKeyAutomatically={true}
                  onSubmitEditing={addItem}
                  value={newItem}
                  onChangeText={(input) => setNewItem(input)}
                  style={styles.input}
                />
              )
            },
            {
              id: 'items-list', content: itemsList.length === 0 ? (
                <Text style={styles.noItemsText}>No items added yet. Add some!</Text>
              ) : (
                <FlatList
                  data={itemsList}
                  renderItem={renderItem}
                />
              )
            },
            { id: 'date-time', content: renderSectionHeader('🗓️ Date & Time') },
            {
              id: 'date-time-display', content: (
                <Text onPress={showDatePicker} style={styles.dateTimeText}>
                  {formatDateWithOrdinal(selectedDateTime)}
                </Text>
              )
            },
            {
              id: 'date-time-picker', content: (
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="datetime"
                  onConfirm={handleDateConfirm}
                  onCancel={hideDatePicker}
                  minimumDate={new Date()}
                />
              )
            },
            { id: 'location', content: renderSectionHeader('📍 Location') },
            {
              id: 'search-input', content: (
                <TextInput
                  placeholder="Search for a location"
                  value={searchQuery}
                  onChangeText={searchLocations}
                  style={styles.searchInput}
                />
              )
            },
            { id: 'search-results', content: renderSearchResults() },
            {
              id: 'submit-button', content: (
                <TouchableOpacity onPress={submitEvent} style={styles.button}>
                  <Text style={styles.buttonText}>Create Event ✨</Text>
                </TouchableOpacity>
              )
            }
          ]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => item.content}
        />
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
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
    fontSize: 28,
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
    marginBottom: 5,
  },
  dateTimeText: {
    fontSize: 18,
    color: "#4CA19E",
    textDecorationLine: "underline",
    marginBottom: 20,
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
