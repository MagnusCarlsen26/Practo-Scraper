import csv
import json

with open('./v1/backup.json',encoding="utf-8") as json_file:
    data = json.load(json_file)

def mapCities(string):
    if string[0] == 'B':
        return 'Bangalore',len('Bangalore')
    if string[0] == 'C':
        return 'Chennai',len('Chennai')
    if string[0] == 'D':
        return 'Delhi',len('Delhi')
    if string[0] == 'H':
        return 'Hyderabad',len('Hyderabad')
    if string[0] == 'K':
        return 'Kolkata',len('Kolkata')
    if string[0] == 'M':
        return 'Mumbai',len('Mumbai')

def mapSpecialist(string) :
    if string[0] == 'C' :
        return 'Cardiologist'
    if string[0] == 'D':
        return 'Dentist'
    if string[0] == 'G':
        if string[1] == 'E':
            return 'General Physician'
    if string[0] == 'O':
        return 'Orthopedist'
    if string[0] == 'P':
        return 'Pediatrician'

def saveTOJSON(address,data,name):
    with open(f"{address}/{name}.json", 'w') as json_file:
        json.dump(data, json_file, indent=4)

data = data["__collections__"]

doctorsData = {}

count = 0
for id in data["doctors"] :
    try :
        city = data["doctors"][id]['practice']['city']
        specialization = data["doctors"][id]['specialization']
        key = f"{city}/{specialization}"

        if key not in doctorsData:
            doctorsData[key] = {}

        doctorsData[key][id] = data["doctors"][id]
        doctorsData[key][id]["slots"] = data["slots"][id]["payload"]
    except Exception as e :
        print(e)
        count += 1
        saveTOJSON(".",data["doctors"][id],"error"+str(count))

for doctorData in doctorsData:
    saveTOJSON(f"./v1/FinalData/{doctorData}",doctorsData[doctorData],"collectedData") 
