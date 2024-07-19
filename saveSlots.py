import json
import csv
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

   for key in data :
      for k in allTimeSlots:
         if k != "id" :
            allTimeSlots[k].append(False)
      allTimeSlots["id"].append( data[key]["doctor_name"] )
      for slot in data[key]["slots"] :
         for slo in slot["slots"]:
            for timeslots in slo["timeslots"]: 
               allTimeSlots[timeslots["ts"]][-1] = (timeslots["available"])

   sorted_times = sort_time_strings( [item for item in list(allTimeSlots.keys()) if item != "id"] )
   rows = []

   for i in range(len(allTimeSlots["id"])) :
      row = allTimeSlots['id'][i] + ","
      for time in sorted_times:
         row +=str( allTimeSlots[time][i] )+ ","
      rows.append([row])
   
   return ["Doctor Name"] + [ i for i in sorted_times ] , rows


with open('collectedData.json', 'r',encoding="utf-8") as f:
  json_content = f.read()

if isinstance(json_content, str):
    data = json.loads(json_content)
else:
    data = json_content

with open('slots.csv', 'w', newline='') as csvfile:
   csv_writer = csv.writer(csvfile)

   headers,rows = saveSlots(data)
   csv_writer.writerow(headers)
   for row in rows :
      csv_writer.writerow(row)


