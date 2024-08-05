import json
import csv
import pandas as pd
import datetime

def sort_time_strings(time_strings):

   sorted_times = sorted(time_strings, key=lambda x: datetime.datetime.strptime(x, '%Y-%m-%d %H:%M:%S'))
   return sorted_times

def saveSlots(data) :
    allTimeSlots = {}
    for key in data :
        for slot in data[key]["slots"] :
            for slo in slot["slots"]:
                for timeslots in slo["timeslots"]: 
                    allTimeSlots[timeslots["ts"]] = []

    allTimeSlots["id"] = []
    allTimeSlots["gender"] = []
    for key in data :
        for k in allTimeSlots:
            if k != "id" and k!= "gender" :
                allTimeSlots[k].append(-1)
        allTimeSlots["id"].append( data[key]["doctor_name"] )
        allTimeSlots["gender"].append( data[key]["gender"] )

        for slot in data[key]["slots"] :
            for slo in slot["slots"]:
                for timeslots in slo["timeslots"]: 
                    allTimeSlots[timeslots["ts"]][-1] = (timeslots["available"])

    sorted_times = sort_time_strings( [item for item in list(allTimeSlots.keys()) if (item != "id" and item != "gender")] )
    rows = []

    for i in range(len(allTimeSlots["id"])) :
        row = []
        row.append(allTimeSlots['id'][i])
        row.append(allTimeSlots["gender"][i])
        for time in sorted_times:
            row.append( allTimeSlots[time][i] )
        rows.append(row)
   
    return ["Doctor Name"] + ["Gender"] + [ i for i in sorted_times ] , rows

def saveDoctors(data):

    headers = "id,doctor_id,practice_id,image_url,profile_url,doctor_name,gender,specialization," + \
            "qualification,college,completion_year," + \
            "qualification,college,completion_year,experience_years," + \
            "practice_city,practice_locality,practice_type,practice_name," + \
            "consultation_fees,summary,recommendation_percent,patients_count,reviews_count,timestamp," 

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
            data[element].get('timestamp', ''),
            data[element].get('position', '')
        ]
        rows.append(row)

    return headers, rows  