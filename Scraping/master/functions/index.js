import express from 'express'
import cors from 'cors'
import { addPageParams, pickPageParams, savePageParams, saveParams } from './function/params.js'
import { addDoctor, doctorsScraped, pickDoctor, addGenderDoctor } from './function/doctors.js'
import { saveSlots, slotsScraped } from './function/slots.js'
import { addGenderPageParams, pickGenderPageParams, saveGenderPageParams, saveGenderParams } from './function/genderParams.js'
import bodyParser from 'body-parser'
import functions from 'firebase-functions'
import { logger } from "firebase-functions";
import { db } from './config.js'
import {  collection, addDoc, getDocs, query, where, limit, updateDoc, doc, setDoc, deleteDoc } from "firebase/firestore"


const app = express()

app.use(cors())
app.use(express.json())
app.use(bodyParser.json({ limit: '100mb' }));

app.get('/helloWorld',(_,res) => {

    logger.info("Hello World !!")
    res.send("Hello World !!")

})

app.get('/getTask', async(_,res) => {
    
    try {

        let payload = await pickPageParams()
        if (payload) {
            res.status(200).send({
                success : true,
                data : {
                    type : "doctors",
                    payload
                }
            })
            return
        }

        payload = await pickDoctor()
        if (payload) {
            res.status(200).send({
                success : true,
                data : {
                    type : 'slots',
                    payload
                }
            })
            return
        }

        payload = await pickGenderPageParams()
        if (payload) {
            res.status(200).send({
                success : true,
                data : {
                    type : "gender",
                    payload
                }
            })
            return
        }

        res.status(200).send({
            success : false,
            error : "No pending tasks."
        })
    } catch (error) {
        console.error("ERR in getTask", error)
        console.error(Date.now())
        res.status(500).send(error)
    }

})

app.post('/sendResultPage',async(req,res) => {
    try {

        const { results, pageParams } = req.body
        savePageParams(pageParams)
        
        if (results) {
            await addPageParams({ ...pageParams, page : pageParams.page + 1 })
            results.forEach( async(result) => { await addDoctor(result) })
        }  

        res.status(200).send("ok")
    } catch (error) {
        logger.info("ERR in sendResultPage",error.message)
        console.error(Date.now())
        res.status(500).send(error.message)
    }

})

app.post('/sendGenderResultPage',async(req,res) => {
    try {

        const { results, pageParams } = req.body
        saveGenderPageParams(pageParams)
        console.log(results)
        if (results) {
            await addGenderPageParams({ ...pageParams, page : pageParams.page + 1 })
            results.forEach( async(result) => { await addGenderDoctor(result) })
        }  

        res.status(200).send("ok")
    } catch (error) {
        logger.info("ERR in sendResultPage",error.message)
        console.error(Date.now())
        res.status(500).send(error.message)
    }
})

app.post('/sendResultSlots',async(req,res) => {

    try {
        const { doctorId, payload } = req.body
        await saveSlots({ doctorId, payload })
        res.status(200).send("ok")
    } catch (error) {
        console.error("ERR in sendResults",error.message)
        console.error(Date.now())
        res.status(500).send(error.message)
    }

})

app.get('/doctorsScraped',async(_,res) => {
    try {
        const count = await doctorsScraped()
        res.status(200).json(count)
    } catch (error) {
        console.error("ERR in doctorsScraped",error)
        res.status(500).json(error)
    }
})

app.get('/slotsScraped',async(_,res) => {
    try {
        const count = await slotsScraped()
        res.status(200).json(count)
    } catch (error) {
        console.error("ERR in doctorsScraped",error)
        res.status(500).json(error)
    }
})

app.get('/init',async(_,res) => {

    const cities = ['Delhi', 'Kolkata', 'Chennai', 'Hyderabad', 'Mumbai', 'Bangalore']
    const specializations = ['Cardiologist', 'Dentist', 'General Physician', 'Gynecologist', 'Orthopedist', 'Pediatrician']

    cities.forEach(city => {
        specializations.forEach( specialization => {

            const query = {
                city,
                specialization,
                category : 'subspeciality'
            }

            saveGenderParams(query)
            saveParams(query)

        } )
    })

    res.status(200).send("initialized")

})

async function resetScrapePageParams() {
    try {
        const pageParamsCollection = collection(db, 'genderPageParams');

        const q = query(pageParamsCollection, where('isScraped', '==', false));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log('No matching documents.');
            return;
        }

        const updatePromises = querySnapshot.docs.map((docSnapshot) => {
            const docRef = doc(db, 'genderPageParams', docSnapshot.id);
            return updateDoc(docRef, { isPicked: false });
        });

        await Promise.all(updatePromises);
        console.log('All documents updated successfully.');
    } catch (error) {
        console.error('Error updating documents:', error);
    }
}

// async function resetScrapePageParams() {
//     try {
//         const pageParamsCollection = collection(db, 'genderPageParams');
    
//         const q = query(pageParamsCollection, where('isScraped', '==', false));
//         const querySnapshot = await getDocs(q);
  
//         if (querySnapshot.empty) {
//             console.log('No matching documents.');
//             return;
//         }
  
//         const updatePromises = querySnapshot.docs.map((docSnapshot) => {
//             const docRef = doc(db, 'genderPageParams', docSnapshot.id);
//             return updateDoc(docRef, { isPicked: false });
//         });
  
//         await Promise.all(updatePromises);
//         console.log('All documents updated successfully.');
//     } catch (error) {
//       console.error('Error updating documents:', error);
//     }
// }

// async function resetScrapePageParams() {
//     try {
//         const pageParamsCollection = collection(db, 'pageParams');
    
//         const q = query(pageParamsCollection, where('isScraped', '==', false));
//         const querySnapshot = await getDocs(q);
  
//         if (querySnapshot.empty) {
//             console.log('No matching documents.');
//             return;
//         }
  
//         const updatePromises = querySnapshot.docs.map((docSnapshot) => {
//             const docRef = doc(db, 'pageParams', docSnapshot.id);
//             return updateDoc(docRef, { isPicked: false });
//         });
  
//         await Promise.all(updatePromises);
//         console.log('All documents updated successfully.');
//     } catch (error) {
//       console.error('Error updating documents:', error);
//     }
// }

// async function resetPickPageParams() {
//     try {
//         const pageParamsCollection = collection(db, 'pageParams');
    
//         const q = query(pageParamsCollection, 
//             where('isScraped', '==', true),
//             where('isPicked','==',false)
//         );
//         const querySnapshot = await getDocs(q);
  
//         if (querySnapshot.empty) {
//             console.log('No matching documents.');
//             return;
//         }
  
//         const updatePromises = querySnapshot.docs.map((docSnapshot) => {
//             const docRef = doc(db, 'pageParams', docSnapshot.id);
//             return updateDoc(docRef, { isScraped: false });
//         });
  
//         await Promise.all(updatePromises);
//         console.log('All documents updated successfully.');
//     } catch (error) {
//       console.error('Error updating documents:', error);
//     }
// }

export const master = functions.https.onRequest(app);