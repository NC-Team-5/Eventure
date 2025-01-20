import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useState, useEffect } from "react";
import { db } from "@/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

//TO DO
// Get list of attendees from the event in Firebase, and setGuestList array
// add to setNewGuest to add it to the setGuestList array
// upload the new guest list to the Firebase event

const GuestList = () => {
  const [isAddingGuest, setAddingGuest] = useState(false);
  const [newGuest, setNewGuest] = useState("");
  const [guestList, setGuestList] = useState();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEventGuestList = async () => {
    try {
      const eventCollection = collection(
        db,
        "test-events",
        " 3hlJUNvfESwzk8XnUzB4"
      );
      const querySnapshot = await getDocs(eventCollection);
      const allGuests = querySnapshot.docs.map((doc) => ({
        guests: doc.data().eventGuests,
      }));
      setGuestList(allGuests);
    } catch (err) {
      console.error("Error fetching guests:", err);
      setError("Failed to fetch guests");
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const eventsCollection = collection(db, "test-events");
      const querySnapshot = await getDocs(eventsCollection);
      const allEvents = querySnapshot.docs.map((doc) => ({
        location: doc.data().eventLocation,
        numOfGuests: doc.data().eventGuests.length,
        date: new Date(doc.data().eventDate).toLocaleString(),
        name: doc.data().eventName,
        host: doc.data().eventHost.hostName,
        guests: doc.data().eventGuests,
      }));
      setEvents(allEvents);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  console.log(events, "<---guestList");

  const handlePress = () => {
    console.log("Add Guest");
    setAddingGuest(true);
  };

  const handleAddItem = () => {
    if (newGuest.trim() !== "") {
      console.log("New Guest:", newGuest);
      setNewGuest("");
      setAddingGuest(false);
    }
  };

  return (
    <>
      <View style={card.box}>
        <View>
          <View style={{ flexDirection: "row" }}>
            <Text style={textBox.box}> </Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={textBox.box}> </Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={textBox.box}> </Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={textBox.box}> </Text>
          </View>
        </View>

        {isAddingGuest ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <TextInput
              style={card.textField}
              placeholder="Enter Guest Email"
              value={newGuest}
              onChangeText={setNewGuest}
            />
            <TouchableOpacity
              style={{
                backgroundColor: "#000",
                borderRadius: 8,
                padding: 12,
                margin: 5,
              }}
              onPress={handleAddItem}
            >
              <Text style={{ fontSize: 13, color: "#fff" }}>Add</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={handlePress}
            style={{ marginTop: 10, width: "98%" }}
          >
            <Text style={card.box2}>Add Guest</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

export default GuestList;

const card = StyleSheet.create({
  box: {
    alignContent: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    backgroundColor: "#4CA19E",
    marginBottom: 20,
    padding: 5,
    marginHorizontal: 35,
    borderRadius: 10,

    // iOS Drop Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,

    flexDirection: "column",
    justifyContent: "flex-start",
  },
  box2: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    margin: 5,
    fontSize: 13,
    width: "98.5%",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  textField: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    margin: 5,
    fontSize: 13,
    width: "77.5%",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
});

const textBox = StyleSheet.create({
  box: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    margin: 5,
    fontSize: 13,
    width: "95%",
    height: 40,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
});
