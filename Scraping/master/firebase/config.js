import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyC96RRbvhR0VhtpWNEbGvlHuB4gPHhI6t4",
    authDomain: "practo-scraper.firebaseapp.com",
    projectId: "practo-scraper",
    storageBucket: "practo-scraper.appspot.com",
    messagingSenderId: "737638871871",
    appId: "1:737638871871:web:144a920a4e24767b70198a"
}

export const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)