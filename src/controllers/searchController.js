const { generateEmbedding } = require('../services/embeddingService');
const { searchSimilar } = require('../services/vectorService');
const prisma = require('../db/prismaClient');

async function search(req, res) {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'Missing query' });

    // 產生查詢嵌入
    const embedding = await generateEmbedding(query);

    // 查詢 Milvus
    const results = await searchSimilar(embedding.vector, 5);

    // 取得相關 chunk 與文件
    const docIds = results.map(r => r.docId);
    const chunks = await prisma.chunk.findMany({
      where: { documentId: { in: docIds } },
      include: { document: true },
    });

    res.json(chunks.map(c => ({
      content: c.content,
      filename: c.document.filename,
      documentId: c.documentId,
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed' });
  }
}

module.exports = { search };