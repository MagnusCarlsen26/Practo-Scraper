import requests
import json
import csv
import os

def createFolder(folder_path):
    os.makedirs(folder_path, exist_ok=True)

def fetch_data(url, headers):
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()


def main(info):
    slug = info[1]
    page = 0
    url = f"https://www.practo.com/marketplace-api/dweb/profile/provider/feedback?slug={slug}&profile_type=PROVIDER&page={page}&mr=true&active_filter%5Bid%5D=0&active_filter%5Btext%5D=All&active_filter%5Btype%5D=All&show_recommended_reviews=true&show_feedback_summary_tags=true"

    headers = {
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
    data = fetch_data(url,headers)

    with open(f'{info[2]}/{info[0]}.json', 'w') as outfile:
        json.dump(data, outfile, indent=4)
    print('Data successfully written to comment.json')

with open("fuck.csv","r",encoding="utf-8") as file :
    content = list(csv.reader(file))
    for i in range(0,len(content)) : 
       print(content[i][1])
       main(content[i])