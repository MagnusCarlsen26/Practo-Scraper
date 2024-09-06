import express from 'express'
import cors from 'cors'
import { addPageParams, pickPageParams, savePageParams } from './firebase/functions/params.js'
import { addDoctor, pickDoctor } from './firebase/functions/doctors.js'
import { saveSlots } from './firebase/functions/slots.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/helloWorld',(req,res) => {

    console.log("Hello World !!")
    res.send("Hello World !!")

})

app.get('/getTask', async(req,res) => {
    
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

    res.status(404).send({
        success : false,
        error : "No pending tasks."
    })
})


app.get('/sendResultPage',async(req,res) => {

    const { results, pageParams } = req.body
    savePageParams(pageParams)
     
    if (results) {
        await addPageParams({ ...pageParams, page : pageParams.page + 1 })
        results.forEach( async(result) => { await addDoctor(result) })
    } 

    res.status(200).send("ok")

})

app.get('/sendResultSlots',async(req,res) => {

    const { doctorId, payload } = req.body
    await saveSlots({ doctorId, payload })
    res.status(200).send("ok")

})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => { 
    console.log(`Server is running on port ${PORT}`)
})

// async function main( params ) {
//     let collectedData = {}

//     for( let g = 0;g<1;g++ ) {
//         let page = 0
//         while ( true ) {
//             console.log(page)
//             params = { ...params,page,}
//             let response = await collectList(params)
//             if (!response) break
            
//             for (const key in response) {
//                 let value = response[key]
//                 value = {
//                     id : value.id,
//                     doctor_id : value.doctor_id,
//                     practice_id : value.practice_id,
//                     image_url : value.image_url,
//                     profile_url : value.profile_url,
//                     doctor_name : value.doctor_name,
//                     specialization : value.specialization,
//                     qualifications : value.qualifications,
//                     experience_years : value.experience_years,
//                     practice : {
//                         city : value.practice.city,
//                         locality : value.practice.locality,
//                         type : value.practice.type,
//                         name : value.practice.name
//                     },
//                     consultation_fees : value.consultation_fees,
//                     summary : value.summary?.replace(/[\r\n]/g, ' '),
//                     recommendation_percent : value.recommendation_percent,
//                     patients_count : value.patients_count,
//                     reviews_count : value.reviews_count,
//                     position : value.position,
//                     rank : value.rank,
//                     page,
//                     timestamp
//                 }
//                 response[key] = value
//             }
//             collectedData = { ...collectedData,...response }
//             page ++
//         }
//     }
//     await Promise.all(Object.keys(collectedData).map(async (id) => {
//         const slots = await collectSlots(id)
//         collectedData[id] = { ...collectedData[id], slots }
//     }))

//     await fs.promises.writeFile(`FinalData/${params.city}/${params.word}/collectedData.json`, JSON.stringify(collectedData, null, 4) , (err) => {console.log(err)})
//     await fs.promises.writeFile(`FinalData/${params.city}/${params.word}/config.json`, JSON.stringify( params , null, 4))
// } 

