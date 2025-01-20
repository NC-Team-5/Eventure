import { View, StyleSheet, TextInput, TouchableOpacity, Text, Alert, SafeAreaView } from "react-native";
import React, { useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { app } from "../firebaseConfig";
import { useRouter } from "expo-router";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const router = useRouter();

  useEffect(() => {
    validateForm();
  }, [displayName, email, password]);

  const validateForm = () => {
    const errors = {};

    if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Enter a valid email address";
    }

    if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (!displayName) {
      errors.name = "Enter your display name";
    }

    setErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  };

  const handleSubmit = () => {
    setShowErrors(true); // Show errors when trying to submit the form

    if (isFormValid) {
      const auth = getAuth(app);
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          updateProfile(user, {
            displayName: displayName,
            photoURL:
              "https://firebasestorage.googleapis.com/v0/b/eventure-d4129.firebasestorage.app/o/profilePics%2Fdefault-profile-pic.jpg?alt=media&token=5d369133-0ba9-4092-9f5a-cede053d990e",
          }).then(() => {
            sendEmailVerification(user);
            Alert.alert("Success!", "Account created. Please verify your email.");
            router.replace("/home");
          });
        })
        .catch((error) => {
          console.log("Sign-up error:", error.message);
          Alert.alert("Error", error.message);
        });
    } else {
      Alert.alert("Invalid Details", "Please check the form for errors.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>Create your account</Text>

        <TextInput
          keyboardType="email-address"
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="Enter email address"
        />

        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          placeholder="Choose a password"
        />

        <TextInput
          style={styles.input}
          onChangeText={setDisplayName}
          autoCapitalize="words"
          value={displayName}
          placeholder="Choose display name"
        />

        <TouchableOpacity
          onPress={handleSubmit}
          style={[styles.button, !isFormValid && styles.buttonDisabled]}
          disabled={!isFormValid}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        {showErrors && Object.values(errors).map((error, index) => (
          <Text key={index} style={styles.error}>
            {error}
          </Text>
        ))}
        <TouchableOpacity onPress={() => router.back()} style={styles.loginLink}>
          <Text style={styles.loginLinkText}>Already have an account? Log In</Text>
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
    fontSize: 28,
    fontWeight: "bold",
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
  buttonDisabled: {
    backgroundColor: "#A0D3D0",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
  },
  loginLink: {
    fontSize: 16,
    color: "#4CA19E",
    marginTop: 20,
    textAlign: "left",
  },
  loginLinkText: {
    fontSize: 16,
    color: "#4CA19E",
    marginTop: 20,
    textAlign: "left",
  },
});
