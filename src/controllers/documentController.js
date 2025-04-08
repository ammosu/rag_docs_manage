const { getDocumentById } = require('../repositories/documentRepository');
const prisma = require('../db/prismaClient');
const { MilvusClient } = require('@zilliz/milvus2-sdk-node');

const milvusClient = new MilvusClient('localhost:19530'); // 可改環境變數

async function listDocuments(req, res) {
  try {
    const workspaceId = req.workspaceId; // 假設 middleware 設定
    const docs = await prisma.document.findMany({
      where: {
        OR: [
          { workspaceId: workspaceId },
          { isShared: true }
        ]
      }
    });
    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list documents' });
  }
}

async function deleteDocument(req, res) {
  const id = req.params.id;
  try {
    // 刪除 Milvus 向量
    try {
      await milvusClient.deleteEntities({
        collection_name: 'documents',
        expr: `docId == "${id}"`,
      });
    } catch (err) {
      console.warn('Milvus delete failed:', err.message);
    }

    // 刪除資料庫紀錄
    await prisma.chunk.deleteMany({ where: { documentId: id } });
    await prisma.document.delete({ where: { id } });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete document' });
  }
}

module.exports = { listDocuments, deleteDocument };