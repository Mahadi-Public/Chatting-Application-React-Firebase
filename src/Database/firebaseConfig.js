// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZUL536a5ytDRniLLs6Svn8C3HbNQTA9U",
  authDomain: "webchattingsapps.firebaseapp.com",
  projectId: "webchattingsapps",
  storageBucket: "webchattingsapps.appspot.com",
  messagingSenderId: "783697835236",
  appId: "1:783697835236:web:3d392f0a6221be282ae8f1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();

export default firebaseConfig;

