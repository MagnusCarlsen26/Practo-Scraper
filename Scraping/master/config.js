import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc, setDoc, doc, getDocs, getDoc, query, where, limit, updateDoc } from "firebase/firestore"
import { queries } from './constants.js'

const firebaseConfig = {
    apiKey: "AIzaSyC96RRbvhR0VhtpWNEbGvlHuB4gPHhI6t4",
    authDomain: "practo-scraper.firebaseapp.com",
    projectId: "practo-scraper",
    storageBucket: "practo-scraper.appspot.com",
    messagingSenderId: "737638871871",
    appId: "1:737638871871:web:144a920a4e24767b70198a"
}

const app = initializeApp(firebaseConfig)

const db = getFirestore(app)

function saveParams({city, specialization, category}) {

    addDoc( collection(db, "params"), {
        city,
        specialization,
        category
    }).catch( error => console.log(error) )

    addDoc( collection(db, "pageParams"), {
        city,
        specialization,
        category,
        page : 0,
        isScraped : false,
        isPicked : false
    }).catch( error => console.log(error) )
}

function addPageParams({city, specialization, category, page}) {

    addDoc( collection(db, "pageParams"), {
        city,
        specialization,
        category,
        page,
        isScraped : false,
        isPicked : false,
    }).catch( error => console.log(error) )

    return "ok"
}

async function pickPageParams() {

    const doctorsCollection = collection(db, "pageParams")
    const q = query(
        doctorsCollection,
        where("isScraped", "==", false),
        where("isPicked", "==", false),
        limit(1)
    )

    try {
        const querySnapshot = await getDocs(q)
        const docRef = querySnapshot.docs[0].ref
        await updateDoc(docRef, { isPicked: true })

        if (!querySnapshot.empty) return querySnapshot.docs[0].data()
        else return"No matching doctors found."

    } catch (error) {
        console.error("Error retrieving document: ", error)
    }
}

async function savePageParams({city, specialization, category, page}) {

    const pageParamsCollection = collection(db, "pageParams")

    const q = query(
        pageParamsCollection,
        where("city", "==", city),
        where("specialization", "==", specialization),
        where("category", "==", category),
        where("page", "==", page),
        limit(1)
    )

    try {
        const querySnapshot = await getDocs(q)
        if (!querySnapshot.empty) {

            const docRef = querySnapshot.docs[0].ref
            await updateDoc(docRef, { isScraped: true })
            return "ok"

        } else return ("Document doesn't exist.")
        
    } catch (error) {
        console.error("Error retrieving or updating document: ", error)
    }
}

function addDoctor({doctorId,payload}) {

    setDoc( doc(db, "doctors", doctorId), {
        ...payload,
        timestamp : Date.now(),
        pickedUp: false,
        slotsScraped : false,
        doctorId
    }).catch( error => console.log(error) )
    
    return "ok"
}

async function pickDoctor() {

    const doctorsCollection = collection(db, "doctors")
    const q = query(
        doctorsCollection,
        where("slotsScraped", "==", false),
        where("pickedUp", "==", false),
        limit(1)
    )

    try {
        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) return querySnapshot.docs[0].data()
        else return "No matching doctors found."
        
    } catch (error) {
        console.error("Error retrieving document: ", error)
    }
}


async function saveSlots({doctorId,payload}) {

    const docRef = doc(db, "doctors", doctorId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) await updateDoc(docRef, { pickedUp: true })
    else console.error(`Document id ${doctorId} doesn't exist.`)

    setDoc(doc(db, "slots", doctorId), {
        payload,
        timestamp : Date.now(),
        doctorId
    }).catch( error => console.log(error) )
}

// for (let i = 0 ; i < queries.cities.length ; i++) {
//     const city = queries.cities[i]
//     for (let j = 0 ; j < queries.words.length ; j++) {
//         const word = queries.words[j]
//         console.log(saveParams({
//             city,
//             specialization : word,
//             category: "subspeciality"
//         }))
//     }
// }

// console.log(addPageParams({
//     city : 'Delhi',
//     specialization : 'Pediatrician',
//     category : 'subspeciality',
//     page : 1
// }))


// pickPageParams().then( value => console.log(value) )

// savePageParams({
//     city: 'Hyderabad',
//     specialization: 'General Physician',
//     category: 'subspeciality',
//     page: 0,
// }).then( value => console.log(value) )

// addDoctor({
//     doctorId : '23234',
//     payload : {
//         name : "khsuhal",
//         age : "21"
//     }
// })

// pickDoctor().then( val => console.log(val) )

saveSlots({
    doctorId : '23234',
    payload : [
        {
            days : "monday" ,
            time : ['1am','2am']
        },
        {
            days : "tuesday" ,
            time : ['1am','2am']
        }
    ]
})