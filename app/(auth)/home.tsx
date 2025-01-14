import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Text } from "react-native";
// import Header from "../header";
// import EventList from "../../components/eventsList";
import React from "react";

export default function HomeScreen() {
  return (
    <>
      <ThemedText>Sign in with your email and password.</ThemedText>
      <Text>Hello</Text>

      {/* <h1>Home screen</h1>
    
      <Header />
      <EventList /> */}
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
