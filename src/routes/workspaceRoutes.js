const express = require('express');
const router = express.Router();
const {
  createWorkspace,
  listWorkspaces,
  addUserToWorkspace
} = require('../controllers/workspaceController');

/**
 * @openapi
 * /api/workspaces:
 *   post:
 *     summary: 創建新的工作區
 *     tags:
 *       - Workspaces
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: 創建成功
 *       400:
 *         description: 請求格式錯誤
 */
router.post('/workspaces', createWorkspace);
/**
 * @openapi
 * /api/workspaces:
 *   get:
 *     summary: 取得所有工作區
 *     tags:
 *       - Workspaces
 *     responses:
 *       200:
 *         description: 工作區列表
 */
router.get('/workspaces', listWorkspaces);
/**
 * @openapi
 * /api/workspaces/{workspaceId}/users:
 *   post:
 *     summary: 新增用戶至工作區
 *     tags:
 *       - Workspaces
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: 工作區ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: 新增成功
 *       404:
 *         description: 找不到工作區
 */
router.post('/workspaces/:workspaceId/users', addUserToWorkspace);
/**
 * @openapi
 * /api/workspaces/{workspaceId}:
 *   delete:
 *     summary: 刪除指定工作區
 *     tags:
 *       - Workspaces
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: 工作區ID
 *     responses:
 *       200:
 *         description: 刪除成功
 *       404:
 *         description: 找不到工作區
 */
router.delete('/workspaces/:workspaceId', require('../controllers/workspaceController').deleteWorkspace);
/**
 * @openapi
 * /api/workspaces/{workspaceId}:
 *   delete:
 *     summary: 刪除指定工作區（備用路徑）
 *     tags:
 *       - Workspaces
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: 工作區ID
 *     responses:
 *       200:
 *         description: 刪除成功
 *       404:
 *         description: 找不到工作區
 */
router.delete('/api/workspaces/:workspaceId', require('../controllers/workspaceController').deleteWorkspace);

/**
 * @openapi
 * /api/workspaces-with-users:
 *   get:
 *     summary: 取得所有工作區及其用戶
 *     tags:
 *       - Workspaces
 *     responses:
 *       200:
 *         description: 工作區及用戶列表
 */
router.get('/workspaces-with-users', require('../controllers/workspaceController').listWorkspacesWithUsers);

module.exports = router;