import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useState, useEffect } from "react";
import { db, auth } from "@/firebaseConfig";
import { collection, query, onSnapshot, addDoc, updateDoc, doc } from "firebase/firestore"; // Firestore real-time listener

const ItemList = ({ eventId }) => {
  const [isAddingItem, setAddingItem] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch items from Firestore with real-time listener
  useEffect(() => {
    const eventItemsCollection = collection(db, "test-events", eventId, "eventItems");
    const q = query(eventItemsCollection);

    // Real-time listener
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedItems = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        isChecked: doc.data().isChecked,
      }));
      setItems(fetchedItems);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching items:", err);
      setError("Failed to fetch items");
      setLoading(false);
    });

    // Cleanup on component unmount
    return () => unsubscribe();
  }, [eventId]);

  const handlePress = () => {
    console.log("Add Item");
    setAddingItem(true);
  };

  const handleAddItem = async () => {
    if (newItem.trim() !== "") {
      try {
        const eventItemsCollection = collection(db, "test-events", eventId, "eventItems");
        await addDoc(eventItemsCollection, {
          name: newItem,
          isChecked: false,
          checkedBy: "",
          addedBy: auth.currentUser?.displayName
        });

        setNewItem("");
        setAddingItem(false);
      } catch (err) {
        console.error("Error adding item:", err);
        setError("Failed to add item");
      }
    }
  };

  const handleCheckboxChange = async (itemId, isChecked) => {
    try {
      const itemRef = doc(db, "test-events", eventId, "eventItems", itemId);
      await updateDoc(itemRef, {
        isChecked: isChecked,
      });
    } catch (err) {
      console.error("Error updating checkbox:", err);
      setError("Failed to update checkbox");
    }
  };

  if (loading) return <Text>Loading items...</Text>;
  if (error) return <Text>{error}</Text>;

  return (
    <>
      <View style={card.box}>
        <View>
          {items.map((item) => (
            <View style={{ flexDirection: "row" }} key={item.id}>
              <Text style={textBox.box}>{item.name}</Text>
              <BouncyCheckbox
                size={35}
                style={{ marginLeft: 10 }}
                isChecked={item.isChecked}
                onPress={(isChecked) => handleCheckboxChange(item.id, isChecked)}
              />
            </View>
          ))}
        </View>

        {isAddingItem ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
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
              <Text style={{ fontSize: 13, color: "#fff" }}>Add</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={handlePress}
            style={{ marginTop: 10, width: "77.5%" }}
          >
            <Text style={card.box2}>Add Item</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

export default ItemList;

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
    width: "100%",
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
    width: "78%",
    height: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
});
