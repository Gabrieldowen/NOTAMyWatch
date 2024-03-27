import json
import Models

def ParseNOTAM(apiOutput=None):
    if apiOutput is None:
        print("*********************\n USING TEST DATA \n*********************")
        # File path where the test JSON data is saved
        file_path = "static/TestData/TestNOTAM.json"

        # Reading test JSON data from the file
        with open(file_path, 'r') as json_file:
            apiOutput = json.load(json_file)

    NOTAMs = []
    try:
        for notam in apiOutput:
            # Check if 'items' key exists in the notam
            if 'items' in notam:
                for item in notam['items']:
                    try:
                        core_notam_data = item.get('properties', {}).get('coreNOTAMData', {}).get('notam')
                        if core_notam_data:
                            NOTAMs.append(Models.Notam(core_notam_data))
                        else:
                            print("Warning: notam missing coreNOTAMData")
                    except Exception as e:
                        print("Error processing item: {e}")
            #
                    # Further checks can be added here to ensure the structure of 'item' is as expected
            #        if 'properties' in item and 'coreNOTAMData' in item['properties'] and 'notam' in item['properties']['coreNOTAMData']:
            #            NOTAMs.append(Models.Notam(item['properties']['coreNOTAMData']['notam']))
            else:
                # Handle the case where 'items' key is missing
                print(f"Warning: 'items' key missing in notam: {notam}")
    except Exception as e:
        print(f"Error occured: {e}")

    return NOTAMs

if __name__ == '__main__':
    NOTAMs = ParseNOTAM()
    print(NOTAMs)