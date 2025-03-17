import RecordDB from '@/db/record.js'

const RecordApi = {
  create(param) {
    return RecordDB.create(param)
  },
  page(param) {
    return RecordDB.page(param)
  },
  get7DayStats(param) {
    return RecordDB.get7DayStats(param)
  },
  getMessageStats() {
    return RecordDB.getMessageStats()
  },
  clean(param) {
    return RecordDB.clean(param)
  }
}
export default RecordApi
