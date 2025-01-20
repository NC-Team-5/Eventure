import { View, StyleSheet, TextInput, Button, Alert, TouchableOpacity, Text, ScrollView } from "react-native";
import React from "react";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
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
        router.replace("/home");
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Eventure</Text>


      <TextInput
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
        importantForAutofill="yes"
        autoCapitalize="none"
        autoCorrect={false}
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


      <TouchableOpacity onPress={handleSignIn} style={styles.button}>
        <Text style={styles.buttonText}>Log in</Text>
      </TouchableOpacity>


      <Link href="/signup" style={styles.signupLink}>Don't have an account? Sign Up</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: "#F9F9F9",
    flexGrow: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4CA19E",
    marginBottom: 20,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#4CA19E",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#4CA19E",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupLink: {
    fontSize: 16,
    color: "#4CA19E",
    marginTop: 20,
    textAlign: "center",
  },
});
