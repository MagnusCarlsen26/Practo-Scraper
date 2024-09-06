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
    return response.data.slots

}
