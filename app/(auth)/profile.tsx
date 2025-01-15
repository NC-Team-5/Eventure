import {
  StyleSheet,
  Alert,
  Button,
  Text,
  Pressable,
  TextInput,
  View,
  Image,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import React from "react";
import {
  getAuth,
  signOut,
  updateProfile,
  updateEmail,
  sendPasswordResetEmail,
} from "firebase/auth";
import { app } from "../../firebaseConfig";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";

export default function ProfileScreen() {
  const auth = getAuth(app);
  const user = auth.currentUser;

  const [displayName, setDisplayName] = React.useState(user?.displayName);
  const [emailAddress, setEmailAddress] = React.useState(user?.email);
  const [newPassword, setNewPassword] = React.useState(null);
  const [selectedImage, setSelectedImage] = React.useState<string | undefined>(
    undefined
  );
  const [profilePic, setProfilePic] = React.useState(
    "../../assets/images/Profile_avatar_placeholder_large.png"
  );

  const handleDisplayNameChange = () => {
    updateProfile(user, {
      displayName: displayName,
    })
      .then(() => {
        console.log(user?.displayName, "<--your new username");
      })
      .catch((error) => {
        // An error occurred
        // ...
      });
  };
  const handleEmailChange = () => {
    updateEmail(user, emailAddress)
      .then(() => {
        console.log(user?.email, "<--your new email");
      })
      .catch((error) => {
        // An error occurred
        // ...
      });
  };
  const handlePasswordChange = () => {
    sendPasswordResetEmail(auth, user?.email)
      .then(() => {
        console.log("Password reset email sent");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };

  const handleProfilePic = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result);
    } else {
      alert("You did not select any image.");
    }
  };

  //Sign Out Handler
  const handleSignOut = () => {
    const auth = getAuth(app);
    signOut(auth).then(() => {
      router.replace("/");
      console.log("Successfully signed out");
      Alert.alert("Signed Out", "You have been signed out");
    });
  };

  const placeholderImage = require("../../assets/images/Profile_avatar_placeholder_large.png");

  return (
    <>
      <ThemedText>Welcome, {user?.displayName}</ThemedText>
      <View>
        <ThemedText>Change your profile pic</ThemedText>
        <View style={styles.imageContainer}>
          <Image source={placeholderImage} style={styles.image} />
          <View>
            <Button title="Choose profile pic" onPress={handleProfilePic} />
          </View>
        </View>
        <View style={styles.profileContainer}>
          <ThemedText>Change your Display Name</ThemedText>
          <TextInput
            style={styles.input}
            onChangeText={setDisplayName}
            value={displayName}
          />
          <Button
            title="Update display name"
            onPress={handleDisplayNameChange}
          />
        </View>
        <View>
          <ThemedText>Change your email address</ThemedText>
          <TextInput
            style={styles.input}
            onChangeText={setEmailAddress}
            value={emailAddress}
            textContentType="emailAddress"
          />
          <Button title="Update email" onPress={handleEmailChange} />
        </View>
        <View>
          <ThemedText>Change your password</ThemedText>
          <Button
            title="Send password reset email"
            onPress={handlePasswordChange}
          />
        </View>
        <View>
          <Button title="Log out" onPress={handleSignOut} />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  profileContainer: {
    marginBottom: 10,
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: 250,
    height: 250,
    borderRadius: 18,
  },
});
