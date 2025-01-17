import {
  StyleSheet,
  TextInput,
  Button,
  Pressable,
  Text,
  View,
} from "react-native";
import React from "react";
import { ThemedText } from "@/components/ThemedText";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { app } from "../firebaseConfig";
import { Link, router } from "expo-router";

export default function SignInPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [displayName, setDisplayName] = React.useState("");
  const [errors, setErrors] = React.useState({});
  const [isFormValid, setIsFormValid] = React.useState(false);
  const [showErrors, setShowErrors] = React.useState(false);

  React.useEffect(() => {
    // Trigger form validation when name,
    // email, or password changes
    validateForm();
  }, [displayName, email, password]);

  const validateForm = () => {
    let errors = {};

    // Validate email field
    if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Enter a valid email address";
    }

    // Validate password field
    if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    // Validate name field
    if (!displayName) {
      errors.name = "Enter your display name";
    }

    // Set the errors and update form validity
    setErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  };

  const handleSubmit = () => {
    if (isFormValid) {
      const auth = getAuth(app);
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed up
          const user = userCredential.user;
          updateProfile(user, {
            displayName: displayName,
          }).then(() => {
            sendEmailVerification(user);
            router.navigate("/(auth)/profile");
          });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(error);
          // ..
        });
    } else {
      // Form is invalid, display error messages
      console.log("Please ensure the details you've entered are valid.");
    }
  };
  console.log(errors);
  return (
    <>
      <ThemedText>Enter your details to get started.</ThemedText>
      <TextInput
        style={styles.input}
        onChangeText={(text) => {
          setEmail(text);
          setShowErrors(true);
        }}
        value={email}
        placeholder="Enter email address"
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        secureTextEntry={true}
        placeholder="Choose a password"
        textContentType="newPassword"
      />
      <TextInput
        style={styles.input}
        onChangeText={setDisplayName}
        value={displayName}
        placeholder="Choose display name"
      />
      <Button title="Sign Up" onPress={handleSubmit} disabled={!isFormValid} />
      <Link href="/" asChild>
        <Pressable>
          <Button title="Back to Sign In" />
        </Pressable>
      </Link>
      <View style={{ display: showErrors ? "flex" : "none" }}>
        {Object.values(errors).map((error, index) => (
          <Text key={index} style={styles.error}>
            {error}
          </Text>
        ))}
      </View>
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
  error: {
    color: "red",
    fontSize: 14,
    marginLeft: 12,
    marginTop: 5,
  },
});
