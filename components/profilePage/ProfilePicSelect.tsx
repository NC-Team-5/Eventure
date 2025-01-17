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
import "firebase/storage";
import * as firebase from "firebase/app";
import { app } from "../../firebaseConfig";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import ImageViewer from "@/components/profilePage/ProfilePic";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {
  getAuth,
  signOut,
  updateProfile,
  updateEmail,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

const ProfilePicSelect = () => {
  const [selectedImage, setSelectedImage] = React.useState<string | undefined>(
    undefined
  );
  const [profilePic, setProfilePic] = React.useState(
    "../../assets/images/Profile_avatar_placeholder_large.png"
  );

  const auth = getAuth(app);
  const user = auth.currentUser;
  const storage = getStorage();
  const profilePicsRef = ref(storage, `${user?.displayName}.jpg`);
  const userProfilePicsRef = ref(
    storage,
    `profilePics/${user?.displayName}.jpg`
  );

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
    uploadBytes(userProfilePicsRef, blob)
      .then((snapshot) => {
        const profilePicUrl = getDownloadURL(
          ref(storage, `profilePics/${user?.displayName}.jpg`)
        ).then((url) => {
          setSelectedImage(url);
          updateProfile(user, {
            photoURL: { url },
          })
            .then((result) => {
              // Profile updated!
            })
            .catch((error) => {
              console.log(error, "<---error uploading to Firebase");
            });
        });
      })
      .catch((error) => {});
  };

  const handleOnPress = () => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      //    allowsEditing: true,
      //    quality: 1,
    })
      .then((result) => {
        if (!result.canceled) {
          //const { cancelled, uri, width, height, type } = result;
          setSelectedImage(result.assets[0].uri);
          const uri = result.assets[0].uri;
          uriToBlob(uri);
        } else {
          alert("You did not select any image.");
        }
      })
      .then((blob) => {
        return uploadToFirebase(blob);
      })
      .then((snapshot) => {
        console.log("File uploaded");
      })
      .catch((error) => {
        throw error;
      });
  };

  const placeholderImage = require("../../assets/images/Profile_avatar_placeholder_large.png");
  return (
    <>
      <View style={styles.profileContainer}>
        <ThemedText>Change your profile pic</ThemedText>
        <View style={styles.imageContainer}>
          <ImageViewer
            imgSource={placeholderImage}
            selectedImage={selectedImage}
          />
          <View>
            <Button title="Choose profile pic" onPress={handleOnPress} />
          </View>
        </View>
      </View>
    </>
  );
};

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
    alignItems: "center",
  },
  image: {
    flex: 1,
    width: 250,
    height: 250,
    borderRadius: 18,
  },
});

export default ProfilePicSelect;
