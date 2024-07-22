const headers = {
    "accept": "application/json",
    "accept-language": "en-US,en;q=0.9",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "Referer": "https://www.practo.com/search/doctors?results_type=doctor&q=%5B%7B%22word%22%3A%22dentist%22%2C%22autocompleted%22%3Atrue%2C%22category%22%3A%22subspeciality%22%7D%5D&city=Mumbai",
    "Referrer-Policy": "strict-origin-when-cross-origin"
}
const parameters = {
    results_type: "doctor",
    url_path: "/search/doctors",
    ad_limit: 2,
    platform: "desktop_web",
    topaz: true,
    reach_version: "v4",
    enable_partner_listing: true,
    placement: "DOCTOR_SEARCH",
    show_new_reach_card: true,
    tracking_id: "7f9efbb4-5aaf-4ea9-9cf5-f83ff1a9a817",
    with_ad: true
}

queries = {
    cities : [
      // "Mumbai",
//        "Delhi",
        "Bangalore",
    //    "Chennai",
//    "Kolkata",
  //    "Hyderabad"
    ],
    words : [
  //     "General Physician",
    //  "Cardiologist",
 ,
//        "Orthopedist",
  //   "Pediatrician",
        "Gynecologist",
 "Dentist"
    ]
}

module.exports = {
    headers,
    parameters,
    queries
};
