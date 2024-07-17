const axios = require('axios') 
const fs = require('fs')
const { headers,parameters } = require('./constants.js')

async function f({ city , word , page }) {
    const url = "https://www.practo.com/marketplace-api/dweb/search/provider/v2"
    const params = {
        city,page,...parameters,
        q: JSON.stringify([{ word , "autocompleted": true, "category": "subspeciality" }]),
    }

    const response = await axios.get(url, { params,headers })
    return response.data.doctors.entities
}

let collectedData = {}



async function y() {

    for ( let page = 0;page<11;page ++ ) {

        params = {
            city : "Mumbai",
            word : "dentist",
            page 
        }
        let response = await f(params)
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
    }
    console.log( Object.keys(collectedData).length)

    fs.writeFile("data.json", JSON.stringify(collectedData, null, 4), (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log("Data saved successfully!");
      }
    });
} 

y()

