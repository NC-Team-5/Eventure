import { Text, View, TouchableOpacity, StyleSheet, TextInput } from "react-native"
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useState } from "react";


const ItemList = () => {

    const [isAddingItem, setAddingItem] = useState(false)
    const [newItem, setNewItem] = useState('')

    const handlePress = () => {
        console.log("Add Item");
        setAddingItem(true)
      };

      const handleAddItem = () => {
        if (newItem.trim() !== "") {
            console.log("New Item:", newItem);
            setNewItem(""); // Clear the input field
            setAddingItem(false); // Hide the input field
          }
      }

    return (
        <>
        <View style={card.box}>
          <View style={{ flexDirection: "row" }}>
            <Text style={textBox.box}>6 Pack of Beer</Text>
            <BouncyCheckbox size={35} style={{ marginLeft: 10 }} onPress={(isChecked) => {}} />
          </View>
  
          <View style={{ flexDirection: "row" }}>
            <Text style={textBox.box}>Chicken</Text>
            <BouncyCheckbox size={35} style={{ marginLeft: 10 }} onPress={(isChecked) => {}} />
          </View>
  
          <View style={{ flexDirection: "row" }}>
            <Text style={textBox.box}>Flowers</Text>
            <BouncyCheckbox size={35} style={{ marginLeft: 10 }} onPress={(isChecked) => {}} />
          </View>
  
          <View style={{ flexDirection: "row" }}>
            <Text style={textBox.box}>Radio</Text>
            <BouncyCheckbox size={35} style={{ marginLeft: 10 }} onPress={(isChecked) => {}} />
          </View>
  
          {isAddingItem ? (
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
              <TextInput
                style={card.textField}
                placeholder="Enter new item"
                value={newItem}
                onChangeText={setNewItem}
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
                <Text style={{fontSize: 13, color: "#fff" }}>Add</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={handlePress} style={{ marginTop: 10 }}>
              <Text style={card.box2}>Add Item</Text>
            </TouchableOpacity>
          )}
        </View>
      </>
    )
}

export default ItemList

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
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      backgroundColor: "#FFFFFF",
      borderRadius: 8,
      padding: 12,
      margin: 5,
      fontSize: 13,
      width: 337.5,

      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
    },
    textField: {
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
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
    }
  });
  
  const textBox = StyleSheet.create({
    box: {
      backgroundColor: "#FFFFFF",
      borderRadius: 8,
      padding: 12,
      margin: 5,
      fontSize: 13,
      width: 240,
      height: 40,

      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
    },
  });