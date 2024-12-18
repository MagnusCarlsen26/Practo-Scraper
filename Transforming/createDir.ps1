# Define cities and words
$cities = @("Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad")
$words = @("General Physician", "Cardiologist", "Gynecologist", "Dentist", "Orthopedist", "Pediatrician")

# Create directories
foreach ($city in $cities) {
    foreach ($word in $words) {
        $path = "dbBackup/v1/FinalData/$city/$word"
        New-Item -ItemType Directory -Force -Path $path
    }
}

Write-Host "Directories created successfully!"
