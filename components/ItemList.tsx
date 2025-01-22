import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useState, useEffect } from "react";
import { db, auth } from "@/firebaseConfig";
import { collection, query, onSnapshot, addDoc, updateDoc, doc } from "firebase/firestore";

const ItemList = ({ eventId }) => {
  const [newItem, setNewItem] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const eventItemsCollection = collection(db, "test-events", eventId, "eventItems");
    const q = query(eventItemsCollection);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedItems = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        isChecked: doc.data().isChecked,
        checkedBy: doc.data().checkedBy
      }));
      setItems(fetchedItems);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching items:", err);
      setError("Failed to fetch items");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [eventId]);

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
        checkedBy: isChecked ? auth.currentUser?.displayName : ""
      });
    } catch (err) {
      console.error("Error updating checkbox:", err);
      setError("Failed to update checkbox");
    }
  };

  if (loading) return <Text>Loading items...</Text>;
  if (error) return <Text>{error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.inputLabel}>📋 Stuff to bring</Text>
      <View>
        {items.map((item) => (
          <View
            style={styles.itemContainer}
            key={item.id}>
            <BouncyCheckbox
              size={25}
              style={styles.checkbox}
              fillColor="#4CA19E"
              isChecked={item.isChecked}
              onPress={(isChecked) => handleCheckboxChange(item.id, isChecked)}
            />
            {(item.checkedBy && item.isChecked) ? (
              <Text style={styles.checkedItem}>
                {item.name} - {item.checkedBy}
              </Text>
            ) : (
              <Text style={styles.itemText}>{item.name}</Text>
            )}
          </View>
        ))}
      </View>

      <View style={styles.addItemContainer}>
        <TextInput
          placeholder="What did you forget?"
          onChangeText={setNewItem}
          style={styles.input}
          autoCapitalize="words"
          maxLength={75}
          returnKeyType="next"
          enablesReturnKeyAutomatically={true}
          blurOnSubmit={false}
          onSubmitEditing={handleAddItem}
          value={newItem}
        />
        <TouchableOpacity
          onPress={handleAddItem}
          style={styles.button}>
          <Text style={styles.buttonText}>➕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 25,
    backgroundColor: "#F9F9F9",
    flex: 1,
  },
  itemContainer: {
    flexDirection: "row",
    alignContent: "flex-start",
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
  },
  checkbox: {
    marginLeft: 10,
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
  checkedItem: {
    fontSize: 16,
    color: "#666",
    textDecorationLine: "line-through",
  },
  addItemContainer: {
    marginTop: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#4CA19E",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 5,
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  button: {
    backgroundColor: "#4CA19E",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ItemList;
