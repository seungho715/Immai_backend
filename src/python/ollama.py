import requests
import sys
import json

urlchat = "http://localhost:11434/api/chat"
urlgen = "http://localhost:11434/api/generate"
context_file = 'src\python\context.txt'

# Use for NPC
def llama3chat(prompt, role, context):
    data = {
        "model": "llama3.1",
        "messages": [
            {
              "role": "system",
              "content": "You are a " + role + context + "\nOnly respond in french."
            },
            {
              "role": "user",
              "content": prompt
            }
        ],
        "stream": False
    }
    
    headers = {
        'Content-Type': 'application/json'
    }
    
    response = requests.post(urlchat, headers=headers, json=data)
    
    return(response.json()['message']['content'])

# Use for instructive exercises
def llama3gen(prompt):
    data = {
        "model": "llama3.1",
        "prompt": "write and only return a sentence in french using the word" + prompt,
        "stream": False
    }
    
    headers = {
        'Content-Type': 'application/json'
    }
    
    response = requests.post(urlgen, headers=headers, json=data)
    
    return(response.json()['response'])

# def init(role):
#     data = {
#         "model": "llama3.1",
#         "messages": [
#             {
#               "role": "system",
#               "content": "You are a " + role + ". Only respond in french."
#             }
#         ],
#         "stream": False
#     }
    
#     headers = {
#         'Content-Type': 'application/json'
#     }
    
#     response = requests.post(urlchat, headers=headers, json=data)

#     return(response.json())

def NPC_gen(text, role, context):
    return llama3chat(text, role, context)

def exercise_gen(word, exercise):
    return llama3gen(word)

if __name__ == "__main__":
    # response = llama3chat("write a sentence in french using the word poubelle")
    methodToUse = sys.argv[1]

    if methodToUse == "npc":
        inputText = sys.argv[2]
        role = sys.argv[3]

        with open(context_file, 'r') as file:
            context = file.read()
        response = NPC_gen(inputText, role, context)
        print(response)

    elif methodToUse == "exercise":
        word = sys.argv[2]
        exercise = sys.argv[3]
        response = exercise_gen(word, exercise)
        print(response)