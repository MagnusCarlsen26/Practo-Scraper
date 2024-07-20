import json
import csv
import pandas as pd
import datetime

def convert_json_to_csv(data):

  headers = "id,doctor_id,practice_id,image_url,profile_url,doctor_name,gender,specialization," + \
            "qualification,college,completion_year," + \
            "qualification,college,completion_year,experience_years," + \
            "practice_city,practice_locality,practice_type,practice_name," + \
            "consultation_fees,summary,recommendation_percent,patients_count,reviews_count,timestamp \n"

  rows = []

  for element in data:
    qualifications = data[element].get('qualifications', [])
    qual1 = qualifications[0] if qualifications else {}
    qual2 = qualifications[1] if len(qualifications) > 1 else {}
    row = [
      data[element].get('id', ''),
      data[element].get('doctor_id', ''),
      data[element].get('practice_id', ''),
      data[element].get('image_url', ''),
      data[element].get('profile_url', ''),
      data[element].get('doctor_name', ''),
      data[element].get('gender', ''),
      data[element].get('specialization', ''),
      qual1.get('qualification', ''),
      qual1.get('college', ''),
      qual1.get('completion_year', ''),
      qual2.get('qualification', ''),
      qual2.get('college', ''),
      qual2.get('completion_year', ''),
      data[element].get('experience_years', ''),
      data[element].get('practice', {}).get('city', ''),
      data[element].get('practice', {}).get('locality', ''),
      data[element].get('practice', {}).get('type', ''),
      data[element].get('practice', {}).get('name', ''),
      data[element].get('consultation_fees', ''),
      data[element].get('summary', ''),
      data[element].get('recommendation_percent', ''),
      data[element].get('patients_count', ''),
      data[element].get('reviews_count', ''),
      data[element].get('timestamp', '')
    ]
    rows.append(row)

  return headers, rows

with open('collectedData.json', 'r',encoding="utf-8") as f:
  json_content = f.read()

if isinstance(json_content, str):
    data = json.loads(json_content)
else:
    data = json_content

with open('data.csv', 'w', newline='',encoding='utf-8') as csvfile:
  csv_writer = csv.writer(csvfile)
  headers,data = convert_json_to_csv(data)
  csv_writer.writerow(headers.split(','))
  csv_writer.writerows(data)

