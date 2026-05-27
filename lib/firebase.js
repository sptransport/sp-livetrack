import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD12_6c7XLmVOvnnbADU_bOx5WjB0S1qaY",
  authDomain: "sp-transports.firebaseapp.com",
  projectId: "sp-transports",
  storageBucket: "sp-transports.firebasestorage.app",
  messagingSenderId: "309025178221",
  appId: "1:309025178221:web:87b05137f22493e076b564"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
