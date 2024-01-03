module.exports = {
  getRecentDaysStartAndEnd(days, lastday = 0) {
    // 获取当前时间的毫秒数
    var now = new Date().getTime();
    // lastday 小于零的情况：昨日
    if (lastday < 0) {
      now = now - Math.abs(lastday) * 24 * 60 * 60 * 1000;
    }
    days = days - 1;
    if (days < 0) days = 0;
    // 计算days天前的时间的毫秒数
    const past = now - days * 24 * 60 * 60 * 1000;
    // 创建一个表示起始时间和结束时间的Date对象
    const startDate = new Date();
    const endDate = new Date();
    // 设置起始时间和结束时间的毫秒数
    startDate.setTime(past);
    startDate.setHours(0, 0, 0, 0)
    endDate.setTime(now);
    endDate.setHours(23, 59, 59, 999)
    let s_year = startDate.getFullYear();
    let s_month = startDate.getMonth() + 1;
    let s_day = startDate.getDate();
    let s_hour = startDate.getHours();
    let s_minutes = startDate.getMinutes();
    let s_seconds = startDate.getSeconds();
    s_month = String(s_month).padStart(2, '0')
    s_day = String(s_day).padStart(2, '0')
    s_hour = String(s_hour).padStart(2, '0')
    s_minutes = String(s_minutes).padStart(2, '0')
    s_seconds = String(s_seconds).padStart(2, '0')
    let e_year = endDate.getFullYear();
    let e_month = endDate.getMonth() + 1;
    let e_day = endDate.getDate();
    let e_hour = endDate.getHours();
    let e_minutes = endDate.getMinutes();
    let e_seconds = endDate.getSeconds();
    e_month = String(e_month).padStart(2, '0')
    e_day = String(e_day).padStart(2, '0')
    e_hour = String(e_hour).padStart(2, '0')
    e_minutes = String(e_minutes).padStart(2, '0')
    e_seconds = String(e_seconds).padStart(2, '0')
    // 返回起始时间和结束时间的字符串表示
    return {
      // start: `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()} ${startDate.getHours()}:${startDate.getMinutes()}:${startDate.getSeconds()}`,
      // end: `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()} ${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}`
      start: `${s_year}-${s_month}-${s_day} ${s_hour}:${s_minutes}:${s_seconds}`,
      end: `${e_year}-${e_month}-${e_day} ${e_hour}:${e_minutes}:${e_seconds}`,
    };
  }
}