import google.generativeai as genai
from credentials import GEMINI_API_KEY
import os




if __name__ == '__main__':
    # set up model
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-pro')

    # set up prompt
    response = model.generate_content("WHAT is a NOTAm.")
    print(response.text)    
