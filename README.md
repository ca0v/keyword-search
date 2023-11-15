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

### Known Issues
TODO: Presently the thesaurus is not using stemmed words, so it is basically useless.

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

### BERT

BERT (Bidirectional Encoder Representations from Transformers) is a transformer-based machine learning model developed by Google that excels in understanding the context of words in a sentence or passage. 

BERT's strength lies in its ability to understand the context of words, phrases, and sentences by leveraging a large amount of pre-training data. This allows it to be adaptable and perform effectively across a wide range of natural language processing tasks.

Here's a simplified breakdown of how BERT operates:

#### Bidirectional Context Understanding
Unlike earlier models that processed text from left to right or right to left, BERT learns from the context of a word by considering both its left and right context in a sentence. This bidirectional approach helps it understand the nuances and dependencies between words more effectively.

#### Pre-training and Fine-tuning
BERT is pre-trained on massive amounts of text data in an unsupervised manner. During pre-training, it learns to predict missing words within sentences (Masked Language Model - MLM) and understand sentence relationships (Next Sentence Prediction - NSP). After pre-training, it can be fine-tuned on specific tasks with smaller, task-specific datasets.

#### Tokenization and Attention Mechanism
BERT tokenizes input text into smaller units called tokens, allowing it to understand the meaning of individual words, subwords, or pieces of words. It uses self-attention mechanisms, enabling it to weigh the importance of different words in relation to each other within a sentence.

#### Embeddings and Representations
BERT generates contextual embeddings for each token in a sentence, capturing the meaning of the token based on its context within the entire text. These embeddings represent the semantic meaning of the words in a high-dimensional space.

#### Fine-tuning for Specific Tasks
BERT's pre-trained weights can be fine-tuned for various downstream tasks such as text classification, named entity recognition, question answering, and more. Fine-tuning adjusts the model to perform well on specific tasks by updating its parameters with task-specific data.

- Understand BERT Architecture: Start by understanding the BERT architecture, its tokenization process, attention mechanisms, and how it generates contextual embeddings. Google's original BERT paper is a good starting point for a technical understanding.

- Explore Pre-trained Models: Familiarize yourself with pre-trained BERT models and how they can be fine-tuned for specific tasks. Libraries like Hugging Face's Transformers provide pre-trained BERT models and easy-to-use interfaces for fine-tuning.

- Data Preparation: Collect and preprocess your private data. Ensure it's appropriately cleaned, labeled (if applicable), and formatted for training BERT. This includes tokenizing text, handling special characters, and preparing it in a format suitable for BERT input.

- Fine-tuning Process: Utilize existing fine-tuning scripts or frameworks (like TensorFlow or PyTorch) to fine-tune BERT on your dataset. Fine-tuning involves loading the pre-trained BERT model and training it on your specific task, adjusting its parameters to fit your data.

- Evaluation and Optimization: Evaluate the fine-tuned model's performance using relevant metrics for your search task. Optimize hyperparameters, model architecture, and training strategies (learning rate, batch size, epochs) to enhance performance.

- Privacy Considerations: Since you're dealing with private data, ensure proper data privacy measures are in place. Anonymize or encrypt sensitive information as needed during the training and deployment phases.

- Iterative Improvement: Continuously monitor and iterate on your model. Fine-tuning may involve multiple iterations to achieve the desired search result improvements.

##### Model Selection (asymmetric)

We would want to select an `asymmetric semantic search` model.  This model should be able to take keywords and return a phrase.  Here are some [Asymmetric models](https://www.sbert.net/docs/pretrained-models/msmarco-v3.html).  It is also critical that the vector-space be 1B or less to avoid expensive compute.

Models tuned for `cosine-similarity` will prefer the retrieval of shorter passages, while models for `dot-product` will prefer the retrieval of longer passages. We want verbose responses (`cosine`).

##### Training Data Requirements

The amount of data needed to achieve reasonable search results with BERT can vary based on multiple factors:

- Complexity of the Task: More complex tasks or tasks requiring nuanced understanding may demand larger datasets for effective fine-tuning.

- Data Quality: Higher-quality, well-labeled data might require less volume to achieve good results compared to noisy or unstructured data.

- Similarity to Pre-trained Data: If your dataset is similar in nature to the data BERT was pre-trained on, it might require less fine-tuning data.

- Domain Specificity: Highly specialized domains or niche subjects might necessitate more data for effective fine-tuning.

As a rough guideline, a few hundred to a few thousand samples might be sufficient for simpler tasks or tasks where the domain matches closely with the pre-training data. For more complex tasks or specialized domains, tens of thousands or more samples could be necessary.

However, it's crucial to perform iterative experiments and validation to determine the optimal dataset size. Start with a smaller subset of your data for initial experiments and gradually increase the dataset size while monitoring the performance of your model. Evaluate the trade-offs between model performance and the amount of data used for fine-tuning.

Moreover, techniques like data augmentation, transfer learning, or leveraging pre-trained models with domain-specific adaptations can sometimes mitigate the need for extensive amounts of data.

In essence, while there's no fixed minimal amount of data universally applicable for all tasks, starting with a smaller dataset and gradually increasing the size while evaluating the model's performance is a practical approach to determine the optimal data size for fine-tuning BERT for search tasks.

##### Model Selection (symmetric)

Give the above training requirements and that fact that we have a single PDF document, we should probably rethink our approach.  

A `symmetric semantic search` model should be able to take a phrase and return a phrase.  In our case, we can accept a query and return a canned question and answer.

This approach targets a well-defined space, the canned questions.

"How do I modify a picture?" 
    -> "How to update a mugshot?" 
        -> "To update a mugshot...".  
        
This would achieve the following:document:
    * Quote canned questions and answers
    * Link to original documentation
    * Conversational
    * No hallucinations

##### Building Q&A

The first step is to build a Q&A dataset.  This can be done by scraping the documentation.  We can use the following [Q&A dataset](

# References
We can use [Sentence Transformers](https://github.com/UKPLab/sentence-transformers/tree/master/examples) to rephrase the question to match an existing question (and hence find a suitable answer).

