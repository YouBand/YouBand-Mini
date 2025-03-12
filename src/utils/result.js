const ResultUtil = {
  success(data) {
    return {
      code: 0,
      msg: '操作成功',
      data: data
    }
  },
  failure() {
    return {
      code: 1,
      msg: '操作失败'
    }
  }
}
export default ResultUtil
