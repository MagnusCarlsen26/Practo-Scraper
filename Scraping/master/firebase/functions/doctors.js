import { collection, setDoc, doc, getDocs, query, where, limit } from "firebase/firestore"
import { db } from './../config.js'

export function addDoctor({doctorId,payload}) {

    setDoc( doc(db, "doctors", doctorId), {
        ...payload,
        timestamp : Date.now(),
        pickedUp: false,
        slotsScraped : false,
        doctorId
    }).catch( error => console.log(error) )
    
    return "ok"
}

export async function pickDoctor() {

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
        else return false
        
    } catch (error) {
        console.error("Error retrieving document: ", error)
    }
}