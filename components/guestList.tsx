import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Linking,
  Button,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { db } from "@/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  getDoc,
  setDoc,
  doc,
  onSnapshot,
  FieldValue,
  arrayUnion,
} from "firebase/firestore";
import {
  useRouter,
  useLocalSearchParams,
  useGlobalSearchParams,
} from "expo-router";

//TO DO
// Get list of attendees from the event in Firebase, and setGuestList array
// add to setNewGuest to add it to the setGuestList array
// upload the new guest list to the Firebase event

const GuestList = ({ eventId }) => {
  //const { eventId } = useGlobalSearchParams();
  const [isAddingGuest, setAddingGuest] = useState(false);
  const [newGuest, setNewGuest] = useState("");
  const [guestList, setGuestList] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  //const [eventId, setEventId] = useState(useGlobalSearchParams);
  useEffect(() => {
    const docRef = doc(db, "test-events", eventId);
    const guestListCollection = getDoc(docRef)
      .then((doc) => {
        return doc.data().eventGuests;
      })
      .then((result) => {
        setGuestList(result);
      });
  }, [eventId]);

  /*   const uploadGuest = () => {
    console.log(guestList, "<---guestList in uploadGuest");
    const docRef = doc(db, "test-events", eventId);
    docRef.update({
      arrayField: db.FieldValue.arrayUnion(newGuest),
    });
    setDoc(docRef, { guestList }, { merge: true });
  }; */

  const handlePress = () => {
    console.log("Add Guest");
    setAddingGuest(true);
  };

  const handleAddGuest = () => {
    if (newGuest.trim() !== "") {
      console.log("New Guest:", newGuest);

      setNewGuest("");
      setAddingGuest(false);
      setGuestList([...guestList, newGuest]);
    }
  };

  /*   const handleAddGuest = async () => {
    if (newGuest.trim() !== "") {
      try {
        const guestListCollection = collection(
          db,
          "test-events",
          eventId,
          "eventItems"
        );
        await addDoc(guestListCollection, {
          name: newItem,
          isChecked: false,
          checkedBy: "",
          addedBy: auth.currentUser?.displayName,
        });

        setNewItem("");
        setAddingItem(false);
      } catch (err) {
        console.error("Error adding item:", err);
        setError("Failed to add item");
      }
    }
  }; */

  const sendEmail = (guest) => {
    const recipient = guest;
    const subject = "Let's have an Eventure!";
    const body = `Let's get together - join my Graduation event in the Eventure app and let everyone know what you can bring: http://myapp/event`;

    const emailUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.canOpenURL(emailUrl)
      .then((supported) => {
        if (!supported) {
          Alert.alert("Error", "Email client is not available.");
        } else {
          Linking.openURL(emailUrl);
        }
      })
      .catch((err) => console.error("Error opening email client: ", err));
  };

  const shareToWhatsApp = () => {
    const message = `Let's get together - join my Graduation event in the Eventure app and let everyone know what you can bring: http://myapp/event`;
    const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;

    Linking.canOpenURL(whatsappUrl)
      .then((supported) => {
        if (!supported) {
          Alert.alert("Error", "WhatsApp is not installed on your device.");
        } else {
          Linking.openURL(whatsappUrl);
        }
      })
      .catch((err) => console.error("Error opening WhatsApp: ", err));
  };

  return (
    <>
      <View style={card.box}>
        <View>
          {guestList.map((guest, index) => {
            return (
              <View key={index} style={{ flexDirection: "row" }}>
                <Text style={textBox.box}>{guest}</Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#000",
                    borderRadius: 8,
                    padding: 12,
                    margin: 5,
                  }}
                  onPress={() => {
                    sendEmail(guest);
                  }}
                >
                  <Text style={{ fontSize: 13, color: "#fff" }}>
                    Email invite
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
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
              onPress={handleAddGuest}
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
        <Text style={textBox.box}>Share the invite:</Text>
        <TouchableOpacity
          onPress={shareToWhatsApp}
          style={{ marginTop: 10, width: "98%" }}
        >
          <Text style={card.textField}>Share to Whatsapp</Text>
        </TouchableOpacity>
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
