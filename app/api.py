from flask import Flask, request, jsonify
import os
import requests
from io import BytesIO
import logging
from flask_cors import CORS
import cohere
import pandas as pd
import numpy as np
import torch



app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})  # Enable CORS for the /api/* endpoints

logging.basicConfig(level=logging.DEBUG)

@app.route('/api/ask', methods=['POST'])

def process_query():
    app.logger.debug("Received request to /api/ask")

    # Check if the POST request has the file part
    if 'question' not in request.form:
        return jsonify({'error': 'No question provided'}), 400
    
    question = request.form['question']

    co_key = COHERE_KEY
    co = cohere.Client(co_key)

    # to do: get links from notion
    df = pd.read_csv("saved_notes.csv")
    topics = df['Topic'].tolist()

    embeds = co.embed(texts=topics,
                  model="embed-english-light-v2.0",
                  truncate="END").embeddings
    
    embeds_array = np.array(embeds)
    embeds_tensor = torch.tensor(embeds_array)

    query = 'Article on Artificial Intelligence'
    query_embeddings = co.embed(texts=[query],
                  model="embed-english-light-v2.0",
                  truncate="END").embeddings
    query_embeddings_tensor = torch.tensor(query_embeddings)
    dot_scores = torch.mm(query_embeddings_tensor.float(), embeds_tensor.transpose(0,1).float())
    top_k = torch.topk(dot_scores, k=5)

    results = []
    for doc_id in top_k.indices[0].tolist():
        results.append(topics[doc_id])
    
    response = results

    return jsonify({'answer': response})

if __name__ == '__main__':
    app.run(debug=True, port=3000)



