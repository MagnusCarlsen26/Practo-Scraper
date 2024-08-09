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

async function collectList({ city , word , page , category }) {
    const url = "https://www.practo.com/marketplace-api/dweb/search/provider/v2"

    const params = {
        city,page,...parameters,
        q: JSON.stringify([{ word , "autocompleted": true, category }]),
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
    pausecomp(5000)
    if (Object.keys(response?.data.doctors?.entities).length) return response.data.doctors.entities
    else return false
}

async function collectSlots(id) {
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
    pausecomp(5000)
    return response.data.slots

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

    for( let g = 0;g<1;g++ ) {
        let page = 0
        while ( true ) {
            console.log(page)
            params = { ...params,page,}
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
                    page,
                    timestamp
                }
                response[key] = value
            }
            collectedData = { ...collectedData,...response }
            page ++
        }
    }
    await Promise.all(Object.keys(collectedData).map(async (id) => {
        const slots = await collectSlots(id)
        collectedData[id] = { ...collectedData[id], slots }
    }))

    await fs.promises.writeFile(`FinalData/${params.city}/${params.word}/collectedData.json`, JSON.stringify(collectedData, null, 4) , (err) => {console.log(err)})
    await fs.promises.writeFile(`FinalData/${params.city}/${params.word}/config.json`, JSON.stringify( params , null, 4))
    console.log(`${params.city}/${params.word} done.`)
    pausecomp(60000)
} 

async function processCitiesAndWords(queries) {
    for (let i = 0; i < queries.cities.length; i++) {
      const city = queries.cities[i];
      const promises = [];
  
      for (let j = 0; j < queries.words.length; j++) {
        const word = queries.words[j];
        await (main({
          city,
          word,
          category: "subspeciality"
        }));
      }
  
    }
}

try {
    processCitiesAndWords(queries)  
} catch (error) {
    console.log("ERROR")
}

