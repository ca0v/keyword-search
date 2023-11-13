# Overview
This is a keyword-search proof-of-concept utility that builds an index for a single text document.
Users can provide a search phrase, and those words will be searched for in the document.
The best match(es) will be shown to the user, along with the line number(s) where the match(es) occurred.

# Usage
To run the program, execute the following command:
```
node keyword-search.js <search phrase>
```

# Algorithm

The algorithm is very simple.  First we build an index and then we perform the search.

## Build the Index
1. Read the document line-by-line.
2. For each line, split the line into words.
3. For each word, add the line number to the index for that word.

# Search

1. Split the search phrase into keywords
2. For each keyword, get the line numbers from the index
3. Find the line number(s) that appear the most frequently
4. Display the line number(s) and the line(s) of text