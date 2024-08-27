import os
import pandas as pd
import json

# todo : filtering on basis of time, gender,replies from doctor

def filterTime(row) :
    time = row["reviewed_on"].split(" ")[0].split("-")[0]
    ans =  True if int(time)>=2020 else False
    return ans

def cleanCsv(path):
        data = pd.read_csv(f"{path.split('Dr')[0]}data.csv")
        doctorCsv = pd.read_csv(path)
        doctor_name = path.split("\\")[3][:-4]
        doctorCsv = doctorCsv[doctorCsv.apply(filterTime, axis=1)]
        doctorCsv.to_csv(path,index=False)

x = 0
def readJson(directory):
    global x
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(".csv"):
                file_path = os.path.join(root, file)

                if file_path.split("\\")[3][0:2] == 'Dr' :
                        print(file_path)
                    # if 'male' not in file_path :
                        x += 1
                        cleanCsv(file_path)
readJson('./FinalData')
print(x)