import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import { useRouter } from "expo-router";
import { getDownloadURL, ref, uploadBytes, getStorage } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";

const Photos = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState();
  const [isCameraActive, setIsCameraActive] = useState(false);
  const cameraRef = useRef();
  const router = useRouter();
  const storage = getStorage();
  const uniqueId = `${Date.now()}`;
  const galleryRef = ref(storage, `gallery/photo_${uniqueId}.jpg`);

  const imageUrl =
    "https://firebasestorage.googleapis.com/v0/b/eventure-d4129.firebasestorage.app/o/AlexFace.png?alt=media&token=d76371d5-7676-464e-bb9d-35dc9a236db7";

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

  const uploadToFirebase = async (blob) => {
    try {
      const uniqueId = `${Date.now()}`;
      const storageRef = ref(storage, `gallery/photo_${uniqueId}.jpg`);
      await uploadBytes(storageRef, blob);
  
      const downloadUrl = await getDownloadURL(storageRef);
  
      await setDoc(doc(db, "gallery", uniqueId), {
        url: downloadUrl,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Error uploading photo:", error);
      throw error;
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const newPhoto = await cameraRef.current.takePictureAsync();
      setPhoto(newPhoto);
      uriToBlob(photo.uri)
        .then((blob) => {
          return uploadToFirebase(blob);
        })
        .then((snapshot) => {})
        .catch((error) => {
          throw error;
        });
    }
  };

  const exitCamera = () => {
    setIsCameraActive(false);
  };

  const handleGallery = () => {
    router.push(`/gallery`);
  };

  if (permission === null) {
    return <View />;
  }

  if (isCameraActive) {
    return (
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill}>
        <View style={styles.cameraOverlay}>
          <TouchableOpacity onPress={exitCamera} style={styles.exitButton}>
            <Ionicons name="exit" size={60} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
            <Ionicons name="radio-button-on" size={60} color="white" />
          </TouchableOpacity>
        </View>
      </CameraView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View style={styles.box2}>
          <Image source={{ uri: imageUrl }} style={styles.image} />
          <Image source={{ uri: imageUrl }} style={styles.image} />
          <Image source={{ uri: imageUrl }} style={styles.image} />
        </View>
        <View style={styles.iconRow}>
          <TouchableOpacity onPress={handleGallery} style={styles.iconButton}>
            <Ionicons name="images" size={50} color="black" />
          </TouchableOpacity>
          {!permission.granted ? (
            <TouchableOpacity
              onPress={requestPermission}
              style={styles.iconButton}
            >
              <Ionicons name="camera" size={50} color="black" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setIsCameraActive(true)}
              style={styles.iconButton}
            >
              <Ionicons name="camera" size={50} color="black" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default Photos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    alignItems: "center",
    backgroundColor: "#4CA19E",
    marginBottom: 20,
    padding: 5,
    marginHorizontal: 35,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  box2: {
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    padding: 5,
    margin: 5,
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  image: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    margin: 2,
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 20,
  },
  iconButton: {
    padding: 10,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  exitButton: {
    alignSelf: "flex-start",
    marginTop: 22,
    marginLeft: 20,
  },
  captureButton: {
    alignSelf: "center",
    marginBottom: 20,
  },
});
