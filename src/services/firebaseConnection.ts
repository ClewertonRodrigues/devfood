
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"; 

const firebaseConfig = {
  apiKey: "AIzaSyBHzBOCd09yIJtCRJJK5d6PyA6jVPX7qOQ",
  authDomain: "fooddev-22cb4.firebaseapp.com",
  projectId: "fooddev-22cb4",
  storageBucket: "fooddev-22cb4.firebasestorage.app",
  messagingSenderId: "36510008838",
  appId: "1:36510008838:web:a9cff37e63d7fefbb56587"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage }