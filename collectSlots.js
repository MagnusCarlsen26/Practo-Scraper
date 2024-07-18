const axios = require('axios');
const { headers } = require('./constants.js')
const fs  = require('fs')

async function collectSlots(id) {
  const url = `https://www.practo.com/health/api/practicedoctors/${id}/slots?mobile=true&group_by_hour=true&logged_in_api=false&first_available=true`
  
  try {
        const response = await axios.get(url, { headers });
        return response.data.slots

  } catch (error) {
    console.error(error.message);
  }
}


async function y() {
    await Promise.all(Object.keys(data).map(async (id) => {
      const slots = await f(id);
      data[id] = { ...data[id], slots };
    }));
  
    await fs.promises.writeFile("data1.json", JSON.stringify(data, null, 4));
  }
  
  y();
  

y();

