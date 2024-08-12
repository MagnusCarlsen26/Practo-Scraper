import json
import csv
import json
import csv
from pathlib import Path

def getTags(tags) :
    # print('tags')
    if not tags :
        return "None"
    ans = ""
    # print(type(tags),'f')
    for tag in tags:
        ans += tag["tag"] + ","
    return ans

def getContexts(contexts) :
    # print('contexts')
    if not contexts :
        return "None"
    ans = ""
    for context in contexts :
        ans += context["text"] + ","
    return ans
headers = ["tags","context","found_helpful_data-review_yes_count","found_helpful_data-review_total_count","recommendation","review","reviewed_on","is_online_consult","recommends","patient_name","reply_text","replied_at","replier_name"]
def main(info):
    if not Path(f'{info[2]}/{info[0]}.json').exists() :
        return

    f = open(f'{info[2]}/{info[0]}.json')

    reviews = json.load(f)
    rows = []
    for review in reviews :
        review_data = review.get("review") or {}
        survey_response = review_data.get("survey_response") or {}
        review_reply = review_data.get("review_reply") or {}

        row = [
            getTags(review.get("feedback_summary_tags", [])),
            getContexts(review.get("contexts", [])),
            review.get("found_helpful_data", {}).get("review_yes_count", 0),
            review.get("found_helpful_data", {}).get("review_total_count", 0),
            review_data.get("recommendation", None),
            
            # Using stored variables with safe defaults
            survey_response.get("review_text", ""),
            survey_response.get("reviewed_on", ""),
            survey_response.get("is_online_consult", False),
            
            review.get("patient", {}).get("recommends", None),
            review.get("patient", {}).get("name", ""),
            
            review_reply.get("reply_text", ""),
            review_reply.get("replied_at", ""),
            review_reply.get("replier_name", ""),
        ]



        rows.append(row)
    with open(f'{info[2]}/{info[0]}.csv',"w",newline="",encoding='utf-8') as csvFile :
        csv_writer = csv.writer(csvFile)
        csv_writer.writerow(headers)
        for row in rows :
            csv_writer.writerow(row)

def do() :
    count = 0
    with open("fuck.csv","r",encoding="utf-8") as file :
        content = list(csv.reader(file))
        for i in range(0,len(content)) : 
            count += 1
            main(content[i])

do()