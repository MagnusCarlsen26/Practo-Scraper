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

    with f(f"{path}/data.csv", "w", newline="",encoding="utf-8") as csvfile:
        csv_writer = csv.writer(csvfile)
        headers,data = saveDoctors(data)
        csv_writer.writerow(headers.split(","))
        csv_writer.writerows(data)

    with open(f"{path}/collectedData.json", "r",encoding="utf-8") as f:
        json_content = f.read()

    data = json.loads(json_content)

    with open(f"{path}/slots.csv", "w", newline="") as csvfile:
        csv_writer = csv.writer(csvfile)

        headers,rows = saveSlots(data)
        csv_writer.writerow(headers)
        for row in rows :
            csv_writer.writerow(row)

def readJson(directory):

    dataframes = []
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(".json"):
                file_path = os.path.join(root, file)
                save(file_path)
