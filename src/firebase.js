// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxkgiIddtXL8qCMzqjEV8BLHs6Yfxin3Y",
  authDomain: "sahayak-b3880.firebaseapp.com",
  projectId: "sahayak-b3880",
  storageBucket: "sahayak-b3880.firebasestorage.app",
  messagingSenderId: "953296329932",
  appId: "1:953296329932:web:d7a2663a3c56ad2ebdf669",
  measurementId: "G-EL8RE9Y3TN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
