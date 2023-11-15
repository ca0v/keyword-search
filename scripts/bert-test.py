"""
This is a simple application for sentence embeddings: semantic search

We have a corpus with various sentences. Then, for a given query sentence,
we want to find the most similar sentence in this corpus.

This script outputs for various queries the top 5 most similar sentences in the corpus.
"""
from sentence_transformers import SentenceTransformer, util
import torch

# The all-MiniLM-L6-v2 model is a good model for semantic search
# all => trained on all datasets
# MiniLM => smaller version of BERT
# L6 => 6 layers
# v2 => second version of the model
embedder = SentenceTransformer('all-MiniLM-L6-v2')

# A corpus is a collection of documents
# in this case, the corpus is a list of baseline questions

corpus = '''
How do I compare a Probe Image to another image?
How can I find my recent Facial Recognition Sessions?
What is the difference between Lineups and Investigations?
How do I filter my session results?
What does Bookmarking an image do?
Why is the search similar option not available?
Can I add more than 8 images to a lineup?
Do changes I make in the image editor overwrite the original image?
How can I correct the pose of my Mugshot?
'''.strip().split('\n')
    
corpus_embeddings = embedder.encode(corpus, convert_to_tensor=True)

# queries are questions that the user might ask
# we would like these questions to map to a key question so we can provide a canned response
queries = '''
What is a probe image?
How can I find my recent sessions?
Are lineups and investigations different?
How to I only see a subset of my session?
What is bookmarking used for?
Why can't I click on the search similar button?
How do I add more images to a lineup?
How can I prevent the original image from being modified?
How to I fix my mugshot pose?
'''.strip().split('\n')


# Find the closest 5 sentences of the corpus for each query sentence based on cosine similarity
top_k = min(1, len(corpus))
for query in queries:
    query_embedding = embedder.encode(query, convert_to_tensor=True)

    # We use cosine-similarity and torch.topk to find the highest 5 scores
    cos_scores = util.cos_sim(query_embedding, corpus_embeddings)[0]
    top_results = torch.topk(cos_scores, k=top_k)

    print("Query:", query)

    for score, idx in zip(top_results[0], top_results[1]):
        print("Index:", corpus[idx], "(Score: {:.4f})".format(score))

    print()

    """
    # Alternatively, we can also use util.semantic_search to perform cosine similarty + topk
    hits = util.semantic_search(query_embedding, corpus_embeddings, top_k=5)
    hits = hits[0]      #Get the hits for the first query
    for hit in hits:
        print(corpus[hit['corpus_id']], "(Score: {:.4f})".format(hit['score']))
    """