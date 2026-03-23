import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import {getReactNativePersistence, initializeAuth} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Optionally import the services that you want to use
// import {...} from 'firebase/auth';
// import {...} from 'firebase/database';
// import {...} from 'firebase/firestore';
// import {...} from 'firebase/functions';
// import {...} from 'firebase/storage';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBAfliW_vLavsdza1dNjAaoJ-X3YD-eLbU",
  authDomain: "easy-flower-frontend.firebaseapp.com",
  // databaseURL: 'https://task-management-591df.firebaseio.com',
  projectId: "easy-flower-frontend",
  storageBucket: "easy-flower-frontend.firebasestorage.app",
  messagingSenderId: "847372597058",
  appId: '1:847372597058:web:0cdffba1645198a727badb',
  // measurementId: "G-VEFH9TSZ3Q",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
})
export const db = getFirestore(app);

// const analytics = getAnalytics(app);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

export default app; // Export the initialized app instance
