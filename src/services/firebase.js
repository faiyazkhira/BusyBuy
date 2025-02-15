import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDoVIc-1FJlQGcXZXhM9I0ZxXGHudZQ5rI",
  authDomain: "busybuy-8283a.firebaseapp.com",
  projectId: "busybuy-8283a",
  storageBucket: "busybuy-8283a.firebasestorage.app",
  messagingSenderId: "211817262477",
  appId: "1:211817262477:web:729157bb804f75de2d61c4",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
