import { View, StyleSheet, TextInput, TouchableOpacity, Text, Alert, SafeAreaView } from "react-native";
import React from "react";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { app } from "../firebaseConfig";
import { useRouter, Link } from "expo-router";

export default function SignInPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const router = useRouter();

  React.useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/home");
      } else {
        console.log("User is signed out");
      }
    });
    return unsubscribe;
  }, []);

  const handleSignIn = () => {
    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Successfully logged in as:", user.email);
      })
      .catch((error) => {
        console.log("Login error:", error.code, error.message);
        Alert.alert("Login Failed", error.message);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>Eventure</Text>
        <Text style={styles.subtitle}>Plan your next event</Text>

        <TextInput
          keyboardType="email-address"
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
          secureTextEntry
          placeholder="Password"
          value={password}
        />

        <TouchableOpacity onPress={handleSignIn} style={styles.button}>
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.navigate("/signup")} style={styles.signupLink}>
          <Text style={styles.signupLinkText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: "#F9F9F9",
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4CA19E",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 26,
    fontWeight: "400",
    color: "#4CA19E",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#4CA19E",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#4CA19E",
    padding: 15,
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
  signupLinkText: {
    fontSize: 16,
    color: "#4CA19E",
    marginTop: 20,
    textAlign: "left",
  },
});
