import axios from 'axios'
import { parameters, headers } from './constants.js'

const MASTER_URL = 'https://us-central1-practoscraper.cloudfunctions.net/master'

function pausecomp(millis) {
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < millis);
}


async function collectList({ city , specialization , page , category , gender}) {
    try {

        const url = "https://www.practo.com/marketplace-api/dweb/search/provider/v2"
        
        const modifiedFilters = {  }
        if (gender) {
            modifiedFilters['filters[doctor_gender][]'] = gender
        }

        const params = {
            city,page,...parameters,...modifiedFilters,
            q: JSON.stringify([{ word : specialization , "autocompleted": true, category }]),
        }
        
        let response;
        try {
            response = await axios.get(url, { params,headers })
        } catch(error) {
            if (error.response) {
                if (error.response.status === 429) {
                    console.error('Error 429: Too Many Requests', error.response.statusText);
                    pausecomp(100*1000)
                    return collectList({ city, specialization, page, category });
                } else {
                    console.error('Other HTTP error:', error.response.status, error.response.statusText);
                    pausecomp(100*1000)
                    return collectList({ city, specialization, page, category });
                }
            } else if (error.code === 'ECONNRESET') {
                console.error('ECONNRESET error:', error.message);
                return collectList({ city , specialization , page , category })
            } else {
                console.error('Other error:', error);
            }
        }
        Object.keys(response.data.doctors.entities).forEach( key => {
            response.data.doctors.entities[key] =  {
            ...response.data.doctors.entities[key],
            page
        }})

        console.log(response.data.doctors.entities,'f')
        if (Object.keys(response?.data.doctors?.entities).length) return response.data.doctors.entities
        else return false
    } catch (error) {
        console.error("ERR in collectList",error)
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
            if (error.response) {
                if (error.response.status === 429) {
                    console.error('Error 429: Too Many Requests', error.response.statusText);
                    pausecomp(100*1000)
                    return collectSlots(id)
                } else {
                    console.error('Other HTTP error:', error.response.status);
                    pausecomp(100*1000)
                    return collectSlots(id)
                }
            } else if (error.code === 'ECONNRESET') {
                console.error('ECONNRESET error:', error.message);
                return collectSlots(id)
            } else {
                console.error('Other error:', error);
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
                page : value.page,
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
                switch (response.data.data.type) {
                    case 'doctors': {

                        console.log("Working on1", response.data.data.payload);
                        const doctors = await cleanDoctorsData(await collectList(response.data.data.payload));
                        
                        await axios.post(`${MASTER_URL}/sendResultPage`, {
                            results: doctors,
                            pageParams: response.data.data.payload
                        });
                        
                        console.log("Done", response.data.data.payload);
                        break
                    }
                    case 'slots': {
                        console.log("Working on2", response.data.data.payload.doctorId);
                        
                        const slots = await collectSlots(response.data.data.payload.doctorId);
                        
                        await axios.post(`${MASTER_URL}/sendResultSlots`, {
                            doctorId: response.data.data.payload.doctorId,
                            payload: slots
                        });
                        
                        console.log("Done", response.data.data.payload.doctorId);
                        break
                    }
                    case 'gender': {

                        console.log("Working on3", response.data.data.payload);
                        const doctors = await cleanDoctorsData(await collectList(response.data.data.payload));
                        console.log(doctors)
                        await axios.post(`${MASTER_URL}/sendGenderResultPage`, {
                            results: doctors.map(doctor => ({
                                doctorId: doctor.doctorId,
                                gender: response.data.data.payload.gender
                            })),
                            pageParams: response.data.data.payload
                        });
                        
                        console.log("Done", response.data.data.payload);
                        break
                    }
                    default:
                        console.log("Unknown type:", response.data.data.type);
                }
            
            } else console.error("ERR" , response.data.error,"Error")

        } catch (error) {
            console.error("ERR ",error)
        }
    }
}

main()

