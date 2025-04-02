import PlugDB from '@/db/plug.js'

const PlugApi = {
  create(param) {
    return PlugDB.create(param)
  },
  list() {
    return PlugDB.list()
  },
  delete(param) {
    return PlugDB.delete(param)
  },
  update(param) {
    return PlugDB.update(param)
  },
  switch(param) {
    return PlugDB.switch(param)
  }
}
export default PlugApi
