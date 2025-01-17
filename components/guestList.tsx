import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useState } from "react";

const GuestList = () => {
  const [isAddingGuest, setAddingGuest] = useState(false);
  const [newGuest, setNewGuest] = useState("");

  const handlePress = () => {
    console.log("Add Guest");
    setAddingGuest(true);
  };

  const handleAddItem = () => {
    if (newGuest.trim() !== "") {
      console.log("New Guest:", newGuest);



      setNewGuest(""); // Clear the input field
      setAddingGuest(false); // Hide the input field
    }
  };

  return (
    <>
      <View style={card.box}>
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
          <TouchableOpacity onPress={handlePress} style={{ marginTop: 10 }}>
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
    alignItems: "flex-start",
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
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    margin: 5,
    fontSize: 13,
    width: 337.5,
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
    width: 280,

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
    width: 337.5,
    height: 40,
  },
});
