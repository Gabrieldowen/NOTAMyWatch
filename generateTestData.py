import json
import datetime
import Models
import GetNOTAM
import AirportsLatLongConverter as alc

def generateTestData(request):
    # get lat/long of airports
    request.startLat, request.startLong = alc.get_lat_and_lon(request.startAirport)
    request.destLat, request.destLong = alc.get_lat_and_lon(request.destAirport)
    
    # call the api
    apiOutputs = GetNOTAM.buildNotam(request.effectiveStartDate, request.effectiveEndDate, request.startLong, request.startLat, request.radius)
    
    return apiOutputs

def saveTestData(request, apiOutputs):
    # Generate a unique filename with date and time
    current_datetime = datetime.datetime.now().strftime("%Y-%m-%d_%H:%M")
    filename = f"static/TestData/{request.startAirport}-{request.destAirport}_{current_datetime}.json"

    # Save apiOutputs as JSON
    with open(filename, 'w') as file:
        json.dump(apiOutputs, file)

    # Print the filename for reference
    print(f"Saved data as {filename}")

if __name__ == "__main__":
    # make the test request
    testDataRequest = Models.NotamRequest({})
    testDataRequest.startAirport = "DEN"
    testDataRequest.destAirport = "DAL"
    testDataRequest.effectiveStartDate = "2024-01-01 00:00:00"
    testDataRequest.effectiveEndDate = "2024-01-02 00:00:00"

    # generate the test data
    apiOutputs = generateTestData(testDataRequest)

    # save the test data
    saveTestData(testDataRequest, apiOutputs)