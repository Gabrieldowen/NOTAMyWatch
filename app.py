from flask import Flask, render_template, request
import Models
import ParseNOTAM
import MinimalCirclesPath
import AirportsLatLongConverter as alc
import GetNOTAM
import time

app = Flask(__name__)

airportIATA = alc.airportsdata.load('IATA')

@app.route('/', methods=['GET', 'POST'])
def index():
    # If form is submitted
    if request.method == 'POST':
        NotamRequest = Models.NotamRequest(request.form)
        airports = [NotamRequest.startAirport, NotamRequest.destAirport]
        countAirports = 0
        for destination in NotamRequest.destinations:
            airports.append(destination)
            countAirports = countAirports +1
        apiOutputs = []
        
        i = 0
        while i < countAirports:
            
            # get lat/long of airports
            NotamRequest.startLat, NotamRequest.startLong = alc.get_lat_and_lon(airports[i])
            NotamRequest.destLat, NotamRequest.destLong = alc.get_lat_and_lon(airports[i+1])
        
            NotamRequest.radius = int(NotamRequest.radius)
            NotamRequest.pathWidth = int(NotamRequest.pathWidth)

            # get the list of coordinates that need to be called to cover area
            coordList = MinimalCirclesPath.getPath(NotamRequest.startLat, 
                                                   NotamRequest.startLong,
                                                   NotamRequest.destLat,
                                                   NotamRequest.destLong, 
                                                   NotamRequest.radius, # circle radius
                                                   NotamRequest.pathWidth) # path width

            # start timer
            startTime = time.time() 

            # call the API for each point
            print("LOADING...")

            # apiOutputs = [ GetNOTAM.getNotam( NotamRequest.effectiveStartDate,
            #                                     NotamRequest.effectiveEndDate,
            #                                     longitude, # longitude
            #                                     latitude, # latitude
            #                                     1, # page num
            #                                     NotamRequest.radius) #page num here is one temporarily
            #                                     for latitude, longitude in coordList ]
            

            for latitude, longitude in coordList:
                new_data = GetNOTAM.buildNotam(NotamRequest.effectiveStartDate, NotamRequest.effectiveEndDate, longitude, latitude, NotamRequest.radius)
                apiOutputs.extend(new_data)
            i = i+ 1    
        # Record end time
        endTime = time.time()    
        print(f"\ntime calling API {endTime - startTime} seconds")
        
        # takes api output and parse it
        startTime = time.time()  # Record start time
        Notams = ParseNOTAM.ParseNOTAM(apiOutputs)
        endTime = time.time()    # Record end time
        print(f"time parsing: {endTime - startTime} seconds\n")


        return render_template('display.html', notams = Notams)
        
    return render_template('form.html', airportIATA = airportIATA)

if __name__ == '__main__':
    app.run(debug=True)
