import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";      
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyC27uqOzt_rToQuQM8OepazCnIniVGCgio",
  authDomain: "expense-tracker-40636.firebaseapp.com",
  projectId: "expense-tracker-40636",
  storageBucket: "expense-tracker-40636.firebasestorage.app",
  messagingSenderId: "873047778960",
  appId: "1:873047778960:web:332a7219d813dd0a449a15"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app); 
export const db = getFirestore(app);