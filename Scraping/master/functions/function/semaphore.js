import {  setDoc, doc, getDoc, updateDoc, getDocs, collection } from "firebase/firestore"
import { db } from '../config.js'

export async function isLock(collectionName) {
    try {
        const lockRef = doc(db, "semaphore", collectionName);
        const lockDoc = await getDoc(lockRef);
        
        if (lockDoc.exists()) {
            return lockDoc.data().isLocked;
        } else {
            return false;
        }
    } catch (error) {
        console.error("ERR in checkLock", error);
        console.error(Date.now());
        throw new Error("Error checking lock status");
    }
}


export async function setLock( collectionName ) {

    try {

        await setDoc(doc(db, "semaphore", collectionName), {
            isLocked : true,
        }).catch( error => console.log(error) )
    } catch (error) {
        console.error("ERR in setLock",error)
        console.error(Date.now())
    }
}

export async function releaseLock( collectionName ) {

    try {

        await setDoc(doc(db, "semaphore", collectionName), {
            isLocked : false,
        }).catch( error => console.log(error) )
    } catch (error) {
        console.error("ERR in releaseLock",error)
        console.error(Date.now())
    }
}


releaseLock("doctors")