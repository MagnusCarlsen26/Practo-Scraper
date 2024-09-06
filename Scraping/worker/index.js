import axios from 'axios'
import { parameters, headers } from './constants.js'

const MASTER_URL = 'http://localhost:5000'

function pausecomp(millis)
{
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < millis);
}


async function collectList({ city , specialization , page , category }) {
    try {

        const url = "https://www.practo.com/marketplace-api/dweb/search/provider/v2"
        
        const params = {
            city,page,...parameters,
            q: JSON.stringify([{ word : specialization , "autocompleted": true, category }]),
        }
        
        let response;
        try {
            response = await axios.get(url, { params,headers })
        } catch(error) {
            if (error.code === 'ECONNRESET') {
                console.error('ECONNRESET error:', error.message);
                return collectList({ city , word , page , category })
            } else {
                console.error('Other error:', error);
                process.exit()
            }
        }
        if (Object.keys(response?.data.doctors?.entities).length) return response.data.doctors.entities
        else return false
    } catch (error) {
        console.error("ERR in collectList",error)
        pausecomp(100*1000)
        return collectList({ city , specialization , page , category })
    }
}

async function collectSlots(id) {
    try {

        const url = `https://www.practo.com/health/api/practicedoctors/${id}/slots?mobile=true&group_by_hour=true&logged_in_api=false&first_available=true`
        let response;
        try {
            response = await axios.get(url, { headers })
        } catch(error) {
            if (error.code === 'ECONNRESET') {
                console.error('ECONNRESET error:', error.message);
                return collectSlots(id)
            } else {
                console.error('Other error:', error);
                process.exit()
            }
        }
        return response.data.slots
    } catch (error) {
        console.error("ERR in collectSlots",error)
        pausecomp(100*1000)
        return collectSlots(id)
    }

}

async function cleanDoctorsData( response ) {

    if (!response) return false
    let doctors = []
    for (const key in response) {
        let value = response[key]
        value = {
            doctorId : value.id.toString(),
            payload : {
                doctor_id : value.doctor_id,
                practice_id : value.practice_id,
                image_url : value.image_url,
                profile_url : value.profile_url,
                doctor_name : value.doctor_name,
                specialization : value.specialization,
                qualifications : value.qualifications,
                experience_years : value.experience_years,
                practice : {
                    city : value.practice.city,
                    locality : value.practice.locality,
                    type : value.practice.type,
                    name : value.practice.name
                },
                consultation_fees : value.consultation_fees,
                summary : value.summary?.replace(/[\r\n]/g, ' '),
                recommendation_percent : value.recommendation_percent,
                patients_count : value.patients_count,
                reviews_count : value.reviews_count,
                position : value.position,
                rank : value.rank,
                workerTime : Date.now()
            }
        }
        doctors.push(value)
    }
        
    return doctors
} 
    
async function main() {

    while(1) {
        try {
            const response = await axios.get(`${MASTER_URL}/getTask`)

            if (response.data.success) {
                if (response.data.data.type === 'doctors') {    

                    console.log("Working on",response.data.data.payload)
                    const doctors = await cleanDoctorsData(await collectList(response.data.data.payload))
                    await axios.post(`${MASTER_URL}/sendResultPage`, {
                        results : doctors,
                        pageParams : response.data.data.payload
                    })
                    console.log("Done",response.data.data.payload)

                } else if (response.data.data.type === 'slots') {

                    console.log("Working on",response.data.data.payload.doctorId)
                    const slots = await collectSlots(response.data.data.payload.doctorId)

                    await axios.post(`${MASTER_URL}/sendResultSlots`, {
                        doctorId : response.data.data.payload.doctorId,
                        payload : slots 
                    })
                    console.log("Done",response.data.data.payload.doctorId)

                }

            } else console.error("ERR" , response.data.error.message,"Error")

        } catch (error) {
            console.error("ERR ",error)
        }
    }
}

main()