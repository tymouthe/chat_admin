// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; // Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyCJxoIW0DNbungV-6XSkHDGwXbJOaLpLFs",
  authDomain: "chat-920bd.firebaseapp.com",
  projectId: "chat-920bd",
  storageBucket: "chat-920bd.appspot.com",
  messagingSenderId: "645063359782",
  appId: "1:645063359782:web:12e890d685dd3c4e0a15e7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Export the Firestore database
export { db };
