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
    
    try:
        response = requests.post(urlgen, headers=headers, json=data)
        response.raise_for_status() # Raise an exception for HTTP errors
        data = response.json()
        generated_text = data.get('response', "No exercise generated. Please refine your input.")

    except requests.exceptions.RequestException as e:
        return {
            "error": f"An error occurred: {e}"
        }
    
    return generated_text

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

"""
Generate language learning exercises using the ollama API with predefined exercises
Args:
    language (str): The language to learn (e.g. spanish, french)
    difficulty (str): How difficult you wnat it to be (beginner, intermediate, advanced)
    exercise_type (str): The type of exercise to generate ( eg FITB, word definition, etc.)
Returns:
    str: The generated language learning exercise with the correct answer
"""
def exercise_gen(language: str, difficulty: str, exercise_type: str):

    exercise_prompts = {
        "fill in the blank": f"Create a {difficulty}-level {language} exercise where the user must fill in the blanks in sentences. Provide the correct answers after the exercise.",
        "match the meaning": f"Generate a {difficulty}-level {language} exercise where the user matches words to their meanings. Provide the correct answers after the exercise.",
        "sentence reordering": f"Design a {difficulty}-level {language} exercise where the user must reorder jumbled words to form correct sentences. Provide the correct answers after the exercise.",
        "translation": f"Create a {difficulty}-level {language} exercise where the user translates sentences into English. Provide the correct answers after the exercise.",
        "multiple choice": f"Generate a {difficulty}-level {language} quiz with five multiple-choice questions to test vocabulary. Provide the correct answers after the exercise."
    }

    
    # Check if the exercise type is supported
    if exercise_type not in exercise_prompts:
        return {
            "error": f"Unsupported exercise type '{exercise_type}'. Supported types are: {', '.join(exercise_prompts.keys())}."
        }
    # Get the prompt for the chosen exercise type
    prompt = exercise_prompts[exercise_type]
    generated_text = llama3gen(prompt)
    
    if "Correct Answers:" in generated_text:
        exercise_part, answers_part = generated_text.split("Correct Answers:", 1)
    else:
        exercise_part, answers_part = generated_text, ""
    
    return {
        "language": language,
        "difficulty": difficulty,
        "exercise_type": exercise_type,
        "exercise": exercise_part.strip(),
        "answers": answers_part.strip()
    }

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
        language = sys.argv[2]
        difficulty = sys.argv[3]
        exercise_type = sys.argv[4]

        response = exercise_gen(language=language, difficulty=difficulty, exercise_type=exercise_type)
        print(response)

    elif methodToUse == "translate":
        text = sys.argv[2]

        response = translate(text)
        print(response)