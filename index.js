const axios = require('axios') 
const fs = require('fs')
const { headers,parameters,queries } = require('./constants.js')

const currentDateTime = new Date()
const timestamp = currentDateTime.toLocaleString('en-US')

function pausecomp(millis)
{
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < millis);
}

async function collectList({ city , word , page , category , gender }) {
    const url = "https://www.practo.com/marketplace-api/dweb/search/provider/v2"

    const modifiedFilters = {  }

    if ( gender === 'male') modifiedFilters['filters[doctor_gender][]'] = 'male'
    if ( gender === 'female' ) modifiedFilters['filters[doctor_gender][]'] = 'female'

    const params = {
        city,page,...parameters,...modifiedFilters,
        q: JSON.stringify([{ word , "autocompleted": true, category }]),
    }

    const response = await axios.get(url, { params,headers })
    if (Object.keys(response.data.doctors?.entities).length) return response.data.doctors.entities
    else return false
}

async function collectSlots(id) {
    const url = `https://www.practo.com/health/api/practicedoctors/${id}/slots?mobile=true&group_by_hour=true&logged_in_api=false&first_available=true`
    
    try {
          const response = await axios.get(url, { headers })
          return response.data.slots
  
    } catch (error) {
      console.error(error.message)
    }
}

async function saveToJSON(collectedData) {
    await Promise.all(Object.keys(collectedData).map(async (id) => {
        const slots = await collectSlots(id)
        collectedData[id] = { ...collectedData[id], slots }
      }))
    
      await fs.promises.writeFile("collectedData.json", JSON.stringify(collectedData, null, 4))
}

async function main( params ) {

    let collectedData = {}
    genders = ['male','female']

    for( let g = 0;g<2;g++ ) {
        const gender = genders[g]
        let page = 0
        while ( true ) {
            
            params = { ...params,page,gender }
            
            let response = await collectList(params)
            if (!response) break
            
            for (const key in response) {
                let value = response[key]
                value = {
                    id : value.id,
                    doctor_id : value.doctor_id,
                    practice_id : value.practice_id,
                    image_url : value.image_url,
                    profile_url : value.profile_url,
                    doctor_name : value.doctor_name,
                    gender,
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
                    timestamp
                }
                response[key] = value
            }
            collectedData = { ...collectedData,...response }
            console.log( "Total Doctors = ",Object.keys(collectedData).length)
            page ++
        }
    }
    console.log(Object.keys(collectedData).length,"F")
    await Promise.all(Object.keys(collectedData).map(async (id) => {
        const slots = await collectSlots(id)
        collectedData[id] = { ...collectedData[id], slots }
    }))

    await fs.promises.writeFile(`FinalData/${params.city}/${params.word}/collectedData.json`, JSON.stringify(collectedData, null, 4) , (err) => {console.log(err)})
    await fs.promises.writeFile(`FinalData/${params.city}/${params.word}/config.json`, JSON.stringify( params , null, 4))
    console.log(`${params.city}/${params.word} done.`)
    pausecomp(10000)
} 

for( let i=0;i<queries.cities.length;i++ )
    for( let j=0;j<queries.words.length;j++ )
        main({
            city : queries.cities[i],
            word : queries.words[j],
            category : "subspeciality"
         })

