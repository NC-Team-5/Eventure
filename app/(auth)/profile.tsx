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
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import "firebase/storage";
import * as firebase from "firebase/app";
import { app } from "../../firebaseConfig";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import ImageViewer from "@/components/profilePage/ProfilePic";

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

  const handleProfilePic = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    console.log(result, "<---result in handleProfilePic");

    const { cancelled, uri, width, height, type } = result;

    const uriToBlob = (uri) => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          // return the blob
          resolve(xhr.response);
        };

        xhr.onerror = function () {
          // something went wrong
          reject(new Error("uriToBlob failed"));
        }; // this helps us get a blob
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);

        xhr.send(null);
      });
    };

    const uploadToFirebase = (blob) => {
      return new Promise((resolve, reject) => {
        var storageRef = firebase.storage().ref();
        storageRef
          .child("uploads/photo.jpg")
          .put(blob, {
            contentType: "image/jpeg",
          })
          .then((snapshot) => {
            blob.close();
            resolve(snapshot);
          })
          .catch((error) => {
            reject(error);
          });
      });
    };

    if (!result.canceled) {
      console.log(result);

      setSelectedImage(result.assets[0].uri);
      updateProfile(user, {
        photoURL: { imageURI },
      })
        .then(() => {
          console.log("profile pic updated");
        })
        .catch((error) => {
          // An error occurred
          // ...
        });
    } else {
      alert("You did not select any image.");
    }
  };

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
      <ThemedText>Welcome, {user?.displayName}</ThemedText>
      <View>
        <ThemedText>Change your profile pic</ThemedText>
        <View style={styles.imageContainer}>
          <ImageViewer
            imgSource={placeholderImage}
            selectedImage={selectedImage}
          />
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
                Please re-enter your login details to update your email address.
              </ThemedText>
              <TextInput
                style={styles.input}
                onChangeText={setReAuthEmail}
                placeholder="Email address"
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
});
