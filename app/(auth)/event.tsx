import { ScrollView, Text, View, StyleSheet, Dimensions } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useState } from "react";
import ItemList from "@/components/ItemList";
import GuestList from "@/components/guestList";
//import Map from "@/components/map";
import Photos from "@/components/photo";

export default function Event() {
  //const route = useRoute();
  //const { id } = route.params

  return (
    <>
      <ScrollView>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 30,
            textAlign: "center",
            padding: 20,
          }}
        >
          Christians Funeral
        </Text>
        <ItemList />
        <GuestList />
        <Photos />
        {/* <Map /> */}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get("window").width, // Makes the map full width
    height: Dimensions.get("window").height, // Makes the map full height
  },
});
