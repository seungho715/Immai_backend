import requests
import sys
import json

urlchat = "http://localhost:11434/api/chat"
urlgen = "http://localhost:11434/api/generate"
context_file = 'src/python/context.txt'

history = []

# Use for NPC
def llama3chat(messages):
    data = {
        "model": "llama3.1",
        "messages": messages,
        "stream": False
    }
    
    headers = {
        'Content-Type': 'application/json'
    }
    
    response = requests.post(urlchat, headers=headers, json=data)
    
    return(response.json())

# Use for instructive exercises
def llama3gen(prompt):
    data = {
        "model": "llama3.1",
        "prompt": "Write and only return a sentence in french using the word" + prompt,
        "stream": False
    }
    
    headers = {
        'Content-Type': 'application/json'
    }
    
    response = requests.post(urlgen, headers=headers, json=data)
    
    return(response.json()['response'])

def init(role, context):
    system_prompt = "You are a " + role + ". " + context

    history.append({"role": "system", "content": system_prompt})
    history.append({"role": "user", "content": ""})

    response = llama3chat(history)
    
    history.append(response['message'])

    return response['message']['content']

def NPC_gen(text):
    history.append({"role": "user", "content": text})

    response = llama3chat(history)
    
    history.append(response['message'])

    return response['message']['content']

def exercise_gen(word, exercise):
    return llama3gen(word)

if __name__ == "__main__":
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