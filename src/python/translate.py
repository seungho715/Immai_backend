import requests
import sys
import json

urlgen = "http://localhost:11434/api/generate"

num_definitions = 3

def aya3gen(prompt):
    data = {
        "model": "aya:8b",
        "prompt": prompt,
        "stream": False
    }
    
    headers = {
        'Content-Type': 'application/json'
    }
    
    response = requests.post(urlgen, headers=headers, json=data)
    
    return(response.json()['response'])

def aya3structure(prompt):
    data = {
        "model": "aya:8b",
        "prompt": prompt,
        "stream": False,
        "format": {
            "type": "object",
            "properties": {
                "definition_1": {
                    "type": "string"
                },
                "definition_2": {
                    "type": "string"
                },
                "definition_3": {
                    "type": "string"
                }
            },
            "required": [
                "definition_1",
                "definition_2",
                "definition_3"
            ]
        }
    }
    
    headers = {
        'Content-Type': 'application/json'
    }
    
    response = requests.post(urlgen, headers=headers, json=data)
    
    return(response.json()['response'])

def translate_word(text):
    prompt = "Translate from french to english and provide" + str(num_definitions) + " : " + text + ". Respond using JSON."

    return aya3gen(prompt)

def translate_sentence(text):
    prompt = "Translate from french to english: " + text

    return aya3gen(prompt)