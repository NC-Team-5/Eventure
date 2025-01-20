import { ScrollView, Text, View, StyleSheet, SafeAreaView } from "react-native";
import ItemList from "@/components/ItemList";
import GuestList from "@/components/guestList";
import Photos from "@/components/camera";

export default function Event() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Christians Funeral</Text>
          <ItemList />
          <GuestList />
          <Photos />
          {/* <Map /> */}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  scrollContent: {
    flexGrow: 1,
    marginBottom: 50,
  },
  title: {
    fontWeight: "bold",
    fontSize: 30,
    textAlign: "center",
    padding: 20,
  },
});
