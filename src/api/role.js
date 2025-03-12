import RoleDB from '@/db/role.js'

const RoleApi = {
  create(param) {
    return RoleDB.create(param)
  },
  list() {
    return RoleDB.list()
  },
  delete(param) {
    return RoleDB.delete(param)
  },
  update(param) {
    return RoleDB.update(param)
  }
}
export default RoleApi
