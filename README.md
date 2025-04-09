# RAG 文檔管理系統

一個基於 Node.js + Express 的檢索增強生成（RAG）文檔管理後端，支援多資料庫、向量存儲、全文檢索、多用戶、多工作區與權限管理，並內建簡易前端測試介面與 Swagger API 文件。

---

## 特色

- **Node.js + Express** RESTful API
- **SQLite / PostgreSQL / MongoDB** 多資料庫支援
- **Milvus** 向量資料庫，支援語意檢索
- **Ollama** 本地嵌入模型 (`jeffh/intfloat-multilingual-e5-large:f16`)
- **Prisma + Mongoose** ORM/ODM
- **AES-256** 本地文件加密
- **JWT** 使用者認證
- **Google OAuth** 第三方登入
- **多用戶、多工作區管理** 與權限控制
- **PDF / Word 文件解析**
- **Swagger** 自動產生 API 文件
- **版本控制** 與備份
- **簡易前端** 支援上傳、查詢、刪除、語意檢索

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

Swagger API 文件位於：`http://localhost:3000/api-docs`

---

## API 端點

### 文件 (Documents)
| 方法   | 路徑                       | 說明           |
|---------|----------------------------|----------------|
| GET     | `/api/documents`           | 列出所有文件   |
| DELETE  | `/api/documents/:id`       | 刪除指定文件   |

### 上傳 (Upload)
| 方法   | 路徑             | 說明         |
|---------|------------------|--------------|
| POST    | `/api/upload`    | 上傳文件（欄位名 `file`） |

### 搜尋 (Search)
| 方法   | 路徑             | 說明         |
|---------|------------------|--------------|
| POST    | `/api/search`    | 語意查詢     |

### 使用者 (Users)
| 方法   | 路徑                            | 說明               |
|---------|---------------------------------|--------------------|
| POST    | `/api/users/register`           | 註冊               |
| POST    | `/api/users/login`              | 登入               |
| GET     | `/api/users/profile`            | 取得個人資料（需 JWT） |
| GET     | `/api/users/:userId/workspaces` | 取得用戶所屬工作區 |
| GET     | `/api/users`                    | 列出所有用戶       |

### 工作區 (Workspaces)
| 方法   | 路徑                                         | 說明                   |
|---------|----------------------------------------------|------------------------|
| POST    | `/api/workspaces`                           | 建立工作區             |
| GET     | `/api/workspaces`                           | 列出所有工作區         |
| POST    | `/api/workspaces/:workspaceId/users`        | 將用戶加入工作區       |
| DELETE  | `/api/workspaces/:workspaceId`              | 刪除工作區             |
| GET     | `/api/workspaces-with-users`                | 列出所有工作區及其用戶 |

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
- JWT 密鑰請妥善保管
- 預設支援 Google OAuth，請於 `.env` 設定 client id/secret
- Swagger 文件自動產生，位於 `/api-docs`

---

## 測試

- 單元測試：`jest`
- 端對端測試：`cypress`
- API 測試：`supertest`

---

## 授權

MIT License