const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const cheerio = require('cheerio');
const { createDocument } = require('../repositories/documentRepository');
const { generateEmbedding } = require('../services/embeddingService');
const { insertVectors } = require('../services/vectorService');
const { encryptFile } = require('../services/fileService');

/**
 * 文件上傳與處理
 */
async function handleUpload(req, res) {
  try {
    const file = req.file;
    const ext = path.extname(file.originalname).toLowerCase();
    let text = '';

    if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(file.path);
      const data = await pdfParse(dataBuffer);
      text = data.text;
    } else if (ext === '.docx') {
      const data = await mammoth.extractRawText({ path: file.path });
      text = data.value;
    } else if (ext === '.html') {
      const html = fs.readFileSync(file.path, 'utf-8');
      const $ = cheerio.load(html);
      text = $('body').text();
    } else if (ext === '.txt') {
      text = fs.readFileSync(file.path, 'utf-8');
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    // 分塊
    const chunks = text.match(/(.|[\r\n]){1,500}/g) || [];

    // 產生嵌入
    const embeddings = await Promise.all(chunks.map(chunk => generateEmbedding(chunk)));

    // 加密存檔
    const encryptedPath = encryptFile(file.path);

    // 存入資料庫
    const doc = await createDocument({
      filename: file.originalname,
      filepath: encryptedPath,
      filetype: ext,
      size: file.size,
      metadata: {},
      userId: req.user?.id || 'anonymous',
      chunks: chunks.map((content, idx) => ({
        content,
        embeddingId: embeddings[idx].id,
      })),
    });

    // 存入 Milvus
    await insertVectors(embeddings, doc.id);

    res.json({ success: true, documentId: doc.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
}

module.exports = { handleUpload };