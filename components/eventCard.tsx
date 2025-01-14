import { Timestamp } from "firebase/firestore";
import { View, Text, StyleSheet, Image } from "react-native";

const EventCard = ({
  event,
}: {
  event: { name: string; location: string; date: Timestamp };
}) => {
  const timestamp = event.date;
  const dateObject = timestamp.toDate();

  const formattedDate = dateObject.toLocaleDateString();
  const formattedTime = dateObject.toLocaleTimeString();

  const imageUrl =
    "https://firebasestorage.googleapis.com/v0/b/eventure-d4129.firebasestorage.app/o/AlexFace.png?alt=media&token=d76371d5-7676-464e-bb9d-35dc9a236db7";

  return (
    <View style={card.box}>
      <Image source={{ uri: imageUrl }} style={{ width: 60, height: 60 }} />
      <Text style={textBox.box}>{event.name}</Text>
      <Text style={textBox.box}>{event.location}</Text>
      <Text style={textBox.box}>{formattedDate}</Text>
      <Text style={textBox.box}>{formattedTime}</Text>
    </View>
  );
};

const card = StyleSheet.create({
  box: {
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    outlineColor: "#FFFFFF",
    backgroundColor: "#4CA19E",
    marginBottom: 20,
    padding: 5,
    marginHorizontal: 45,
    borderRadius: 10,

    // iOS Drop Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,

    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    flex: 1,
  },
});

const textBox = StyleSheet.create({
  box: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 6,
    margin: 3,
  },
});

export default EventCard;
