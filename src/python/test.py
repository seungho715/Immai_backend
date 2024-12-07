import argparse
import random
from ollama import NPC_gen, exercise_gen 

exercises = ['FITB', 'MultipleChoice', 'Direction', 'Movement', 'Sound', 'Color', 'Smell', 'Touch', 'Feeling', 'Family']

parser = argparse.ArgumentParser()
parser.add_argument("--npc", help="generate NPC conversation", action="store_true")
parser.add_argument("--exercise", help="generate exercise", action="store_true")
args = parser.parse_args()

context_file = 'context.txt'

if __name__ == "__main__":
    if args.exercise:
        # gen random index of input
        prompt = input()
        exercise = exercises[random.randint(0, 8)]
        print(exercise_gen(prompt, exercise))

    elif args.npc:
        # NPC test
        # print(init(input("NPC role: ")))

        with open(context_file, 'r') as file:
            context = file.read()

        role = input("NPC role: ")

        print("~~~~Conversation begins~~~~")

        while(1):
            print("NPC: " + NPC_gen(input("You: "), role, context))
    else:
        print("commands are --npc or --exercise")