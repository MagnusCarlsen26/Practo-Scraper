import json
import csv
import os
from utils import saveSlots,saveDoctors

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

doctorsCSV = ""
def extractDoctors(path) :
    global doctorsCSV

    with open(f"{path}/data.csv", 'r',encoding="utf-8") as csvfile:
        with open(f"{path}/slots.csv", 'r',encoding="utf-8") as csvfile1:
            csvreader = list(csv.reader(csvfile))
            csvreader1 = csv.reader(csvfile1)
            for i in range(1,len(csvreader)) :
                slug = csvreader[i][4].split('/')[3].split('?')[0]
                doctorsCSV += ",".join([csvreader[i][5],slug,path,csvreader[i][6],"\n"]) 

def readJson(directory):

    dataframes = []
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(".json"):
                file_path = os.path.join(root, file)
                if file_path[-6] == 'a' :
                    file_path = file_path[:len(file_path)-18]
                else :
                    file_path = file_path[:len(file_path)-11] 
                print(file_path)       
                save(file_path)
    

readJson("./FinalData")

with open(f"fuck.csv", "w", newline="",encoding="utf-8") as csvfile:
    csvfile.write(doctorsCSV)