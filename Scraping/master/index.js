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

app.post('/sendResultPage',async(req,res) => {
    try {

        const { results, pageParams } = req.body
        savePageParams(pageParams)
        
        console.log(req.body)
        if (results) {
            await addPageParams({ ...pageParams, page : pageParams.page + 1 })
            results.forEach( async(result) => { await addDoctor(result) })
        }  

        res.status(200).send("ok")
    } catch (error) {
        console.error(error.message)
        res.status(500).send(error.message)
    }

})

app.post('/sendResultSlots',async(req,res) => {

    try {
        const { doctorId, payload } = req.body
        console.log(doctorId,payload)
        console.log(req.body)
        await saveSlots({ doctorId, payload })
        res.status(200).send("ok")
    } catch (error) {
        console.error(error.message)
        res.status(500).send(error.message)
    }

})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => { 
    console.log(`Server is running on port ${PORT}`)
})
