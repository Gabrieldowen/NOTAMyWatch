import google.generativeai as genai
from credentials import GEMINI_API_KEY
import json
import Models
import time



def ParseTestNOTAM(apiOutput=None):
    if apiOutput is None:
        print("*********************\n USING TEST DATA \n*********************")
        # File path where the test JSON data is saved
        file_path = "static/TestData/DEN-DAL_2024-03-27_10:17.json"

        # Reading test JSON data from the file
        with open(file_path, 'r') as json_file:
            apiOutput = json.load(json_file)

        
        NOTAMs = []
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

    return NOTAMs

def buildCall(NOTAMs):
    appendedText = ""
    for notam in NOTAMs:
        appendedText += f"{notam.id}>> {notam.text};;"

    return appendedText

        
def callGemini(untranslated):
    # set up model
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-pro')

    # set up prompt
    prompt = "translate the NOTAM into plain language, removing abbreviations and all newline characters, keeping their id in this format 'NOTAM_id>>translatedText;;':"
    response = model.generate_content(prompt +  untranslated)
    
    # print(response.text) 

    return response.text

def processTranslatedText(translatedTextData, NOTAMs):

    # plit the translated text by the so you have a list of [id, translatedText]
    splitByNOTAM = translatedTextData.split(";;")
    print(f"number of notams after splitting ;; {len(splitByNOTAM)}")

    # for each of those items in the list find the notam that has the same ID and add the translated text to the notam
    for Translation in splitByNOTAM:
        TranslationPair = Translation.split(">>")

        for notam in NOTAMs:
            if notam.id == TranslationPair[0]:
                notam.translatedText = TranslationPair[1]
                break
        
    

    return NOTAMs

if __name__ == '__main__':
    NOTAMs = ParseTestNOTAM()

    appendedText = buildCall(NOTAMs)


    # gemini requests of limit of 60RPM with 30720 tokens which is about 122880 characters
    if len(appendedText) > 122880:
        print(f"Text ({len(appendedText)} char) too large for Gemini API need to divide into smaller chunks")
    else:
        print("Calling Gemini API...")

        # time gemini call
        start_time = time.time()

        translatedTextData = callGemini(appendedText)
        print(f"\ntranslated text: {translatedTextData}")

        # end time and output
        end_time = time.time()
        execution_time = end_time - start_time
        print(f"Gemini processing time: {execution_time} seconds")

        start_time = time.time()
        TranslatedNOTAMs = processTranslatedText(translatedTextData, NOTAMs)
        end_time = time.time()
        execution_time = end_time - start_time
        print(f"parsing translated text time: {execution_time} seconds")

        for notam in TranslatedNOTAMs:
            print(f"*************************\n{notam.id} \n\nBefore traslation: {notam.text}\n\nAfter translation: {notam.translatedText}\n")


        