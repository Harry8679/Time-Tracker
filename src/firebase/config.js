import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_sRIKk9xfjvesxF0djxMjogeAEOt25cs",
  authDomain: "time-tracker-app-a5f08.firebaseapp.com",
  projectId: "time-tracker-app-a5f08",
  storageBucket: "time-tracker-app-a5f08.appspot.com",
  messagingSenderId: "966257790501",
  appId: "1:966257790501:web:e1604a4453c01bd6a039cc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;