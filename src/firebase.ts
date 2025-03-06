// firebase.ts
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDkVrZS3190qut4fxeCEI7ZDHea6PBeoGo",
  authDomain: "physics-visualizer.firebaseapp.com",
  projectId: "physics-visualizer",
  storageBucket: "physics-visualizer.firebasestorage.app",
  messagingSenderId: "473329980473",
  appId: "1:473329980473:web:aafe286fe6e8c67d8769e8",
  measurementId: "G-D4V9NWFT36"
};

const app = initializeApp(firebaseConfig);

export default app;
