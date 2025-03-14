import { db } from '@/db/init.js'
import { nanoid } from 'nanoid'
import ResultUtil from '@/utils/result.js'

class ModelDB {
  // 创建表
  static async createModelTable() {
    return db.execute(`
      CREATE TABLE IF NOT EXISTS "model"
      (
          "id"           TEXT    NOT NULL,
          "name"         TEXT    NOT NULL,
          "avatar"       TEXT    NOT NULL,
          "type"         TEXT    NOT NULL,
          "modelContent" TEXT DEFAULT NULL,
          "createTime"   INTEGER NOT NULL,
          "updateTime"   INTEGER NOT NULL,
          PRIMARY KEY ("id")
      );
    `)
  }

  // 创建
  static async create(model) {
    const timestamp = Date.now()
    const result = await db.execute(
      `INSERT INTO model 
        (id, name, type, avatar, modelContent, createTime, updateTime) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [nanoid(), model.name, model.type, model.avatar, model.modelContent || null, timestamp, timestamp]
    )
    if (result) {
      return ResultUtil.success(result)
    } else {
      return ResultUtil.failure()
    }
  }

  //查询
  static async list() {
    const result = await db.select('SELECT * from model')
    if (result) {
      return ResultUtil.success(result)
    } else {
      return ResultUtil.failure()
    }
  }

  //删除
  static async delete(param) {
    const result = await db.execute('DELETE from model where id = $1', [param.id])
    if (result) {
      return ResultUtil.success(result)
    } else {
      return ResultUtil.failure()
    }
  }

  //更新
  static async update(param) {
    const result = await db.execute(
      'UPDATE model set name=$1, modelContent=$2, type=$3, updateTime=$4, avatar=$5 where id = $6',
      [param.name, param.modelContent, param.type, new Date(), param.avatar, param.id]
    )
    if (result) {
      return ResultUtil.success(result)
    } else {
      return ResultUtil.failure()
    }
  }
}

export default ModelDB
