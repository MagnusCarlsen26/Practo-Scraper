import json
import csv
import os
from utils import saveSlots,saveDoctors
import pandas as pd

def save(path) :
    with open(f"{path}/collectedData.json", "r",encoding="utf-8") as f:
        json_content = f.read()

    if isinstance(json_content, str):
        data = json.loads(json_content)
    else:
        data = json_content

    with open(f"{path}/data.csv", "w", newline="",encoding="utf-8") as csvfile:
        csv_writer = csv.writer(csvfile)
        headers,data = saveDoctors(data)
        csv_writer.writerow(headers.split(","))
        csv_writer.writerows(data)

    with open(f"{path}/collectedData.json", "r",encoding="utf-8") as f:
        json_content = f.read()

    data = json.loads(json_content)

    with open(f"{path}/slots.csv", "w", newline="",encoding='utf-8') as csvfile:
        csv_writer = csv.writer(csvfile)

        headers,rows = saveSlots(data)
        csv_writer.writerow(headers)
        for row in rows :
            csv_writer.writerow(row)

doctorsCSV = []
def extractDoctors(path) :
    global doctorsCSV

    with open(f"{path}/data.csv", 'r',encoding="utf-8") as csvfile:
        with open(f"{path}/slots.csv", 'r',encoding="utf-8") as csvfile1:
            csvreader = list(csv.reader(csvfile))
            csvreader1 = csv.reader(csvfile1)
            for i in range(1,len(csvreader)) :
                slug = csvreader[i][5].split('/')[3].split('?')[0]
                doctorsCSV.append(",".join([csvreader[i][6],slug,path,csvreader[i][7],"\n"]))

def mapDoctorsToNewDoctors(path) :
    print(path)
    oldDoctor = pd.read_csv(path)
    newDoctor = pd.read_csv(f"FinalData/{path.split("FinalData")[1]}")
    newDoctor = newDoctor.merge(oldDoctor[['doctor_id', 'gender']], on='doctor_id', how='left')
    newDoctor.to_csv(f"FinalData/{path.split("FinalData")[1]}",index=False)

def readJson(directory):

    dataframes = []
    count = 0
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(".csv"):
                file_path = os.path.join(root, file)
                print(file_path.split("\\")[8])
                if file_path.split("\\")[8] == 'data.csv' :
                    mapDoctorsToNewDoctors(file_path)
                    continue
                else :
                    continue
                if file_path[-6] == 'a' :
                    file_path = file_path[:len(file_path)-18]
                else :
                    file_path = file_path[:len(file_path)-11] 
                print(file_path)       
                extractDoctors(file_path)
    
readJson(r"C:\Users\tempo\Downloads\Practo_data_version1\FinalData")
with open(f"fuck.csv", "w", newline="",encoding="utf-8") as csvfile:
    csvfile.write("".join(list(set(doctorsCSV))))