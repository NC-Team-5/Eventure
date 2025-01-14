import { Timestamp } from "firebase/firestore";
import { View, Text } from "react-native";

const EventCard = ({
  event,
}: {event: { name: string; location: string; date: Timestamp };}) => {

  const timestamp = event.date;
  const dateObject = timestamp.toDate(); 

  const formattedDate = dateObject.toLocaleDateString(); 
  const formattedTime = dateObject.toLocaleTimeString(); 

  return (
    <View>
      <Text>{event.name}</Text>
      <Text>{event.location}</Text>
      <Text>{formattedDate}</Text>
      <Text>{formattedTime}</Text>
    </View>
  );
};

export default EventCard;
