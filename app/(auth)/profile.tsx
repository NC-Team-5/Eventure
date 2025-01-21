import {
  StyleSheet,
  Alert,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  signOut,
  updateProfile,
  updateEmail,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { router } from "expo-router";
import ProfilePicSelect from "@/components/profilePage/ProfilePicSelect";

export default function ProfileScreen() {
  const user = auth.currentUser;

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [newEmailAddress, setNewEmailAddress] = useState(user?.email || "");
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Flags to track if fields are touched
  const [isDisplayNameTouched, setIsDisplayNameTouched] = useState(false);
  const [isEmailTouched, setIsEmailTouched] = useState(false);

  useEffect(() => {
    validateForm();
  }, [displayName, newEmailAddress]);

  const validateForm = () => {
    const errors = {};

    if (!/\S+@\S+\.\S+/.test(newEmailAddress)) {
      errors.email = "Enter a valid email address";
    }

    if (!displayName || displayName.trim().length < 2) {
      errors.name = "Display name must be at least 2 characters";
    }

    setErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  };

  const handleDisplayNameChange = () => {
    if (isFormValid) {
      updateProfile(user, { displayName })
        .then(() => {
          Alert.alert(`We'll call you ${displayName}!`);
        })
        .catch((error) => {
          Alert.alert("Error", error.message);
        });
    } else {
      Alert.alert("Invalid details", "Please check the form for errors.");
    }
  };

  const handleEmailChange = () => {
    if (isFormValid) {
      updateEmail(auth.currentUser, newEmailAddress)
        .then(() => {
          Alert.alert(`📧 Your new email address is ${newEmailAddress}`);
        })
        .catch((error) => {
          Alert.alert("Error", error.message);
        });
    }
  };

  const handlePasswordChange = () => {
    sendPasswordResetEmail(auth, user?.email)
      .then(() => {
        Alert.alert("🔐 Password reset email sent");
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        router.replace("/");
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Hey there, {user?.displayName} 👋</Text>

        <View style={styles.profileContainer}>
          <ProfilePicSelect auth={auth} user={user} />
        </View>

        <View style={styles.profileContainer}>
          <Text style={styles.inputLabel}>Display Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              setDisplayName(text);
              setIsDisplayNameTouched(true);
            }}
            placeholder={user?.displayName}
            autoComplete='given-name'
          />
          {errors.name && <Text style={styles.error}>{errors.name}</Text>}
          <TouchableOpacity
            onPress={handleDisplayNameChange}
            style={[
              styles.button,
              (!isDisplayNameTouched || !isFormValid) && styles.buttonDisabled,
            ]}
            disabled={!isDisplayNameTouched || !isFormValid}
          >
            <Text style={styles.buttonText}>Update display name</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileContainer}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              setNewEmailAddress(text);
              setIsEmailTouched(true);
            }}
            keyboardType="email-address"
            autoComplete="email"
            placeholder={user?.email}
          />
          {errors.email && <Text style={styles.error}>{errors.email}</Text>}
          <TouchableOpacity
            onPress={handleEmailChange}
            style={[
              styles.button,
              (!isEmailTouched || !isFormValid) && styles.buttonDisabled,
            ]}
            disabled={!isEmailTouched || !isFormValid}
          >
            <Text style={styles.buttonText}>Update email</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileContainer}>
          <Text style={styles.inputLabel}>Change your password</Text>
          <TouchableOpacity onPress={handlePasswordChange} style={styles.button}>
            <Text style={styles.buttonText}>Send password reset email</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={handleSignOut} style={styles.logOutButton}>
            <Text style={styles.buttonText}>Log out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: "#F9F9F9",
    flex: 1,
  },
  scrollView: {
    padding: 25,
    marginBottom: 50,
    backgroundColor: "#F9F9F9",
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
    marginBottom: 5,
    fontSize: 16,
    color: "#333",
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  profileContainer: {
    marginBottom: 10,
  },
  logOutButton: {
    backgroundColor: "#b2a591",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: -5,
  },
  button: {
    backgroundColor: "#4CA19E",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
    marginBottom: 10,
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
    marginBottom: 5,
  },
});
