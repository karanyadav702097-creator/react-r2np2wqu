import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAxkg1IddtXL8qCMzqjEV8BLHs6Yfxin3Y",
  authDomain: "sahayak-b3880.firebaseapp.com",
  projectId: "sahayak-b3880",
  storageBucket: "sahayak-b3880.firebasestorage.app",
  messagingSenderId: "953296329932",
  appId: "1:953296329932:web:d7a2663a3c56ad2ebdf669",
  measurementId: "G-EL8RE9Y3TN"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
