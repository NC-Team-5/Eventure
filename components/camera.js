import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CameraView, useCameraPermissions } from "expo-camera"; // Ensure you're using the `Camera` component
import { useState, useRef } from "react";

const Photos = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState();
  const [isCameraActive, setIsCameraActive] = useState(false);
  const cameraRef = useRef();

  const imageUrl =
    "https://firebasestorage.googleapis.com/v0/b/eventure-d4129.firebasestorage.app/o/three-friends.png?alt=media&token=85cabf5a-9048-47eb-820f-90e138b422de";

  const takePicture = async () => {
    console.log("Taking picture...");
    if (cameraRef.current) {
      const newPhoto = await cameraRef.current.takePictureAsync();
      console.log("Picture taken", newPhoto);
      setPhoto(newPhoto);
    }
  };

  const exitCamera = () => {
    console.log("Exiting Camera");
    setIsCameraActive(false);
  };

  const handleGallery = () => {
    console.log("Pressed");
  };

  if (permission === null) {
    return <View />;
  }

  if (isCameraActive) {
    return (

      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
      >
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

