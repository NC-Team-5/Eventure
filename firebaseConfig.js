import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBN0CUocz3dUPWlCWzQcNXNVqeadtVbLs0",
  authDomain: "eventure-d4129.firebaseapp.com",
  projectId: "eventure-d4129",
  storageBucket: "eventure-d4129.firebasestorage.app",
  messagingSenderId: "93649401123",
  appId: "1:93649401123:web:0047bf8736c1fc827d8896",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);