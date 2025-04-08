-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Document" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filename" TEXT NOT NULL,
    "filepath" TEXT NOT NULL,
    "filetype" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "metadata" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT,
    "isShared" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Document" ("createdAt", "filename", "filepath", "filetype", "id", "metadata", "size", "updatedAt", "userId", "version") SELECT "createdAt", "filename", "filepath", "filetype", "id", "metadata", "size", "updatedAt", "userId", "version" FROM "Document";
DROP TABLE "Document";
ALTER TABLE "new_Document" RENAME TO "Document";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
