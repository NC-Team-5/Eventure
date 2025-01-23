import { Timestamp } from "firebase/firestore";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter, Link } from "expo-router";
import { useState } from "react";


const formatDate = (dateString) => {
  const [datePart, timePart] = dateString.split(", ");
  const [day, month, year] = datePart.split("/");
  const [hours, minutes, seconds] = timePart.split(":").map(Number);

  const date = new Date(year, month - 1, day, hours, minutes, seconds);

  const formattedTime = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return `${formattedDate}, ${formattedTime}`;
};

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
      imageUrl =
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Pug_-_1_year_Old_%28cropped%29.jpg/596px-Pug_-_1_year_Old_%28cropped%29.jpg";
  }

  const router = useRouter();

  const handlePress = () => {
    router.replace(`/(auth)/${event.eventId}`);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text style={textBox.title}>{event.name}</Text>
      <View style={card.box}>
        <Image
          source={{ uri: imageUrl }}
          style={{ marginRight: 5, width: 70, height: 70, borderRadius: 10 }}
        />
        <View>
          <View style={card.box2}>
            <Text style={textBox.box}>Host: {event.host}</Text>
            <Text style={textBox.box3}>
              <Ionicons
                name="person"
                size={14}
                color="black"
                style={{ position: "absolute" }}
              />{" "}
            </Text>
            <Text style={textBox.box2}>{event.numOfGuests}</Text>
            <Text style={textBox.box}>{formatDate(event.date)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};


const card = StyleSheet.create({
  box: {
    alignItems: "center",
    borderColor: "#4CA19E",
    borderWidth: 1,
    marginBottom: 15,
    padding: 5,
    marginHorizontal: 35,
    borderRadius: 10,
    backgroundColor: "#F8FFFC",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,

    flexDirection: "row",
    justifyContent: "flex-start",
  },
  box2: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginRight: 80,
  },
});

const textBox = StyleSheet.create({
  box: {
    borderRadius: 8,
    padding: 6,
    margin: 3,
    fontSize: 13,
    color: "000",
  },
  title: {
    borderRadius: 8,
    marginLeft: 3,
    fontSize: 16,
    color: "#4CA19E",
    fontWeight: "bold",
    paddingLeft: 35,
  },
  box2: {
    borderRadius: 8,
    paddingBottom: 6,
    paddingTop: 6,
    marginTop: 3,
    marginBottom: 3,
    fontSize: 13,
    color: "000",
    paddingRight: 70,
    paddingLeft: -30,
  },
  box3: {
    borderRadius: 8,
    paddingLeft: 6,
    paddingTop: 6,
    paddingBottom: 6,
    marginTop: 3,
    marginBottom: 3,
    fontSize: 13,
    color: "#4CA19E",
    paddingRight: -40,
  },
});

export default EventCard;