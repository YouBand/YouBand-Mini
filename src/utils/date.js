const DateUtil = {
  formatLocale(timestamp, locale = 'zh-CN', options = {}, isSeconds = false) {
    const date = new Date(isSeconds ? timestamp * 1000 : timestamp)
    const defaultOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }
    return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(date)
  }
}
export default DateUtil
