# Overview
This is a keyword-search proof-of-concept utility that builds an index for a single text document.
Users can provide a search phrase, and those words will be searched for in the document.
The best match(es) will be shown to the user, along with the line number(s) where the match(es) occurred.

# Usage
To run the program, execute the following command:
```
node keyword-search.js <search phrase>
```

## Algorithm

The algorithm is very simple.  First we build an index and then we perform the search.

### Build the Index
1. Read the document line-by-line.
2. For each line, split the line into words.
3. For each word, add the line number to the index for that word.

### Search

1. Split the search phrase into keywords
2. For each keyword, get the line numbers from the index
3. Find the line numbers that appear the most frequently
4. Display each line number with the actual text

### Stemming

Stemming is the process of reducing words to their root form.  For example, the words "running", "runs", and "ran" all have the same root form: "run".  I used a Python solution `from nltk.stem import PorterStemmer`, to generate `stemmer.txt` from the source document.  It is not important that the stemmer produces fake words, it is simply a hashing technique.  The important thing is that the same word always produces the same stem.  For example, the words "running", "runs", and "ran" all produce the same stem: "run".  The stemmer is used to reduce the search phrase to its root form.  The stemmer is also used to reduce the document to its root form.  This allows us to compare the search phrase to the document.

### Synonyms

Synonyms are words with similar meanings. For example, "car" and "automobile" are synonyms.  A thesaurus is a collection of synonyms.  I generated a thesaurus by scrapping some webpage that listed 96 popular words and their synonyms.  I then generated a reverse-thesaurus so the popular words would also become a sort of hash to less-popular words.

### Future Enhancements

While the above algorithm works if the user is familiar with the document, it does not recognize spelling errors or phrases.

## Sample Questions

Here are the sample questions I was given to test the algorithm, one has a typo:

•	How do I compare a Probe Image to another image?
•	How can I find my recent Facial Recognition Sessions?
•	What is the difference between Lineups and Investigations?
•	How do I filter my session results?
•	What does Bookmarking an image do?
•	Why is the search similar option not avaiable?
•	Can I add more than 8 images to a lineup?
•	Do changes I make in the image editor overwrite the original image?
•	How can I correct the pose of my Mugshot?

## Requirements

Ideally the results would be conversational, but also link to the original documentation.  For example, if the user asked "How do I compare a Probe Image to another image?", the results would be:

    A probe image, in the context of facial recognition or image analysis, is a specific image used as a reference or query for comparison against a database or a set of images. It's essentially the image that is being investigated or compared to other images in order to identify or find similarities with other images within a system or a database.

    The term "probe" implies that this image is used to probe or inquire into a database or collection of images, seeking matches or similarities. This image is typically compared against other images or a dataset to find matches, identify individuals, or retrieve similar images based on certain characteristics or criteria set within the software or system.