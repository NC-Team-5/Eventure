import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";

const PhotoGallery: React.FC = () => {
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const q = query(collection(db, "gallery"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const urls = snapshot.docs.map((doc) => doc.data().url as string);
      setPhotoUrls(urls);
    });

    return () => unsubscribe();
  }, []);

  const backToEventPage = () => {
    router.push(`/event`);
  };

  return (
    <>
      <SafeAreaView>
        <ScrollView>
          <View>
            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={backToEventPage}
            >
              <Text style={styles.button}>Back</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.container}>
            {photoUrls.length > 0 ? (
              photoUrls.map((url, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedImage(url)}
                >
                  <Image source={{ uri: url }} style={styles.image} />
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.text}>No photos available</Text>
            )}
          </View>
        </ScrollView>

        {/* Modal for Enlarged Image */}
        <Modal
          visible={selectedImage !== null}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSelectedImage(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Image
                source={{ uri: selectedImage ?? "" }}
                style={styles.enlargedImage}
              />
              <TouchableOpacity
                onPress={() => setSelectedImage(null)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
};

export default PhotoGallery;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: 'wrap',
    margin: 10,
  },
  image: {
    width: 80, 
    aspectRatio: 1,
    margin: 5, 
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginTop: 20,
  },
  button: {
    margin: 10,
    backgroundColor: "#000",
    width: 70,
    height: 35,
    color: "#fff",
    textAlign: "center",
    lineHeight: 35,
    borderRadius: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  enlargedImage: {
    width: 300,
    height: 300,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 6,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
