const express = require('express');
const { listDocuments, deleteDocument } = require('../controllers/documentController');

const router = express.Router();

router.get('/', listDocuments);
router.delete('/:id', deleteDocument);

module.exports = router;