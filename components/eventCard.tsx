import { Timestamp } from "firebase/firestore";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter, Link } from "expo-router";
import { useState } from "react";

const EventCard = ({
  event,
}: {
  event: {
    id: string
    name: string;
    location: string;
    date: string;
    numOfGuests: number;
  };
}) => {
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());

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

  const imageUrl =
    "https://firebasestorage.googleapis.com/v0/b/eventure-d4129.firebasestorage.app/o/three-friends.png?alt=media&token=85cabf5a-9048-47eb-820f-90e138b422de";

  const router = useRouter();

  const handlePress = () => {
    console.log("Pressed");
    router.push(`/event`);
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
            <Text style={textBox.box}>
              <Ionicons
                name="person"
                size={14}
                color="black"
                style={{ position: "relative", top: 1.75 }}
              />{" "}
              {event.numOfGuests}
            </Text>
          </View>
          <View style={card.box2}>
            <Text style={textBox.box}>
              {formatDateWithOrdinal(selectedDateTime)}
            </Text>
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
