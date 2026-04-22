import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";

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
  apiKey: "AIzaSyAKjnC-VJFT77VIP1xaBl6bzt6Zw1gZc34",
  authDomain: "spa-booking-10df8.firebaseapp.com",
  projectId: "spa-booking-10df8",
  storageBucket: "spa-booking-10df8.firebasestorage.app",
  messagingSenderId: "131980048202",
  appId: "1:131980048202:web:6af8d110902905bf24f3b3"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

// const analytics = getAnalytics(app);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

export default app; // Export the initialized app instance
