const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

async function generateEmbedding(text) {
  try {
    const response = await axios.post('http://localhost:11434/api/embeddings', {
      model: 'jeffh/intfloat-multilingual-e5-large:f16',
      prompt: text,
    });
    const vector = response.data.embedding;
    console.log('Embedding length:', vector.length);
    return {
      id: generateId(),
      vector,
    };
  } catch (err) {
    console.error('Ollama embedding error:', err.message);
    throw err;
  }
}

function generateId() {
  return Math.random().toString(36).substring(2, 15);
}

module.exports = { generateEmbedding };