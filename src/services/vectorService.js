const { MilvusClient } = require('@zilliz/milvus2-sdk-node');
const dotenv = require('dotenv');

dotenv.config();

const milvusClient = new MilvusClient('localhost:19530'); // 可改為環境變數

// 啟動時檢查並建立 collection
(async () => {
  try {
    const collections = await milvusClient.showCollections();
    const exists = collections.data.some(c => c.name === 'documents');
    if (!exists) {
      console.log('Milvus: creating collection "documents" with dim=1024...');
      await milvusClient.createCollection({
        collection_name: 'documents',
        fields: [
          { name: 'id', description: 'ID', data_type: 'VarChar', is_primary_key: true, max_length: 64 },
          { name: 'docId', description: 'Document ID', data_type: 'VarChar', max_length: 64 },
          { name: 'vector', description: 'Embedding vector', data_type: 'FloatVector', dim: 1024 }
        ],
        description: 'Document embeddings',
        enable_dynamic_field: false,
      });
      console.log('Milvus: collection created.');

      // 建立索引
      console.log('Milvus: creating index...');
      await milvusClient.createIndex({
        collection_name: 'documents',
        field_name: 'vector',
        index_name: 'vector_idx',
        index_type: 'IVF_FLAT',
        metric_type: 'L2',
        params: { nlist: 128 },
      });
      console.log('Milvus: index created.');
    } else {
      console.log('Milvus: collection "documents" already exists, skip creating.');
    }
  } catch (err) {
    console.warn('Milvus init failed:', err.message);
  }
})();

async function insertVectors(embeddings, docId) {
  const entities = embeddings.map(e => ({
    id: e.id,
    docId,
    vector: e.vector,
  }));

  try {
    const res = await milvusClient.insert({
      collection_name: 'documents',
      fields_data: entities,
    });
    console.log('Milvus insert response:', res);
  } catch (err) {
    console.warn('Milvus insert failed:', err.message);
  }
}

async function searchSimilar(queryVector, topK = 5) {
  try {
    // 確保 collection 已加載
    await milvusClient.loadCollection({ collection_name: 'documents' });

    const results = await milvusClient.search({
      collection_name: 'documents',
      vectors: [queryVector],
      topk: topK.toString(),
      params: { nprobe: 10 },
      output_fields: ['docId'],
    });
    console.log('Milvus search response:', results);
    return results.results;
  } catch (err) {
    console.warn('Milvus search failed:', err.message);
    return [];
  }
}

module.exports = { insertVectors, searchSimilar };