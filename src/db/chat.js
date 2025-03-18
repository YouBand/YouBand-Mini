import { db } from '@/db/init.js'
import { nanoid } from 'nanoid'
import ResultUtil from '@/utils/result.js'

class ChatDB {
  // 创建表
  static async createChatTable() {
    return db.execute(`
      CREATE TABLE IF NOT EXISTS "chat"
      (
          "id"             TEXT    NOT NULL,
          "name"           TEXT    NOT NULL,
          "avatar"         TEXT    DEFAULT NULL,
          "role"           TEXT    NOT NULL,
          "model"          TEXT    NOT NULL,
          "createTime"   INTEGER NOT NULL,
          "updateTime"   INTEGER NOT NULL,
          PRIMARY KEY ("id")
      );
    `)
  }

  // 创建
  static async create(param) {
    const timestamp = Date.now()
    const result = await db.execute(
      `INSERT INTO chat 
        (id, name, avatar, role, model, createTime, updateTime) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [nanoid(), param.name, param.avatar, param.role, param.model, timestamp, timestamp]
    )
    if (result) {
      return ResultUtil.success(result)
    } else {
      return ResultUtil.failure()
    }
  }

  //查询
  static async list() {
    const result = await db.select(`
      SELECT 
      chat.*,
      role.name AS roleName,
      model.name AS modelName,
      role.character AS roleCharacter,
      model.modelContent AS modelContent
      FROM chat
      INNER JOIN role ON chat.role = role.id
      INNER JOIN model ON chat.model = model.id;
    `)
    if (result) {
      return ResultUtil.success(result)
    } else {
      return ResultUtil.failure()
    }
  }

  //删除
  static async delete(param) {
    const result = await db.execute('DELETE from chat where id = $1', [param.id])
    if (result) {
      return ResultUtil.success(result)
    } else {
      return ResultUtil.failure()
    }
  }
}

export default ChatDB
