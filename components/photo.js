import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState, useRef, useEffect } from "react";

const Photos = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState();
  const cameraRef = useRef();

  const imageUrl =
    "https://firebasestorage.googleapis.com/v0/b/eventure-d4129.firebasestorage.app/o/AlexFace.png?alt=media&token=d76371d5-7676-464e-bb9d-35dc9a236db7";

  const takePicture = async () => {
    console.log("Taking picture...");
    let newPhoto = await cameraRef.current.takePictureAsync();
    console.log("Picture taken", newPhoto);
    setPhoto(newPhoto);
  };

  const handleGallery = () => {
    console.log("Pressed");
  };

  useEffect(() => {
    if (permission === null) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  if (permission === null) {
    return <View />;
  }

  return (
    <>
      <View style={card.box}>
        <View style={card.box2}>
          <Image source={{ uri: imageUrl }} style={card.image} />
          <Image source={{ uri: imageUrl }} style={card.image} />
          <Image source={{ uri: imageUrl }} style={card.image} />
          <Image source={{ uri: imageUrl }} style={card.image} />
        </View>
        <View>
          <View
            style={{
              justifyContent: "space-around",
              marginLeft: 0,
              flexDirection: "row",
            }}
          >
            <TouchableOpacity onPress={handleGallery} style={{ padding: 10 }}>
              <Ionicons name="images" size={50} color="black" />
            </TouchableOpacity>

            {!permission.granted && (
              <View style={card.container}>
                <TouchableOpacity
                  onPress={requestPermission}
                  style={{ padding: 10 }}
                >
                  <Ionicons name="camera" size={50} color="black" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        {permission.granted && (
          <View
            style={{
              width: "80%",
              marginLeft: 0,
              marginRight: 0,
              marginBottom: 60,
              aspectRatio: 1 / 1.6,
            }}
          >
            <CameraView ref={cameraRef}>
              <TouchableOpacity
                onPress={takePicture}
                style={{
                  backgroundColor: "#fff",
                  width: "30%",
                  height: "10%",
                  justifyContent: "center",
                  marginHorizontal: "35%",
                  marginTop: "5%",
                  borderRadius: 10,
                }}
              >
                <Text style={{ textAlign: "center", padding: 1 }}>
                  Take Picture
                </Text>
              </TouchableOpacity>
            </CameraView>
          </View>
        )}
      </View>
    </>
  );
};

export default Photos;

const card = StyleSheet.create({
  box: {
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    backgroundColor: "#4CA19E",
    marginBottom: 20,
    padding: 5,
    marginHorizontal: 35,
    borderRadius: 10,

    // iOS Drop Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,

    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  box2: {
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
    borderRadius: 8,
    padding: 12,
    margin: 5,
    fontSize: 13,
    width: 337.5,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  image: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,

    width: 70,
    height: 70,
    borderRadius: 10,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
});
