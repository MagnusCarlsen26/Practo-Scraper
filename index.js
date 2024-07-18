const axios = require('axios') 
const fs = require('fs')
const { headers,parameters } = require('./constants.js')

async function collectList({ city , word , page , category }) {
    const url = "https://www.practo.com/marketplace-api/dweb/search/provider/v2"
    const params = {
        city,page,...parameters,
        q: JSON.stringify([{ word , "autocompleted": true, category }]),
    }

    const response = await axios.get(url, { params,headers })
    if (Object.keys(response.data.doctors?.entities).length) return response.data.doctors.entities
    else return false
}

async function collectSlots(id) {
    console.log("COLLECTING DATA")
    const url = `https://www.practo.com/health/api/practicedoctors/${id}/slots?mobile=true&group_by_hour=true&logged_in_api=false&first_available=true`
    
    try {
          const response = await axios.get(url, { headers });
          return response.data.slots
  
    } catch (error) {
      console.error(error.message);
    }
  }

let collectedData = {}

async function main(  ) {

    let page = 0;
    while ( true ) {

        params = {
            city : "Delhi",
            word : "General Physician",
            category : "subspeciality",
            page 
        }
        let response = await collectList(params)
        if (!response) break

        for (const key in response) {
            let value = response[key];
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
                summary : value.summary,
                recommendation_percent : value.recommendation_percent,
                patients_count : value.patients_count,
                reviews_count : value.reviews_count,

            }
            response[key] = value
        }
        collectedData = { ...collectedData,...response }
        console.log( "Total Doctors = ",Object.keys(collectedData).length)
        page ++
    }

    await Promise.all(Object.keys(collectedData).map(async (id) => {
      const slots = await collectSlots(id);
      collectedData[id] = { ...collectedData[id], slots };
    }));
  
    await fs.promises.writeFile("collectedData.json", JSON.stringify(collectedData, null, 4));

} 

main()

