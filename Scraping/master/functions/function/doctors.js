import { collection, setDoc, doc, getDocs, query, where, limit, addDoc } from "firebase/firestore"
import { db } from '../config.js'

export function addDoctor({doctorId,payload}) {

    try {

        setDoc( doc(db, "doctors", doctorId), {
            ...payload,
            timestamp : Date.now(),
            pickedUp: false,
            slotsScraped : false,
            doctorId
        }).catch( error => console.log(error) )
        
        return "ok"
    } catch (error) {
        console.error("ERR in addDoctor",error)
        console.error(Date.now())
    }

}

export async function pickDoctor() {

    try {

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
            console.error("ERR in pick doctors ", error)
        }
    } catch (error) {
        console.error("ERR in pickDoctor",error)
        console.error(Date.now())
    }
}

export async function doctorsScraped() {
    const querySnapshot = await getDocs(collection(db, "doctors"))
    return querySnapshot.size
}
