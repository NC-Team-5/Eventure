import Header from "../header";
import EventList from "../../components/eventsList";
import React from "react";
import { SafeAreaView } from "react-native";

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <Header />
      <EventList />
    </SafeAreaView>
  );
}
