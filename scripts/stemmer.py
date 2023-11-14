#!/usr/bin/env python3

import sys
import nltk

#nltk.download('words')

from nltk.stem import PorterStemmer
from nltk.corpus import words

# the first argument, if it exists, should be the name of the file to stem
if len(sys.argv) > 1:
    fileName = sys.argv[1]
else:
    fileName = '../data/test1.txt'

# Initialize stemmer
stemmer = PorterStemmer()

# Get words in the source document at ../data/test2.txt
with open(fileName) as f:
    source_words = f.read().split()
    # use a regex to keep only letters and numbers
    source_words = [word.lower() for word in source_words if word.isalnum()]
    
# english_words = words.words()[:2000]
# Create a sorted version removing duplicates
english_words = sorted(set(source_words))

# Create a dictionary mapping words to their stemmed form
stemmed_words = {word: stemmer.stem(word) for word in english_words}

for word, stemmed_word in stemmed_words.items():
    print(f'{word}:{stemmed_word}')
