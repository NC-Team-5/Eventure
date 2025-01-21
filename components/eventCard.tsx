import { Timestamp } from "firebase/firestore";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter, Link } from "expo-router";
import { useState } from "react";

const EventCard = ({
  event,
}: {
  event: {
    eventId: string;
    name: string;
    host: string;
    date: string;
    numOfGuests: number;
    type: any;
  };
}) => {
  let imageUrl = "";
  switch (event.type) {
    case "BBQ":
      imageUrl =
        "https://firebasestorage.googleapis.com/v0/b/eventure-d4129.firebasestorage.app/o/image%20(2)(1).png?alt=media&token=ec4a1465-cb6d-423b-91ad-5482424f267c";
      break;
    case "House Party":
      imageUrl =
        "https://firebasestorage.googleapis.com/v0/b/eventure-d4129.firebasestorage.app/o/image%20(3)(1).png?alt=media&token=0e91d5dc-be9e-4284-aade-93d434f2db6f";
      break;
    case "Camping Trip":
      imageUrl =
        "https://firebasestorage.googleapis.com/v0/b/eventure-d4129.firebasestorage.app/o/image%20(5)(1).png?alt=media&token=da84c3f5-60fc-462d-8f82-f5fa8295565a";
      break;
    case "Graduation":
      imageUrl =
        "https://firebasestorage.googleapis.com/v0/b/eventure-d4129.firebasestorage.app/o/image%20(6)(1).png?alt=media&token=ed9015c1-f1f7-4cb0-8f5e-309997c1a7c1";
      break;
    default:
      imageUrl = "https://via.placeholder.com/70";
  }

  const router = useRouter();

  const handlePress = () => {
    router.replace(`/(auth)/${event.eventId}`)
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={card.box}>
        <Image
          source={{ uri: imageUrl }}
          style={{ marginRight: 5, width: 70, height: 70, borderRadius: 10 }}
        />
        <View>
          <View style={card.box2}>
            <Text style={textBox.box}>{event.name}</Text>
            <Text style={textBox.box}>Host: {event.host}</Text>
            <Text style={textBox.box}>
              <Ionicons
                name="person"
                size={14}
                color="black"
                style={{ position: "relative", top: 1.75 }}
              />{" "}
              {event.numOfGuests}
            </Text>
            <Text style={textBox.box}>{event.date}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const card = StyleSheet.create({
  box: {
    alignItems: "center",
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

    flexDirection: "row",
    justifyContent: "flex-start",
  },
  box2: {
    padding: 0,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginRight: 80,
  },
});

const textBox = StyleSheet.create({
  box: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 6,
    margin: 3,
    fontSize: 13,
  },
});

export default EventCard;
