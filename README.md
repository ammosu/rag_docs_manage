# RAG 文檔管理系統

一個基於 Node.js + Express 的檢索增強生成（RAG）文檔管理後端，支援多資料庫、向量存儲、全文檢索與權限管理，並內建簡易前端測試介面。

---

## 特色

- **Node.js + Express** RESTful API
- **SQLite / PostgreSQL / MongoDB** 多資料庫支援
- **Milvus** 向量資料庫，支援語意檢索
- **Ollama** 本地嵌入模型 (`jeffh/intfloat-multilingual-e5-large:f16`)
- **Prisma + Mongoose** ORM/ODM
- **AES-256** 本地文件加密
- **JWT** 使用者認證（預留）
- **版本控制** 與備份
- **簡易前端** 支援上傳、查詢、刪除

---

## 安裝

1. **安裝 Node.js 18+**

2. **安裝 Milvus（Docker）**
   
   ```
   docker run -d --name milvus-standalone -p 19530:19530 -p 9091:9091 milvusdb/milvus:v2.5.2
   ```

3. **安裝 Ollama 並拉取模型**

   ```
   ollama pull jeffh/intfloat-multilingual-e5-large:f16
   ollama serve
   ```

4. **複製環境變數**

   ```
   cp .env.example .env
   ```

5. **安裝依賴**

   ```
   npm install
   ```

6. **初始化資料庫**

   ```
   npx prisma generate
   npx prisma migrate dev --name init
   ```

---

## 啟動

```
npm start
```

伺服器預設運行於 `http://localhost:3000`

---

## API 端點

| 方法 | 路徑 | 說明 |
|-------|---------------------|--------------------------|
| POST  | `/api/upload`       | 上傳文件                 |
| GET   | `/api/documents`    | 列出所有文件             |
| DELETE| `/api/documents/:id`| 刪除指定文件             |
| POST  | `/api/search`       | RAG語意查詢              |

---

## 前端介面

瀏覽 `http://localhost:3000`，可使用：

- **文件上傳**
- **文件列表與刪除**
- **RAG 查詢**

---

## 注意事項

- 預設使用 SQLite，可切換 `.env` 中 `DB_TYPE` 與連線字串
- Milvus collection 須為 1024 維，啟動時自動建立
- 嵌入模型使用 Ollama 本地服務
- 文件自動加密存儲於 `uploads/`
- `.env` 中 `FILE_KEY` 必須為32字節hex字串
- 預設未啟用JWT認證，可自行擴充

---

## 授權

MIT License