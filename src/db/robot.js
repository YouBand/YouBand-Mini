import { db } from '@/db/init.js'
import { nanoid } from 'nanoid'
import ResultUtil from '@/utils/result.js'

class RobotDB {
  // 创建表
  static async createRobotTable() {
    return db.execute(`
      CREATE TABLE IF NOT EXISTS "robot"
      (
          "id"             TEXT    NOT NULL,
          "name"           TEXT    NOT NULL,
          "avatar"         TEXT    NOT NULL,
          "type"           TEXT    NOT NULL,
          "role"           TEXT    NOT NULL,
          "model"          TEXT    NOT NULL,
          "messageNum"     TEXT    DEFAULT 0,    
          "robotContent"   TEXT DEFAULT NULL,
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
      `INSERT INTO robot 
        (id, name, avatar, type, role, model, robotContent, createTime, updateTime) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        nanoid(),
        param.name,
        param.avatar,
        param.type,
        param.role,
        param.model,
        param.robotContent || null,
        timestamp,
        timestamp
      ]
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
      robot.*,
      role.name AS roleName,
      model.name AS modelName,
      role.character AS roleCharacter,
      model.modelContent AS modelContent
      FROM robot
      INNER JOIN role ON robot.role = role.id
      INNER JOIN model ON robot.model = model.id;
    `)
    if (result) {
      return ResultUtil.success(result)
    } else {
      return ResultUtil.failure()
    }
  }

  //删除
  static async delete(param) {
    const result = await db.execute('DELETE from robot where id = $1', [param.id])
    if (result) {
      return ResultUtil.success(result)
    } else {
      return ResultUtil.failure()
    }
  }

  //更新
  static async update(param) {
    const result = await db.execute(
      'UPDATE robot set name=$1, avatar=$2, type=$3, updateTime=$4, role=$5, model=$6, robotContent=$7 where id = $8',
      [param.name, param.avatar, param.type, new Date(), param.role, param.model, param.robotContent, param.id]
    )
    if (result) {
      return ResultUtil.success(result)
    } else {
      return ResultUtil.failure()
    }
  }

  static async updateRobotContent(param) {
    const result = await db.execute('UPDATE robot set robotContent=$1 where id = $2', [param.robotContent, param.id])
    if (result) {
      return ResultUtil.success(result)
    } else {
      return ResultUtil.failure()
    }
  }
}

export default RobotDB
