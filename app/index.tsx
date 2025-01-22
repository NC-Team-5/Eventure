import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { app } from "../firebaseConfig";
import { useRouter, Link } from "expo-router";
import { Image } from "react-native";
import logo from "../assets/images/Designer.png";

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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.subtitle}>Plan your next event</Text>
          <View style={styles.container2}>
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
            <TouchableOpacity
              onPress={() => router.navigate("/signup")}
              style={styles.signupLink}
            >
              <Text style={styles.signupLinkText}>
                Don't have an account? Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F8F8F8",
    flex: 1,
  },
  container2: {
    padding: 10,
    backgroundColor: "#F8F8F8",
    flex: 1,
    marginTop: 50,
  },
  logo: {
    width: 250,
    height: 250,
    alignSelf: "center",
    marginTop: -10,
    marginBottom: -50,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "400",
    color: "#4CA19E",
    marginBottom: -10,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#4CA19E",
    backgroundColor: "#F8FFFC",
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
