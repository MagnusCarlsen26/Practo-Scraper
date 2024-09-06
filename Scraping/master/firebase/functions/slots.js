import {  setDoc, doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from './../config.js'

export async function saveSlots({doctorId,payload}) {

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