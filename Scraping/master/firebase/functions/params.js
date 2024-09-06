import {  collection, addDoc, getDocs, query, where, limit, updateDoc } from "firebase/firestore"
import { db } from './../config.js'

export function saveParams({city, specialization, category}) {

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

export function addPageParams({city, specialization, category, page}) {

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

export async function pickPageParams() {

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
        else return false

    } catch (error) {
        console.error("Error retrieving document: ", error)
    }
}

export async function savePageParams({city, specialization, category, page}) {

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
        // console.log(q)
        console.log("func",{city, specialization, category, page})
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


// savePageParams()

// const cities = ['Delhi','Mumbai']
// const specializations = ['Dentist','General Physician']

// cities.forEach(city => {
//     specializations.forEach( specialization => {
//         saveParams({
//             city,
//             specialization,
//             category : 'subspeciality'
//         })
//     } )
// })