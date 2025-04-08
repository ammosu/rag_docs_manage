const prisma = require('../db/prismaClient');

// 建立 Workspace
async function createWorkspace(req, res) {
  const { name } = req.body;
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Workspace 名稱不得為空' });
  }
  try {
    const workspace = await prisma.workspace.create({
      data: { name }
    });
    res.json(workspace);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '建立 Workspace 失敗' });
  }
}

// 查詢所有 Workspace
async function listWorkspaces(req, res) {
  try {
    const workspaces = await prisma.workspace.findMany();
    res.json(workspaces);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '查詢 Workspace 失敗' });
  }
}

// 指定 User 加入 Workspace
async function addUserToWorkspace(req, res) {
  const { workspaceId } = req.params;
  const { userId } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(400).json({ error: '使用者不存在' });
    }

    const workspace = await prisma.workspace.findUnique({ where: { id: workspaceId } });
    if (!workspace) {
      return res.status(400).json({ error: 'Workspace 不存在' });
    }

    const existing = await prisma.userWorkspace.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId
        }
      }
    });
    if (existing) {
      return res.status(400).json({ error: '使用者已在 Workspace 中' });
    }

    const userWorkspace = await prisma.userWorkspace.create({
      data: {
        userId,
        workspaceId
      }
    });
    res.json(userWorkspace);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: '加入 Workspace 失敗',
      message: err.message,
      details: JSON.stringify(err)
    });
  }
}

async function listWorkspacesWithUsers(req, res) {
  try {
    const workspaces = await prisma.workspace.findMany({
      include: {
        userWorkspaces: {
          include: {
            user: true
          }
        }
      }
    });
    // 轉換格式，方便前端使用
    const result = workspaces.map(ws => ({
      id: ws.id,
      name: ws.name,
      createdAt: ws.createdAt,
      users: ws.userWorkspaces.map(uw => uw.user)
    }));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '查詢 Workspace 與成員失敗' });
  }
}

async function deleteWorkspace(req, res) {
  const { workspaceId } = req.params;
  try {
    await prisma.workspace.delete({
      where: { id: workspaceId }
    });
    res.json({ message: 'Workspace 已刪除' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '刪除 Workspace 失敗' });
  }
}

module.exports = {
  createWorkspace,
  listWorkspaces,
  addUserToWorkspace,
  deleteWorkspace,
  listWorkspacesWithUsers
};