import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyAr_E-bxHksDT6ie4yR8T1a-Z814RRQ2jY",
    authDomain: "practoscraper.firebaseapp.com",
    projectId: "practoscraper",
    storageBucket: "practoscraper.firebasestorage.app",
    messagingSenderId: "355432267459",
    appId: "1:355432267459:web:48010b71f98a37dd166c76"
}

export const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)