import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import { getDownloadURL, ref, uploadBytes, getStorage } from "firebase/storage";
import {
  doc,
  setDoc,
  query,
  collection,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";

const Photos = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUrls, setPhotoUrls] = useState([]);
  const [photo, setPhoto] = useState();
  const [isCameraActive, setIsCameraActive] = useState(false);
  const cameraRef = useRef();
  const router = useRouter();
  const storage = getStorage();
  const uniqueId = `${Date.now()}`;
  const galleryRef = ref(storage, `gallery/photo_${uniqueId}.jpg`);

  const imageUrl =
    "https://firebasestorage.googleapis.com/v0/b/eventure-d4129.firebasestorage.app/o/three-friends.png?alt=media&token=85cabf5a-9048-47eb-820f-90e138b422de";

  useEffect(() => {
    const q = query(collection(db, "gallery"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const urls = snapshot.docs.map((doc) => doc.data().url);
      setPhotoUrls(urls);
    });

    return () => unsubscribe();
  }, []);

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

  const delay = ms => new Promise(res => setTimeout(res, ms));

  const takePicture = async () => {
    if (cameraRef.current) {
      const newPhoto = await cameraRef.current.takePictureAsync();
      setPhoto(newPhoto);
      await delay(100)
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
            <Ionicons name="exit" size={60} color="black" />
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
          {photoUrls.slice(0, 6).map((url, index) => (
            <Image key={index} source={{ uri: url }} style={styles.image} />
          ))}
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
    padding: 15,
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
    padding: 8,
    marginHorizontal: 10,
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: '#fff',
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
