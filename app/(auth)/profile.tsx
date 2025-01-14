import { StyleSheet, Alert, Button, Text, Pressable } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../../firebaseConfig";
import { router } from "expo-router";

export default function ProfileScreen() {
  //Sign Out Handler
  const handleSignOut = () => {
    const auth = getAuth(app);
    signOut(auth).then(() => {
      router.replace("/");
      console.log("Successfully signed out");
      Alert.alert("Signed Out", "You have been signed out");
    });
  };

  return (
    <>
      <ThemedText>Manage your profile</ThemedText>
      <Text>Hello</Text>
      <Button title="Log out" onPress={handleSignOut} />
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
