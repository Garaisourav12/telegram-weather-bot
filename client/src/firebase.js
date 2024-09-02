// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
	apiKey: "AIzaSyA3y_jBNfIP2YKQUFikDbxZaAVI3JiZBk8",
	authDomain: "auth-39cb4.firebaseapp.com",
	projectId: "auth-39cb4",
	storageBucket: "auth-39cb4.appspot.com",
	messagingSenderId: "11132773932",
	appId: "1:11132773932:web:3785dfe727c3032e9b9389",
	measurementId: "G-9B3XXV6B4L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
