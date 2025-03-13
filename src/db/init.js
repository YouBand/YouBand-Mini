import Database from '@tauri-apps/plugin-sql'
import RoleDB from '@/db/role.js'
import ModelDB from '@/db/model.js'

export let db

//数据连接
export async function connectInit() {
  return await Database.load('sqlite:youband.db')
}

//sql数据库表数据新建
export async function crateInit() {
  if (!db) {
    db = await connectInit()
  }
  const crateTables = [RoleDB.createRoleTable(), ModelDB.createModelTable()]
  Promise.allSettled(crateTables).then((res) => {
    console.log('数据库初始化成功')
  })
}
