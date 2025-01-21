import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import React from "react";
import "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import ImageViewer from "@/components/profilePage/ProfilePic";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";

const ProfilePicSelect = () => {
  const user = auth.currentUser;
  const storage = getStorage();
  const userProfilePicsRef = ref(
    storage,
    `profilePics/${user?.displayName}.jpg`
  );

  const [selectedImage, setSelectedImage] = React.useState<string | undefined>(
    undefined
  );
  const [profilePic, setProfilePic] = React.useState(user?.photoURL);

  const uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new Error("uriToBlob failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  };

  const uploadToFirebase = (blob) => {
    uploadBytes(userProfilePicsRef, blob)
      .then(() => {
        const profilePicUrl = getDownloadURL(
          ref(storage, `profilePics/${user?.displayName}.jpg`)
        ).then((url) => {
          updateProfilePic(user, url);
          setSelectedImage(url);
        });
      })
      .catch((error) => { });
  };

  const updateProfilePic = (user, url) => {
    setProfilePic(url);
    updateProfile(user, {
      displayName: user.displayName,
      photoURL: url,
    })
      .then(() => {
        const userDocRef = doc(db, "users", user.uid);
        return setDoc(
          userDocRef,
          { photoUrl: url },
          { merge: true }
        );
      })
      .catch((error) => {
        alert("Could not change profile pic, please try again");
      });
  };

  const handleOnPress = () => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    }).then((result) => {
      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        const uri = result.assets[0].uri;
        uriToBlob(uri)
          .then((blob) => {
            return uploadToFirebase(blob);
          })
          .catch((error) => {
            throw error;
          });
      } else {
        alert("No image selected");
      }
    });
  };

  return (
    <>
      <View style={styles.profileContainer}>
        {/* <ThemedText style={styles.profileText}>Profile Picture</ThemedText> */}
        <View style={styles.imageContainer}>
          <ImageViewer
            imgSource={profilePic}
            selectedImage={selectedImage}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleOnPress}>
              <Text style={styles.buttonText}>Choose from photo library 🖼️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    marginBottom: 10,
    alignItems: "center",
  },
  profileText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "left",
    width: "100%",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  buttonContainer: {
    marginTop: 15,
  },
  button: {
    backgroundColor: "#4CA19E",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfilePicSelect;
