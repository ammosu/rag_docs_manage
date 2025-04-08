const express = require('express');
const { listDocuments, deleteDocument } = require('../controllers/documentController');

const router = express.Router();

/**
 * @openapi
 * /api/documents:
 *   get:
 *     summary: 取得所有文件列表
 *     tags:
 *       - Documents
 *     responses:
 *       200:
 *         description: 文件列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 */
router.get('/', listDocuments);
/**
 * @openapi
 * /api/documents/{id}:
 *   delete:
 *     summary: 刪除指定文件
 *     tags:
 *       - Documents
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 文件ID
 *     responses:
 *       200:
 *         description: 刪除成功
 *       404:
 *         description: 找不到文件
 */
router.delete('/:id', deleteDocument);

module.exports = router;