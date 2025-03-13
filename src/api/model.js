import ModelDB from '@/db/model.js'

const ModelApi = {
  create(param) {
    return ModelDB.create(param)
  },
  list() {
    return ModelDB.list()
  },
  delete(param) {
    return ModelDB.delete(param)
  },
  update(param) {
    return ModelDB.update(param)
  }
}
export default ModelApi
