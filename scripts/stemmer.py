#!/usr/bin/env python3

import nltk

#nltk.download('words')

from nltk.stem import PorterStemmer
from nltk.corpus import words

fileName = "test1.txt"

# Initialize stemmer
stemmer = PorterStemmer()

# Get words in the source document at ../data/test2.txt
with open('../data/' + fileName) as f:
    source_words = f.read().split()
    # use a regex to keep only letters and numbers
    source_words = [word.lower() for word in source_words if word.isalnum()]
    
# english_words = words.words()[:2000]
# Create a sorted version removing duplicates
english_words = sorted(set(source_words))

# dump the words to a file
with open('english_words.txt', 'w') as f:
    for word in english_words:
        f.write(f'{word}\n')

# Create a dictionary mapping words to their stemmed form
stemmed_words = {word: stemmer.stem(word) for word in english_words}

# Write the dictionary to a file
with open('stemmed_words.txt', 'w') as f:
    for word, stemmed_word in stemmed_words.items():
        f.write(f'{word}:{stemmed_word}\n')