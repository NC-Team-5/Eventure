import { StyleSheet, TextInput, Button, Alert } from "react-native";
import React from "react";
import { ThemedText } from "@/components/ThemedText";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { app } from "../firebaseConfig";
import { useRouter, Link } from "expo-router";

export default function SignInPage() {
  //State Management
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const router = useRouter();

  //Authentication State Listener
  React.useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in:", user.email);
        router.navigate('/home')
      } else {
        console.log("User is signed out");
      }
    });
    return unsubscribe;
  }, []);

  //Sign In Handler
  const handleSignIn = () => {
    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Successfully logged in as:", user.email);
        Alert.alert("Success!", `Logged in as ${user.email}`);
      })
      .catch((error) => {
        console.log("Login error:", error.code, error.message);
        Alert.alert("Login Failed", error.message);
      });
  };

  //Sign Out Handler
  /*   const handleSignOut = () => {
    const auth = getAuth(app);
    signOut(auth).then(() => {
      console.log("Successfully signed out");
      Alert.alert("Signed Out", "You have been signed out");
    });
  };
 */
  return (
    <>
      <ThemedText>Sign in with your email and password.</ThemedText>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        placeholder="Email address"
        value={email}
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        secureTextEntry={true}
        placeholder="Password"
        value={password}
      />
      <Button title="Log in" onPress={handleSignIn} />
      <Link href="/signup">Sign Up</Link>
    </>
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
