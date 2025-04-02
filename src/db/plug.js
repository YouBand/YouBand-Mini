import { db } from '@/db/init.js'
import { nanoid } from 'nanoid'
import ResultUtil from '@/utils/result.js'

class PlugDB {
  // 创建表
  static async createPlugTable() {
    return db.execute(`
      CREATE TABLE IF NOT EXISTS "plug"
      (
          "id"           TEXT    NOT NULL,
          "name"         TEXT    NOT NULL,
          "describe"     TEXT DEFAULT NULL,
          "type"         TEXT    NOT NULL,
          "isActive"     INTEGER DEFAULT NULL,
          "plugContent"  TEXT DEFAULT NULL,
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
      `INSERT INTO plug 
        (id, name, type, describe, plugContent, createTime, updateTime, isActive) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, 0)`,
      [nanoid(), param.name, param.type, param.describe, param.plugContent || null, timestamp, timestamp]
    )
    if (result) {
      return ResultUtil.success(result)
    } else {
      return ResultUtil.failure()
    }
  }

  //查询
  static async list() {
    const result = await db.select('SELECT * from plug')
    if (result) {
      return ResultUtil.success(result)
    } else {
      return ResultUtil.failure()
    }
  }

  //删除
  static async delete(param) {
    const result = await db.execute('DELETE from plug where id = $1', [param.id])
    if (result) {
      return ResultUtil.success(result)
    } else {
      return ResultUtil.failure()
    }
  }

  //更新
  static async update(param) {
    const result = await db.execute(
      'UPDATE plug set name=$1, plugContent=$2, type=$3, updateTime=$4, describe=$5, isActive=$6 where id = $7',
      [param.name, param.plugContent, param.type, new Date(), param.describe, param.isActive, param.id]
    )
    if (result) {
      return ResultUtil.success(result)
    } else {
      return ResultUtil.failure()
    }
  }

  //切换
  static async switch(param) {
    const result = await db.execute('UPDATE plug set isActive=$1 where id = $2', [param.isActive, param.id])
    if (result) {
      return ResultUtil.success(result)
    } else {
      return ResultUtil.failure()
    }
  }
}

export default PlugDB
