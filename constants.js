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
    "Referer": "https://www.practo.com/",
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
    with_ad: true
}

queries = {
    cities : [
        // "Mumbai",
        // "Delhi",
        "Bangalore",
        // "Chennai",
        // "Kolkata",
        // "Hyderabad"
    ],
    words : [
        // "General Physician",
        // "Cardiologist",
        "Gynecologist",
        "Dentist",
        // "Orthopedist",
        // "Pediatrician"`,
    ]
}

module.exports = {
    headers,
    parameters,
    queries
};