const express = require('express');
const router = express.Router();
const {
  createWorkspace,
  listWorkspaces,
  addUserToWorkspace
} = require('../controllers/workspaceController');

router.post('/workspaces', createWorkspace);
router.get('/workspaces', listWorkspaces);
router.post('/workspaces/:workspaceId/users', addUserToWorkspace);
router.delete('/workspaces/:workspaceId', require('../controllers/workspaceController').deleteWorkspace);
router.delete('/api/workspaces/:workspaceId', require('../controllers/workspaceController').deleteWorkspace);

router.get('/workspaces-with-users', require('../controllers/workspaceController').listWorkspacesWithUsers);

module.exports = router;