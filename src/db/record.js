import { db } from '@/db/init.js'
import { nanoid } from 'nanoid'
import ResultUtil from '@/utils/result.js'

class RecordDB {
  // 创建表
  static async createRecordTable() {
    return db.execute(`
      CREATE TABLE IF NOT EXISTS "record"
      (
          "id"              TEXT    NOT NULL,
          "produceId"       TEXT    NOT NULL,
          "targetInfo"      TEXT DEFAULT NULL,
          "type"            TEXT    NOT NULL,
          "recordContent"   TEXT DEFAULT NULL,
          "createTime"      INTEGER NOT NULL,
          "updateTime"      INTEGER NOT NULL,
          PRIMARY KEY ("id")
      );
    `)
  }

  // 创建
  static async create(param) {
    const timestamp = Date.now()
    const result = await db.execute(
      `INSERT INTO record 
        (id, produceId, targetInfo, type, recordContent, createTime, updateTime) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [nanoid(), param.produceId, param.targetInfo, param.type, param.recordContent || null, timestamp, timestamp]
    )
    if (result) {
      return ResultUtil.success(result)
    } else {
      return ResultUtil.failure()
    }
  }

  //查询
  static async list() {
    const result = await db.select('SELECT * from record')
    if (result) {
      return ResultUtil.success(result)
    } else {
      return ResultUtil.failure()
    }
  }

  static async page(param) {
    const result = await db.select(
      `SELECT * FROM record WHERE produceId = $1 
       ORDER BY 
         createTime DESC,
         CASE WHEN type = 'reply' THEN 0 ELSE 1 END 
       LIMIT $2 OFFSET $3`,
      [param.produceId, param.num, param.index]
    )
    if (result) {
      return ResultUtil.success(result)
    } else {
      return ResultUtil.failure()
    }
  }

  //删除
  static async delete(param) {
    const result = await db.execute('DELETE from record where id = $1', [param.id])
    if (result) {
      return ResultUtil.success(result)
    } else {
      return ResultUtil.failure()
    }
  }
}

export default RecordDB
