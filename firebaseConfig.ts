import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD9bKvD7oiHTDkafAnGw5-7sHVQQ4Jzeag",
  authDomain: "my-mocktail-cabinet.firebaseapp.com",
  projectId: "my-mocktail-cabinet",
  storageBucket: "my-mocktail-cabinet.firebasestorage.app",
  messagingSenderId: "277497022798",
  appId: "1:277497022798:web:436e9f3ad0965f053fb61f",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
