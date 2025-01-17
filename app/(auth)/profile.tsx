import {
  StyleSheet,
  Alert,
  Button,
  Text,
  Pressable,
  TextInput,
  View,
  Image,
  ScrollView,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import React from "react";
import {
  getAuth,
  signOut,
  updateProfile,
  updateEmail,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import "firebase/storage";
import * as firebase from "firebase/app";
import { app } from "../../firebaseConfig";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import ImageViewer from "@/components/profilePage/ProfilePic";
import ProfilePicSelect from "@/components/profilePage/ProfilePicSelect";

export default function ProfileScreen() {
  const auth = getAuth(app);
  const user = auth.currentUser;

  const [displayName, setDisplayName] = React.useState(user?.displayName);
  const [newEmailAddress, setNewEmailAddress] = React.useState(user?.email);

  const [selectedImage, setSelectedImage] = React.useState<string | undefined>(
    undefined
  );
  const [profilePic, setProfilePic] = React.useState(
    "../../assets/images/Profile_avatar_placeholder_large.png"
  );
  const [displayReAuth, setDisplayReAuth] = React.useState(false);
  const [reAuthPassword, setReAuthPassword] = React.useState(null);
  const [reAuthEmail, setReAuthEmail] = React.useState(null);

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
    updateEmail(auth.currentUser, newEmailAddress)
      .then(() => {
        console.log(user?.email, "<--your new email");
      })
      .catch((error) => {
        console.log(error, "<----error in updateEmail");
      });
  };

  //Re-authentication handler when user changes email address
  const handleReAuth = () => {
    const credential = EmailAuthProvider.credential(user.email, reAuthPassword);
    reauthenticateWithCredential(user, credential)
      .then(() => {
        console.log("Successfully authenticated");
      })
      .catch((error) => {
        // An error ocurred
        console.log(error, "Error with re-authentication");
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
      <ScrollView style={styles.scrollView}>
        <ThemedText>Welcome, {user?.displayName}</ThemedText>
        <View>
          <View style={styles.profileContainer}>
            <ProfilePicSelect auth={auth} user={user} />
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
              onChangeText={setNewEmailAddress}
              value={newEmailAddress}
              textContentType="emailAddress"
            />
            <Button
              title="Update email"
              onPress={() => {
                setDisplayReAuth(true);
              }}
            />

            {
              <View style={{ display: displayReAuth ? "flex" : "none" }}>
                <ThemedText>
                  Please re-enter your login details to update your email
                  address.
                </ThemedText>
                <TextInput
                  style={styles.input}
                  onChangeText={setReAuthEmail}
                  placeholder="Email address"
                  keyboardType="email-address"
                />
                <TextInput
                  style={styles.input}
                  onChangeText={setReAuthPassword}
                  secureTextEntry={true}
                  placeholder="Password"
                />
                <Button
                  title="Submit login details"
                  onPress={() => {
                    handleReAuth();
                    handleEmailChange();
                    setDisplayReAuth(false);
                  }}
                />
              </View>
            }
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
      </ScrollView>
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
    alignItems: "center",
  },
  image: {
    flex: 1,
    width: 250,
    height: 250,
    borderRadius: 18,
  },
  scrollView: {
    paddingBottom: 10,
  },
});
