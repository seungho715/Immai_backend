import requests
import sys
import json
from translate import translate_word, translate_sentence

urlchat = "http://localhost:11434/api/chat"
urlgen = "http://localhost:11434/api/generate"
context_file = 'src/python/context.txt'

# Use for NPC
def llama3chat(messages):
    data = {
        "model": "llama3.1",
        "messages": messages,
        "stream": False,
        # Option 2
        # "format": {
        #     "type": "object",
        #     "properties": {
        #         "french": {
        #             "type": "string"
        #         },
        #         "english": {
        #             "type": "string"
        #         }
        #     },
        #     "required": [
        #         "french",
        #         "english"
        #     ]
        # }
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
        "prompt": prompt,
        "stream": False
    }
    
    headers = {
        'Content-Type': 'application/json'
    }
    
    response = requests.post(urlgen, headers=headers, json=data)
    
    return(response.json()['response'])

def init(role, context):
    history = []

    system_prompt = "You are a " + role + ". " + context

    history.append({"role": "system", "content": system_prompt})
    history.append({"role": "user", "content": ""})

    response = llama3chat(history)
    
    history.append(response['message'])
    # Option 1
    # translation = translate(response['message']['content'])
    # history_translation = [history, translation]

    return json.dumps(history)
    # return json.dumps(history_translation)

def NPC_gen(text, history):
    conversation = json.loads(history)

    conversation.append({"role": "user", "content": text})

    response = llama3chat(conversation)
    
    conversation.append(response['message'])
    # Option 1
    # translation = translate(conversation[-1]['content'])
    # history_translation = [conversation, translation]

    # Option 2
    # Change system prompt to have LLM output in both languages initially
    # Then leave translate as way for backend to get definitions for specific words

    return json.dumps(conversation)
    # return json.dumps(history_translation)

def exercise_gen(word, exercise):
    return llama3gen("Write and only return a sentence in french using the word" + word)

def translate(text):
    return translate_sentence(text)

if __name__ == "__main__":
    methodToUse = sys.argv[1]

    if methodToUse == "init":
        role = sys.argv[2]

        with open(context_file, 'r') as file:
            context = file.read()

        response = init(role, context)
        print(response)

    if methodToUse == "npc":
        inputText = sys.argv[2]
        history = sys.argv[3]

        response = NPC_gen(inputText, history)
        print(response)

    elif methodToUse == "exercise":
        word = sys.argv[2]
        exercise = sys.argv[3]

        response = exercise_gen(word, exercise)
        print(response)

    elif methodToUse == "translate":
        text = sys.argv[2]

        response = translate(text)
        print(response)