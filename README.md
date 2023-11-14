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

## Search

1. Split the search phrase into keywords
2. For each keyword, get the line numbers from the index
3. Find the line number(s) that appear the most frequently
4. Display the line number(s) and the line(s) of text

## Extensions

While the above algorithm works if the user is familiar with the document, it does not recognize spelling errors, cannot compare synonyms, cannot compare singular and plural forms of words, and cannot compare verb tenses.  To address these issues, we can use a stemming algorithm to reduce words to their root form.  We can also use a thesaurus to find synonyms.  We can also use a spell-checker to find words that are similar to the search phrase.  Finally, we can use a grammar-checker to find words that are similar to the search phrase.

### Stemming

Stemming is the process of reducing words to their root form.  For example, the words "running", "runs", and "ran" all have the same root form: "run".  Stemming algorithms are available for many languages.  For example, the [Snowball stemmer](http://snowball.tartarus.org/) stemmer.

### Synonyms

Synonyms are words with similar meanings. For example, "car" and "automobile" are synonyms.  A thesaurus is a collection of synonyms.  A thesaurus can be used to find synonyms for a given word.  For example, the [WordNet](https://wordnet.princeton.edu/) thesaurus.

•	How do I compare a Probe Image to another image?
•	How can I find my recent Facial Recognition Sessions?
•	What is the difference between Lineups and Investigations?
•	How do I filter my session results?
•	What does Bookmarking an image do?
•	Why is the search similar option not avaiable?
•	Can I add more than 8 images to a lineup?
•	Do changes I make in the image editor overwrite the original image?
•	How can I correct the pose of my Mugshot?
