import {  collection, addDoc, getDocs, query, where, limit, updateDoc, doc, setDoc, deleteDoc } from "firebase/firestore"
import { db } from '../config.js'
import { logger, params } from "firebase-functions";

export async function saveParams({city, specialization, category}) {

    try {

        addDoc( collection(db, "params"), {
            city,
            specialization,
            category
        }).catch( error => console.log(error) )
        
        const docRef = doc( db, "pageParams", city+specialization+0);

        await setDoc(docRef, {
            city,
            specialization,
            category,
            page: 0,
            isScraped: false,
            isPicked: false
        })
    } catch (error) {
        logger.error("ERR in saveParams",error)
        logger.error(Date.now())
    }
}

export async function addPageParams({city, specialization, category, page}) {

    try {
        logger.info(city+specialization+page)
        const docRef = doc(collection(db, "pageParams"), city+specialization+page);

        await setDoc(docRef, {
            city,
            specialization,
            category,
            page,
            isScraped : false,
            isPicked : false,
        })
        
        return "ok"
    } catch (error) {
        logger.error("ERR in addPageparams",error)
        logger.error(Date.now())
    }
}

export async function pickPageParams() {
    
    try {

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
            return false
        }
    } catch (error) {
        logger.error("ERR in pickPageparams",error)
        logger.error(Date.now())
    }
}
    
export async function savePageParams({city, specialization, category, page}) {

    try {

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
                
            } else console.error("ERR in savePageParams. Query Doesn't exist",({city, specialization, category, page}))
            
        } catch (error) {
            logger.error("ERR in savePageParams ", error)
        }
    } catch (error) {
        logger.error("ERR in savePageparams",error)
        logger.error(Date.now())
    }
}

async function resetScrapePageParams() {
    try {
        const pageParamsCollection = collection(db, 'pageParams');
    
        const q = query(pageParamsCollection, where('isScraped', '==', false));
        const querySnapshot = await getDocs(q);
  
        if (querySnapshot.empty) {
            console.log('No matching documents.');
            return;
        }
  
        const updatePromises = querySnapshot.docs.map((docSnapshot) => {
            const docRef = doc(db, 'pageParams', docSnapshot.id);
            return updateDoc(docRef, { isPicked: false });
        });
  
        await Promise.all(updatePromises);
        console.log('All documents updated successfully.');
    } catch (error) {
      console.error('Error updating documents:', error);
    }
}

async function resetPickPageParams() {
    try {
        const pageParamsCollection = collection(db, 'pageParams');
    
        const q = query(pageParamsCollection, 
            where('isScraped', '==', true),
            where('isPicked','==',false)
        );
        const querySnapshot = await getDocs(q);
  
        if (querySnapshot.empty) {
            console.log('No matching documents.');
            return;
        }
  
        const updatePromises = querySnapshot.docs.map((docSnapshot) => {
            const docRef = doc(db, 'pageParams', docSnapshot.id);
            return updateDoc(docRef, { isScraped: false });
        });
  
        await Promise.all(updatePromises);
        console.log('All documents updated successfully.');
    } catch (error) {
      console.error('Error updating documents:', error);
    }
}

async function deletePaediatricianDocs() {
    const collectionRef = collection(db, 'pageParams'); 
    const snapshot = await getDocs(collectionRef);
    let deleteCount = 0;
  
    snapshot.forEach(async (document) => {
        if (document.id.includes('Orthopaedic')) {
            await deleteDoc(doc(db, 'pageParams', document.id)); 
            deleteCount++;
        }
    });
  
    if (deleteCount > 0) {
        console.log(`${deleteCount} documents with 'Paediatrictian' in their ID have been deleted.`);
    } else {
        console.log('No documents found with "Paediatrictian" in their ID.');
    }
}

// deletePaediatricianDocs()

// const cities = ['Delhi', 'Kolkata', 'Chennai', 'Hyderabad', 'Mumbai', 'Bangalore']

// const specializations = ['Cardiologist', 'Dentist', 'General Physician', 'Gynecologist', 'Orthopaedic', 'Paediatrician']
// const specializations = ["Orthopedist", "Pediatrician",]



// cities.forEach(city => {

//     specializations.forEach( specialization => {

//         saveParams({

//             city,

//             specialization,

//             category : 'subspeciality'

//         })

//     } )

// })