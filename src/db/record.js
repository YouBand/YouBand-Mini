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
          "targetKey"       TEXT DEFAULT NULL,
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
        (id, produceId, targetInfo, type, recordContent, targetKey, createTime, updateTime) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        nanoid(),
        param.produceId,
        param.targetInfo,
        param.type,
        param.recordContent || null,
        param.targetKey || null,
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

  //统计7天的数据
  static async get7DayStats(produceId) {
    const now = new Date() // 本地时间
    const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
    const startDate = new Date(endDate)
    startDate.setDate(endDate.getDate() - 6) // 7天前
    startDate.setHours(0, 0, 0, 0)
    const startTime = startDate.getTime()
    const endTime = endDate.getTime()
    let rows = await db.select(
      ` SELECT 
            date(datetime(createTime / 1000, 'unixepoch', 'localtime')) as date,
            COUNT(*) as count
        FROM record
        WHERE produceId = $1
            AND createTime BETWEEN $2 AND $3
        GROUP BY date`,
      [produceId, startTime, endTime]
    )
    let total = 0
    const dateArray = []
    const currentDate = new Date(startDate)
    const formatDate = (date) => date.toISOString().slice(0, 10)
    for (let i = 0; i < 7; i++) {
      currentDate.setDate(currentDate.getDate() + 1)
      dateArray.push(formatDate(new Date(currentDate)))
    }
    const countMap = {}
    rows.forEach((row) => {
      countMap[row.date] = row.count
      total = total + row.count
    })
    const valueArray = dateArray.map((date) => countMap[date] || 0)
    return ResultUtil.success({
      date: dateArray,
      value: valueArray,
      total: total
    })
  }

  //今日消息统计
  static async getMessageStats() {
    const currentTime = Date.now()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStart = today.getTime()
    const yesterdayStart = todayStart - 86400000 // 昨日0点时间戳
    try {
      const [todayResult, yesterdayResult, totalResult, yesterdayTotalResult] = await Promise.all([
        // 今日消息数（今日0点 ~ 现在）
        db.select(
          `SELECT COUNT(*) AS count FROM record 
         WHERE createTime >= $1 AND createTime <= $2`,
          [todayStart, currentTime]
        ),
        // 昨日全天消息数（昨日0点 ~ 今日0点）
        db.select(
          `SELECT COUNT(*) AS count FROM record 
         WHERE createTime >= $1 AND createTime < $2`,
          [yesterdayStart, todayStart]
        ),
        // 消息总数（全部数据）
        db.select(`SELECT COUNT(*) AS count FROM record`),
        // 今日0点时的历史总量（createTime < 今日0点的数据）
        db.select(
          `SELECT COUNT(*) AS count FROM record 
         WHERE createTime < $1`,
          [todayStart]
        )
      ])
      const todayCount = todayResult[0]?.count || 0
      const yesterdayDayCount = yesterdayResult[0]?.count || 0
      const totalCount = totalResult[0]?.count || 0
      const yesterdayTotalCount = yesterdayTotalResult[0]?.count || 0
      const calcGrowth = (current, previous) => {
        if (previous === 0) {
          return current > 0 ? 100 : 0
        }
        const growth = ((current - previous) / previous) * 100
        return Number(growth.toFixed(2))
      }

      return ResultUtil.success({
        today: {
          count: todayCount,
          growth: calcGrowth(todayCount, yesterdayDayCount)
        },
        total: {
          count: totalCount,
          growth: calcGrowth(totalCount, yesterdayTotalCount)
        }
      })
    } catch (error) {
      ResultUtil.failure()
      throw error
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

  //清空指定produceId
  static async clean(param) {
    const result = await db.execute('DELETE from record where produceId = $1', [param.produceId])
    if (result) {
      return ResultUtil.success(result)
    } else {
      return ResultUtil.failure()
    }
  }

  //上下文
  static async context(param) {
    let where = ' produceId = $1'
    if (param.targetKey) {
      where += ' and targetKey = $4'
    }
    const result = await db.select(
      `SELECT * FROM record WHERE ${where} and type IN ('reply', 'receive')
       ORDER BY 
         createTime DESC,
         CASE WHEN type = 'reply' THEN 0 ELSE 1 END 
       LIMIT $2 OFFSET $3
       `,
      [param.produceId, param.num, 0, param.targetKey]
    )
    let context = []
    for (let i = result.length - 1; i >= 0; i--) {
      let msg = result[i]
      context.push({ role: msg.type === 'reply' ? 'assistant' : 'user', content: msg.recordContent })
    }
    return ResultUtil.success(context)
  }
}

export default RecordDB
