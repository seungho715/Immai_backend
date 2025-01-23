import argparse
import random
import sys
import json
from ollama import NPC_gen, exercise_gen, init 
from translate import translate_sentence, translate_word

exercises = ['FITB', 'MultipleChoice', 'Direction', 'Movement', 'Sound', 'Color', 'Smell', 'Touch', 'Feeling', 'Family']

parser = argparse.ArgumentParser()
parser.add_argument("--npc", help="generate NPC conversation", action="store_true")
parser.add_argument("--exercise", help="generate exercise", action="store_true")
parser.add_argument("--translate", help="generate translation", action="store_true")
args = parser.parse_args()

context_file = 'src/python/context.txt'

if __name__ == "__main__":
    if args.exercise:
        predefined_exercises = [
        "fill in the blank",
        "match the meaning",
        "sentence reordering",
        "translation",
        "multiple choice"
    ]
        # gen random index of input
        exercise_type = random.choice(predefined_exercises)
        print(exercise_gen(language="French", difficulty="beginner", exercise_type=exercise_type))

    elif args.npc:
        # NPC test
        with open(context_file, 'r') as file:
            context = file.read()

        role = input("NPC role: ")

        print("~~~~Conversation begins~~~~")

        history = init(role, context)
        output = json.loads(history)
        print(output[-1]['content'])

        while(1):
            history = NPC_gen(input("You: "), history)
            output = json.loads(history)
            print("NPC: " + output[-1]['content'])
    elif args.translate:
        while(1):
            text = input("Translate: ")
            print(translate_sentence(text))

    else:
        print("commands are --npc, --exercise, or --translate")