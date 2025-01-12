import argparse
import random
import sys
import json
from ollama import NPC_gen, exercise_gen, init 

exercises = ['FITB', 'MultipleChoice', 'Direction', 'Movement', 'Sound', 'Color', 'Smell', 'Touch', 'Feeling', 'Family']

parser = argparse.ArgumentParser()
parser.add_argument("--npc", help="generate NPC conversation", action="store_true")
parser.add_argument("--exercise", help="generate exercise", action="store_true")
args = parser.parse_args()

context_file = 'src/python/context.txt'

if __name__ == "__main__":
    if args.exercise:
        # gen random index of input
        prompt = input()
        exercise = exercises[random.randint(0, 8)]
        print(exercise_gen(prompt, exercise))

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
    else:
        print("commands are --npc or --exercise")