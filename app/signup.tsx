import { StyleSheet, TextInput, Button, Pressable } from "react-native";
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
  const [email, setEmail] = React.useState("Enter your email address");
  const [password, setPassword] = React.useState("Choose a password");
  const [displayName, setDisplayName] = React.useState("Choose a display name");
  const [errors, setErrors] = React.useState({});
  const [isFormValid, setIsFormValid] = React.useState(false);

  React.useEffect(() => {
    // Trigger form validation when name,
    // email, or password changes
    validateForm();
  }, [displayName, email, password]);

  const validateForm = () => {
    let errors = {};

    // Validate name field
    if (!displayName) {
      errors.name = "Name is required.";
    }

    // Validate email field
    if (!email) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid.";
    }

    // Validate password field
    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
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
      console.log("Form has errors. Please correct them.");
    }
  };
  console.log(errors);
  return (
    <>
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
        textContentType="newPassword"
      />
      <TextInput
        style={styles.input}
        onChangeText={setDisplayName}
        placeholder="Choose display name"
      />
      <Button title="Sign Up" onPress={handleSubmit} disabled={!isFormValid} />
      <Link href="/" asChild>
        <Pressable>
          <Button title="Back to Sign In" />
        </Pressable>
      </Link>
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
