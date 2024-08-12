import requests
import json
import csv
import os
import time
import json
from pathlib import Path


def createFolder(folder_path):
    os.makedirs(folder_path, exist_ok=True)

def fetch_data(url, headers):
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()


def main(info):
    global x
    if Path(f'{info[2]}/{info[0]}.json').exists() :
        x += 1
        return
    print("FFF","not avaibalb")
    slug = info[1]
    totalPages = 10e9
    reviews = []
    page = 0
    while page < totalPages :
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
        print(type(data["data"]["profileFeedback"]))
        reviews.extend(data["data"]["profileFeedback"]["reviews"])
        totalPages = data["data"]["profileFeedback"]["page_count"]
        page += 1

    with open(f'{info[2]}/{info[0]}.json', 'w') as outfile:
        json.dump(reviews,outfile, indent=4)
    print(f'{info[2]}/{info[0]}.json')

def do() :
    try :
        count = 0
        with open("fuck.csv","r",encoding="utf-8") as file :
            content = list(csv.reader(file))
            for i in range(0,len(content)) : 
                count += 1
                print(content[i][0],count)
                main(content[i])
    except requests.exceptions.HTTPError as e:
        print("Error",e)
        print(count)
        print("retrying")
        time.sleep(10*60)
        do()
    except Exception as e :
        print("Error",e)
        print(count)
        print("retrying")
        time.sleep(10*60)
        do()
x = 0
do()