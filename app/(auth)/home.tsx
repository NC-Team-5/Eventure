import Header from "../header";
import EventList from "../../components/eventsList";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
//import Event from "@/app/(auth)/event";

// const Stack = createNativeStackNavigator()

export default function HomeScreen() {
  return (
    <>
      <Header />
      <EventList />
      {/* <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Event" component={Event}/>
        </Stack.Navigator>
      </NavigationContainer> */}
    </>
  );
}
