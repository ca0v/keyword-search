# open the source document as the 1st argument
import sys


sourceFile = sys.argv[1]

# read in the entire file as a string
sourceText = open(sourceFile).read()

# split the string into a list of lines
lines = sourceText.splitlines()

# trim the lines
lines = list(map(str.strip, lines))

# recombine lines if the 1st ends with a a-z and the second begins with a-z
recombinedLines = []
i = 0
while (i < len(lines)):
    if i < len(lines) - 1:
        # if lines[i] is empty, skip it
        if len(lines[i]) == 0:
            i += 1
            continue
        if (len(lines[i+1]) == 0):
            recombinedLines.append(lines[i])
            i += 1
            continue
        # if lines[i] does not end in a period, and lines[i+1] begins with a letter
        # then combine the two lines
        if lines[i][-1] != '.' and lines[i+1][0].isalpha():
            recombinedLines.append(lines[i] + " " + lines[i+1])
            i += 2            
        else:
            recombinedLines.append(lines[i])
            i += 1
    else:
        recombinedLines.append(lines[i])
        i += 1

lines = recombinedLines

# split lines with a "." into a list of sentences
sentences = []
for line in lines:
    sentences.extend(line.split("."))

# lines that are too long should be split into multiple sentences
# split lines that are longer than 300 characters
# if they have a "," then split there, otherwise at the last space before 300
newSentences = []
for sentence in sentences:
    if len(sentence) > 300:
        if "," in sentence:
            newSentences.extend(sentence.split(","))
        else:
            # get the position of last space before 300 characters
            lastSpace = sentence[:300].rfind(" ")
            # split the sentence at the last space
            newSentences.extend(sentence[:lastSpace])
            # add the rest of the sentence to the list
            newSentences.append(sentence[lastSpace:])            
    else:
        newSentences.append(sentence)

sentences = newSentences

# remove everything but letters, numbers and spaces
import re
clean_sentences = []
for sentence in sentences:
    clean_sentences.append(re.sub(r'[^a-zA-Z0-9 -]', '', sentence))

# trim whitespace
clean_sentences = list(map(str.strip, clean_sentences))

# remove empty sentences
clean_sentences = list(filter(None, clean_sentences))

# remove sentences that are too short
clean_sentences = list(filter(lambda x: len(x) > 10, clean_sentences))

# dump the result, one sentence per line
for sentence in clean_sentences:
    print(sentence)