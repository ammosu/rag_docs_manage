const prisma = require('../db/prismaClient');
const DocumentModel = require('../db/models/Document');

const dbType = process.env.DB_TYPE; // 'sqlite' | 'postgresql' | 'mongodb'

async function createDocument(data) {
  if (dbType === 'mongodb') {
    return await DocumentModel.create(data);
  } else {
    // 將 metadata 物件轉成 JSON 字串
    const prismaData = {
      ...data,
      metadata: JSON.stringify(data.metadata || {}),
    };

    // 若有 chunks，包裝成 { create: [...] }
    if (Array.isArray(prismaData.chunks)) {
      prismaData.chunks = { create: prismaData.chunks };
    }
    return await prisma.document.create({ data: prismaData });
  }
}

async function getDocumentById(id) {
  if (dbType === 'mongodb') {
    return await DocumentModel.findById(id);
  } else {
    return await prisma.document.findUnique({ where: { id } });
  }
}

module.exports = {
  createDocument,
  getDocumentById,
};