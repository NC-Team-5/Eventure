import {
  StyleSheet,
  Alert,
  Button,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  getAuth,
  signOut,
  updateProfile,
  updateEmail,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { router } from "expo-router";
import ProfilePicSelect from "@/components/profilePage/ProfilePicSelect";

export default function ProfileScreen() {
  const user = auth.currentUser;

  const [displayName, setDisplayName] = useState(user?.displayName);
  const [newEmailAddress, setNewEmailAddress] = useState(user?.email);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [displayReAuth, setDisplayReAuth] = useState(false);
  const [reAuthPassword, setReAuthPassword] = useState(null);
  const [reAuthEmail, setReAuthEmail] = useState(null);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    validateForm();
  }, [displayName, newEmailAddress]);

  const validateForm = () => {
    const errors = {};

    if (!/\S+@\S+\.\S+/.test(newEmailAddress)) {
      errors.email = "Enter a valid email address";
    }

    if (!displayName) {
      errors.name = "Enter your display name";
    }

    setErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  };

  const handleDisplayNameChange = () => {
    if (isFormValid) {
      updateProfile(user, { displayName })
        .then(() => {
          Alert.alert("Success!", "Display name updated.");
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
          Alert.alert("Success!", "Email address updated.");
        })
        .catch((error) => {
          Alert.alert("Error", error.message);
        });
    }
  };

  const handleReAuth = () => {
    const credential = EmailAuthProvider.credential(user.email, reAuthPassword);
    reauthenticateWithCredential(user, credential)
      .then(() => {
        handleEmailChange();
        setDisplayReAuth(false);
      })
      .catch((error) => {
        Alert.alert("Error", "Reauthentication failed. Please try again.");
      });
  };

  const handlePasswordChange = () => {
    sendPasswordResetEmail(auth, user?.email)
      .then(() => {
        Alert.alert("Success", "Password reset email sent.");
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        router.replace("/");
        Alert.alert("Signed Out", "You have been signed out");
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
          <Text style={styles.inputLabel}>Change your Display Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={setDisplayName}
            placeholder={user?.displayName}
          />
          {showErrors && errors.name && <Text style={styles.error}>{errors.name}</Text>}
          <TouchableOpacity
            onPress={handleDisplayNameChange}
            style={[styles.button, !isFormValid && styles.buttonDisabled]}
            disabled={!isFormValid}
          >
            <Text style={styles.buttonText}>Update display name</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileContainer}>
          <Text style={styles.inputLabel}>Change your email address</Text>
          <TextInput
            style={styles.input}
            onChangeText={setNewEmailAddress}
            keyboardType="email-address"
            placeholder={user?.email}
          />
          {showErrors && errors.email && <Text style={styles.error}>{errors.email}</Text>}
          <TouchableOpacity
            onPress={() => setDisplayReAuth(true)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Update email</Text>
          </TouchableOpacity>

          {displayReAuth && (
            <View style={styles.reAuthContainer}>
              <Text style={styles.inputLabel}>Please re-enter your details to update email</Text>
              <TextInput
                style={styles.input}
                onChangeText={setReAuthEmail}
                value={reAuthEmail}
                placeholder="Email address"
                keyboardType="email-address"
              />
              <TextInput
                style={styles.input}
                onChangeText={setReAuthPassword}
                secureTextEntry={true}
                placeholder="Password"
              />
              <TouchableOpacity
                onPress={handleReAuth}
                style={[styles.button, !isFormValid && styles.buttonDisabled]}
                disabled={!isFormValid}
              >
                <Text style={styles.buttonText}>Submit login details</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.profileContainer}>
          <Text style={styles.inputLabel}>Change your password</Text>
          <TouchableOpacity
            onPress={handlePasswordChange}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Send password reset email</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={handleSignOut} style={styles.button}>
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
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  profileContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4CA19E",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
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
  reAuthContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f4f4f4",
    borderRadius: 8,
  },
});
