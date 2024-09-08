import {  setDoc, doc, getDoc, updateDoc, getDocs, collection } from "firebase/firestore"
import { db } from '../config.js'

export async function saveSlots({doctorId,payload}) {

    try {

        const docRef = doc(db, "doctors", doctorId)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) await updateDoc(docRef, { slotsScraped: true })
            else console.error(`Document id ${doctorId} doesn't exist.`)
        
        setDoc(doc(db, "slots", doctorId), {
            payload,
            timestamp : Date.now(),
            doctorId
        }).catch( error => console.log(error) )
    } catch (error) {
        console.error("ERR in saveSlots",error)
        console.error(Date.now())
    }
}

export async function slotsScraped() {
    const querySnapshot = await getDocs(collection(db, "slots"))
    return querySnapshot.size
}
