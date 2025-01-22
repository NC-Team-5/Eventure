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
        <Text style={card.inputLabel}> 🫂 Invite Guests</Text>
        <View>
          {guestList.map((guest, index) => {
            return (
              <View key={index} style={{ flexDirection: "row" }}>
                <Text style={textBox.box}>{guest}</Text>
                <View>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#4CA19E",
                      borderRadius: 8,
                      padding: 12,
                      margin: 5,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.25,
                      shadowRadius: 1,
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
              style={card.textField2}
              placeholder="Enter Guest Email"
              value={newGuest}
              onChangeText={setNewGuest}
            />
            <TouchableOpacity
              style={{
                backgroundColor: "#4CA19E",
                borderRadius: 8,
                padding: 12,
                marginTop: 10,
                marginLeft: 10,
                marginBottom: -3,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 1,
              }}
              onPress={handleAddGuest}
            >
              <Text style={{ fontSize: 13, color: "#fff" }}>Add</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={handlePress}
            style={{ marginTop: 10, width: "100%" }}
          >
            <Text style={card.box2}>Add Guest</Text>
          </TouchableOpacity>
        )}
        {/* <Text style={textBox.box}>Share the invite:</Text> */}
        <TouchableOpacity
          onPress={shareToWhatsApp}
          style={{ marginTop: 10, width: "97%" }}
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
    borderColor: "#F8F8F8",
    borderWidth: 1,
    marginBottom: 20,
    padding: 5,
    marginHorizontal: 20,
    borderRadius: 10,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  box2: {
    backgroundColor: "#F8FFFC",
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    marginLeft: 5,
    marginBottom: -3,
    fontSize: 13,
    width: "67%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 1,
  },
  textField: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#F8FFFC",
    borderRadius: 8,
    padding: 12,
    margin: 5,
    fontSize: 13,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 1,
  },
  textField2: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#F8FFFC",
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    marginLeft: 5,
    marginBottom: -3,
    fontSize: 13,
    width: "79.9%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 1,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

const textBox = StyleSheet.create({
  box: {
    backgroundColor: "#F8FFFC",
    borderRadius: 8,
    padding: 12,
    margin: 5,
    fontSize: 13,
    width: "66.9%",
    height: 40,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 1,
  },
});
