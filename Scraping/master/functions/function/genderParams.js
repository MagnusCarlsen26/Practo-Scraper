import {  collection, addDoc, getDocs, query, where, limit, updateDoc, doc, setDoc } from "firebase/firestore"
import { db } from '../config.js'
import { logger } from "firebase-functions";

const genders = ['male','female']

export async function saveGenderParams({city, specialization, category}) {

    try {

        genders.map( async(gender) => {
            
            addDoc( collection(db, "genderParams"), {
                city,
                specialization,
                category,
                gender
            }).catch( error => console.log(error) )
            
            const docRef = doc( db, "genderPageParams", city+specialization+gender+0);
            
            await setDoc(docRef, {
                city,
                specialization,
                category,
                page: 0,
                gender,
                isScraped: false,
                isPicked: false
            } )
        })
    } catch (error) {
        logger.error("ERR in saveParams",error)
        logger.error(Date.now())
    }
}

export async function addGenderPageParams({city, specialization, category, page, gender}) {

    try {
        const docRef = doc(collection(db, "genderPageParams"), city+specialization+gender+page);

        await setDoc(docRef, {
            city,
            specialization,
            category,
            page,
            gender,
            isScraped : false,
            isPicked : false,
        })
        
        return "ok"
    } catch (error) {
        logger.error("ERR in addPageparams",error)
        logger.error(Date.now())
    }
}

export async function pickGenderPageParams() {
    
    try {

        const doctorsCollection = collection(db, "genderPageParams")
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
            console.log(error)
            return false
        }
    } catch (error) {
        logger.error("ERR in pickPageparams",error)
        logger.error(Date.now())
    }
}
    
export async function saveGenderPageParams({city, specialization, category, page, gender}) {

    try {

        const pageParamsCollection = collection(db, "genderPageParams")
        const q = query(
            pageParamsCollection,
            where("city", "==", city),
            where("specialization", "==", specialization),
            where("category", "==", category),
            where("page", "==", page),
            where("gender","==",gender),
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
            logger.error("ERR in savePageParams ", error)
        }
    } catch (error) {
        logger.error("ERR in savePageparams",error)
        logger.error(Date.now())
    }
}
    
// const cities = ['Delhi', 'Kolkata', 'Chennai', 'Hyderabad', 'Mumbai', 'Bangalore']

// const specializations = ['Cardiologist', 'Dentist', 'General Physician', 'Gynecologist', 'Orthopaedic', 'Paediatrician']




// cities.forEach(city => {

//     specializations.forEach( specialization => {

//         saveGenderParams({

//             city,

//             specialization,

//             category : 'subspeciality'

//         })

//     } )

// })