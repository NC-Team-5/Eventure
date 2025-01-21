import {
  ScrollView,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../firebaseConfig.js";

const photoGallery = () => {
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const storage = getStorage();
  const router = useRouter();

  useEffect(() => {
    const q = query(collection(db, "gallery"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const urls = snapshot.docs.map((doc) => doc.data().url);
      setPhotoUrls(urls);
    });

    return () => unsubscribe();
  }, []);

  const backToEventPage = () => {
    router.push(`/event`);
  };

  return (
    <>
      <ScrollView>
        <TouchableOpacity onPress={backToEventPage}>
          <Text style={styles.button}>Back</Text>
        </TouchableOpacity>
        <View style={styles.container}>
          {photoUrls.length > 0 ? (
            photoUrls.map((url, index) => (
              <Image key={index} source={{ uri: url }} style={styles.image} />
            ))
          ) : (
            <Text style={styles.text}>No photos available</Text>
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default photoGallery;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  image: {
    width: 100,
    aspectRatio: 1 | 1,
    margin: 10,
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
  button: {
    margin: 10,
    backgroundColor: "#000",
    width: 50,
    height: 30,
    color: "#fff",
    textAlign: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
});
