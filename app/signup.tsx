import { StyleSheet, TextInput, Button } from "react-native";
import React from "react";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebaseConfig";
import { Link } from "expo-router";

export default function SignInPage() {
  const [email, setEmail] = React.useState("Enter your email address");
  const [password, setPassword] = React.useState("Choose a password");
  const [displayName, setDisplayName] = React.useState("Choose a display name");

  const handleSubmit = () => {
    const auth = getAuth(app);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        // ...
      })
      .then((user) => {
        console.log(user, "<----user console");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error);
        // ..
      });
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Sign Up</ThemedText>
      </ThemedView>
      <ThemedText>
        Enter an email address and password to get started.
      </ThemedText>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        placeholder="Enter email address"
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        secureTextEntry={true}
        placeholder="Choose a password"
      />
      <TextInput
        style={styles.input}
        onChangeText={setDisplayName}
        placeholder="Choose display name"
      />
      <Button title="Sign Up" onPress={handleSubmit} />
      <Link href="/">Back to Sign In</Link>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
