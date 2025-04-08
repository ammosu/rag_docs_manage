const mongoose = require('../mongooseClient');

const chunkSchema = new mongoose.Schema({
  content: String,
  embeddingId: String,
});

const documentSchema = new mongoose.Schema({
  filename: String,
  filepath: String,
  filetype: String,
  size: Number,
  metadata: Object,
  version: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  userId: String,
  workspaceId: String, // 所屬 workspace ID
  isShared: { type: Boolean, default: false }, // 是否共用
  chunks: [chunkSchema],
});

module.exports = mongoose.model('Document', documentSchema);