import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDoJZwakkxd24_4J-Yp76UAzLb7upstltY",
  authDomain: "atlas-9b85c.firebaseapp.com",
  projectId: "atlas-9b85c",
  storageBucket: "atlas-9b85c.firebasestorage.app",
  messagingSenderId: "717952803334",
  appId: "1:717952803334:web:96ce08d0ad5f5a116d9987",
  measurementId: "G-WE27RMGM4S",
};

// Ensure Firebase is initialized only once
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { app, auth };
