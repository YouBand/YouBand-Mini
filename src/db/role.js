import { db } from '@/db/init.js'
import { nanoid } from 'nanoid'
import ResultUtil from '@/utils/result.js'

class RoleDB {
  // 创建表
  static async createRoleTable() {
    return db.execute(`
      CREATE TABLE IF NOT EXISTS "role"
      (
          "id"          TEXT    NOT NULL,
          "name"        TEXT    NOT NULL,
          "avatar"      TEXT DEFAULT NULL,
          "age"         TEXT DEFAULT NULL,
          "character"   TEXT DEFAULT NULL,
          "createTime" INTEGER NOT NULL,
          "updateTime" INTEGER NOT NULL,
          PRIMARY KEY ("id")
      );
    `)
  }

  // 创建
  static async create(role) {
    const timestamp = Date.now()
    const result = await db.execute(
      `INSERT INTO role 
        (id, name, avatar, age, character, createTime, updateTime) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [nanoid(), role.name, role.avatar || null, role.age || null, role.character || null, timestamp, timestamp]
    )
    if (result) {
      return ResultUtil.success(result)
    } else {
      return ResultUtil.failure()
    }
  }

  //查询
  static async list() {
    const result = await db.select('SELECT * from role')
    if (result) {
      return ResultUtil.success(result)
    } else {
      return ResultUtil.failure()
    }
  }

  //删除
  static async delete(param) {
    const result = await db.execute('DELETE from role where id = $1', [param.id])
    if (result) {
      return ResultUtil.success(result)
    } else {
      return ResultUtil.failure()
    }
  }

  //更新
  static async update(param) {
    const result = await db.execute('UPDATE role set name=$1, age=$2, character=$3, updateTime=$4 where id = $5', [
      param.name,
      param.age,
      param.character,
      new Date(),
      param.id
    ])
    if (result) {
      return ResultUtil.success(result)
    } else {
      return ResultUtil.failure()
    }
  }
}

export default RoleDB
