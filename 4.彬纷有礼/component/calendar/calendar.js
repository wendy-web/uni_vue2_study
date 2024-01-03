const DAY_NUM = 42
const WEEK_DAY_NUM = 7
const DATE_CHECK = /^(\d{4})-(\d{2})-(\d{2})$/
Component({
  properties: {
    defaultSelectDate: {
      type: String,
      value: ''
    },
    mode: {
      type: String,
      value: ''
    },
    showToday: {
      type: Boolean,
      value: true
    }
  },
  data: {
    pickDate: '',
    pickDateDisplay: '',
    tMonthFirstDayWeek: 0,
    allDays: [],
    selectedDate: '',
    today: '',
    dateRange: [],
    leftImg: './images/left-arrow.png',
    rotateImg: './images/rotate.png',
    rightImg: './images/right-arrow.png',
  },
  ready() {
    const now = new Date()
    if (!DATE_CHECK.test(this.data.defaultSelectDate)) {
      this.setData({
        defaultSelectDate: '',
      })
    }
    this.setData({
      selectedDate: this.data.defaultSelectDate || this.parseTime(now, '{y}-{m}-{d}'),
      today: this.parseTime(now, '{y}-{m}-{d}')
    })
    this.setCalendar(this.parseTime(now, '{y}-{m}'))
  },
  methods: {
    setCalendar(dateStr) {
      const self = this
      const selectDate = new Date(dateStr)
      const pickDate = self.parseTime(selectDate, '{y}-{m}')
      const dateSplit = dateStr.split('-')
      const thisYear = dateSplit[0]
      const thisMonth = dateSplit[1]
      const tempWeek = new Date(`${self.parseTime(selectDate, '{y}-{m}-')}01`).getDay()
      const tMonthFirstDayWeek = tempWeek === 0 ? WEEK_DAY_NUM : tempWeek

      const lastMonthOrigin = [...Array(self.getMonthDayNum(selectDate.getFullYear(), selectDate.getMonth())).keys()]
      const thisMonthOrigin = [...Array(self.getMonthDayNum(selectDate.getFullYear(), selectDate.getMonth() + 1)).keys()]
      const nextMonthOrigin = [...Array(self.getMonthDayNum(selectDate.getFullYear(), selectDate.getMonth() + 2)).keys()]
      const lastMonthFinal = [...lastMonthOrigin].splice(lastMonthOrigin.length - (tMonthFirstDayWeek - 1), lastMonthOrigin.length)
      const nextMonthFinal = [...nextMonthOrigin].splice(0, DAY_NUM - lastMonthFinal.length - thisMonthOrigin.length)

      let nextMonth = Number(thisMonth) + 1;
      let nextYear = Number(thisYear);
      let lastMonth = Number(thisMonth) - 1;
      let lastYear = Number(thisYear);
      if (nextMonth > 12) {
        nextYear++;
        nextMonth = 1;
      }
      if (lastMonth == 0) {
        lastMonth = 12;
        lastYear--;
      }

      self.setData({
        pickDate,
        pickDateDisplay: self.parseTime(selectDate, '{y}年{m}月'),
        tMonthFirstDayWeek,
        // ...this.mapMonth(lastMonthFinal, thisYear, Number(thisMonth) - 1, pickDate),
        // ...this.mapMonth(nextMonthFinal, thisYear, Number(thisMonth) + 1, pickDate),
        allDays: [
          ...this.mapMonth(lastMonthFinal, lastYear, lastMonth, pickDate),
          ...this.mapMonth(thisMonthOrigin, thisYear, Number(thisMonth), pickDate),
          ...this.mapMonth(nextMonthFinal, nextYear, nextMonth, pickDate)
        ]
      })
    },
    mapMonth(dayArr, year, month, pickDate = null) {
      // console.log("mapMonth dayArr:",dayArr);
      // console.log("mapMonth year:", year);
      // console.log("mapMonth month:",month);
      // console.log("mapMonth pickDate:",pickDate);
      const thisMonthNum = pickDate && Number(pickDate.split('-')[1])
      return dayArr.map(item => {
        const date = `${year}-${month < 10 ? `0${month}` : month}-${(item + 1) < 10 ? `0${item + 1}` : item + 1}`
        const week = new Date(date).getDay()
        return {
          dateNumber: item + 1,
          date,
          week: week === 0 ? 7 : week,
          position: thisMonthNum === month ? '' : month === thisMonthNum - 1 ? 'next-month' : 'pre-month'
        }
      })
    },
    bindPickDateChange(event) {
      const {
        value
      } = event.detail
      this.setData({
        pickDate: value,
        pickDateDisplay: this.parseTime(value, '{y}年{m}月')
      })
      this.setCalendar(value)
      this.triggerEvent('onPickDateChange', value)
    },
    // 获取月天数
    getMonthDayNum(year, month) {
      const d = new Date(year, month, 0)
      return d.getDate()
    },
    control(event) {
      const {
        mode
      } = event.currentTarget.dataset
      const {
        pickDate
      } = this.data
      let dateArr = pickDate.split('-')
      let oldMonth = Number(dateArr[1])
      let oldYear = Number(dateArr[0])
      let newDate = ''
      switch (mode) {
        case 'pre':
          newDate = oldMonth === 1 ? `${oldYear - 1}-12` : `${oldYear}-${oldMonth - 1 < 10 ? `0${oldMonth - 1}` : oldMonth - 1}`
          break;
        case 'reset':
          newDate = this.data.defaultSelectDate || new Date()
          if (this.data.mode === 'range') {
            this.setData({
              // selectedDate: newDate,
              selectedDate: this.parseTime(new Date(), '{y}-{m}-{d}'),
              dateRange: []
            })
          } else {
            this.setData({
              selectedDate: this.parseTime(new Date(), '{y}-{m}-{d}')
            })
          }
          break;
        case 'next':
          newDate = oldMonth === 12 ? `${oldYear + 1}-01` : `${oldYear}-${oldMonth + 1 < 10 ? `0${oldMonth + 1}` : oldMonth + 1}`
          break;
      }
      const timeParse = this.parseTime(new Date(newDate), '{y}-{m}')
      this.setCalendar(timeParse)
      if (mode !== 'reset' && this.data.mode === 'range') {
        this.findRange(this.data.dateRange)
      }
      this.triggerEvent('onControl', {
        mode,
        newDate: timeParse
      })
      wx.vibrateShort()
    },
    onPickDay(event) {
      const {
        day
      } = event.currentTarget.dataset
      const {
        mode
      } = this.data
      let dateRange = [...this.data.dateRange]
      if (mode === 'range') {
        this.setData({
          selectedDate: ''
        })
        if (!dateRange[0]) {
          dateRange.push(day.date)
          this.setData({
            dateRange
          })
        } else if (!dateRange[1]) {
          dateRange.push(day.date)
          dateRange.sort((a, b) => a > b ? 1 : -1)
          this.setData({
            dateRange
          })

          this.findRange(dateRange)
          this.triggerEvent('onRangePick', dateRange)
        } else {
          this.setData({
            dateRange: [day.date]
          })
          this.findRange([day.date])
        }

      } else {
        this.setData({
          selectedDate: day.date
        })
        this.triggerEvent('onPickDay', day)
      }
    },
    // 找出range内的日期
    findRange(dateRange) {
      const minTimeStamp = Date.parse(dateRange[0])
      const maxTimeStamp = Date.parse(dateRange[1])
      let allDays = [...this.data.allDays]
      allDays.forEach(item => {
        const parseDate = Date.parse(item.date)
        item[`inRange`] = dateRange.length === 1 ? false : parseDate < maxTimeStamp && parseDate > minTimeStamp
        item[`endRange`] = parseDate === maxTimeStamp ? 'true' : false
        item[`sameRange`] = parseDate === maxTimeStamp && parseDate === minTimeStamp ? 'true' : false
      })
      this.setData({
        allDays
      })
    },
    parseTime(time, cFormat) {
      if (arguments.length === 0) {
        return null
      }
      const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
      let date
      if (typeof time === 'object') {
        date = time
      } else {
        if (('' + time).length === 10) time = parseInt(time) * 1000
        date = new Date(time)
      }
      const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
      }
      const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
        if (result.length > 0 && value < 10) {
          value = '0' + value
        }
        return value || 0
      })
      return timeStr
    },
    imgLoadError(error) {
      let name = error.currentTarget.dataset.name;
      if (name == "left") {
        this.setData({
          leftImg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfjCBwPMTCdYxBJAAABFklEQVRIx2NgGPKAmViF3rmqGcoX73xAF2ckTrtnB2M5AwPDo78WO5+jyjCRoJ2BQY7ZH12OCAPg2hkYnv/fQrIBni1w7S//u2x/QmIYeLYwVsO1O22/hqmCkTLteA0gRjseA4jTjtMAYrXjMIB47VgNIEU7FgO8/Bk2QJnPmZ0232AgADAS0n+4kf////5PSDuW3Hjnhhobgy0DAwMDIy9jqMq2O69JNICB4fY+mBEMPIwhhIzAWh6QYgSOAoV4I3CWSMQagadII84IvGUiMUYQKFQJG0GwVL69T4WH0QpiBEOgxspbn0k0gIHhzm6YEYy8DDdvnyXZACQjHrKU3PxKhgEMDHd2q75nfM6csPkZceqHFAAAdK98ZJbs0n4AAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMDgtMjhUMTU6NDk6NDgrMDA6MDAB1UWyAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTA4LTI4VDE1OjQ5OjQ4KzAwOjAwcIj9DgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII='
        })
      }
      if (name == "rotate") {
        this.setData({
          rotateImg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfjCBwPNQGo0dV3AAACUUlEQVRIx92UTUgUYRjH/8/MQtnWpRYzJYXCwrp4CpYItkPsdxBRt3XLOvYhFHSIIC92bA/rIck+8BCRIGQ77nRppVNEUJkJ6sXaREgTpDV0Z+bpMO+sOzM7bh3rubzv8/Wb//M+MMA/b+SVSLTrYbRRE2RepM/6a3XyjwEhX8N56sEhR3iCsqUHBa0uIBE0BtHhIesTLipv7CHZ7sbTPIwmz4EbkWovzrz3VBBP86OKU0KexqloGLyXjiGJBhFnpJWhmoBE0HiFLQAAnTJan/pjIxfeKd2iy0Jv2Tiaf+sChHzbPorZV+hsTnXrj4cxzNsBAFP+zmfrZlSy0v5u0a7XbgdyqnEaBgCgo9RlRSsA7hGSMrXbAWDsJTLietUBiBw0v08/tT5sYvIdlAAAux0AKSz8fPXTuW10ETegQUevA0CtYpAC6pjSz81as9Jv+T7zMFrMdfC3egBg7Hu1ZylgMSPVB9jNAsybp97ytwAxAuYEKIRsrbL4IJ/bWDmAkpR6MVKlgK3dR07tcrefkR3tgF9P2UZQpjFlJtZuugGHGeyMkc8GAPiuuFyJRp3Ftw3K8BKWse75iMCvh0KDTE8jMWdZ7vpYgNMobwIoaNyNNQDADul5LJMMVJclA7EsjcDvBtj2Hu2ixxVnlVUap69MaOUQnaj8UCwbVU66AEAshQFshbet4gkuVAPsy4EyxMdp0rN9wghKA0L6innKzprZYuc97Qv2odGR+IBrRy7dX5ieP1DGEt5x7+xyjRGq3mM/RdCGPQAvSDOsKnP4X+03Rgm6En8RlgYAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMDgtMjhUMTU6NTM6MDErMDA6MDDGq0GSAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTA4LTI4VDE1OjUzOjAxKzAwOjAwt/b5LgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII='
        })
      }
      if (name == "right") {
        this.setData({
          rightImg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfjCBwTMRCzMWqVAAACBElEQVRIx93VTWsTURTG8f+ZGxtRkkFaii99IZCkaQ22LlRQg2mWnc/gwoWI4Mqda6nQhaAgXUlduBEXDcaV4EewiLqwTmeRd2uoBNpqTJvJdSOizIxJ3OlZ3jvPjzMXDgf++RLvkRUjo93ws/xuP4DyxFP6Ktc46w6nX63v/QWQyHCFk4ww4R5Or/UmvMARZkgSIkrMDafX1vcHBJI7bDPMJCGiJLtG6vVUxx4E2GjHP8oWo0yiiJDWu2JPte3+AXDa8bo0OM44igindJNi6put+wbAacdr1CXGGEKUWRpUUi1/Qvm7zl6iRlGmOYpgMssnqv5EAADOfqLKBznDCILJHJv+XQQC4LiJCm8kRwQDkzkalFItu38AnK5Tjr/9hdgS224PAAA4xcQ75okimEzo6sb73++NXgBoQX4MncbzBqFecSunH3ICAcqyrF4OBFghzusVxlBASRaNVbUzAGAd5IK+zzgGUJLbUgg1855fCHwD6xBZvcT0z/jzA5/zXe93AR1YES7pW5zGAMqyKAX/eABgRXWWm5zDACpyx1gNNf3jvoBl6nlucBFFl01ZUk/Udj5gFn2ABVPnuE4WhUtNloce0QqO+3Uww2VyKDpUWBl6kP/KH8sLHCOGokOJx+F7+S/0KM8sxLWYjFLnafhuP5vBZ7EsxMhIp1N40ddi+Q/qO+nxroDTJY53AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTA4LTI4VDE3OjQ5OjE2KzAyOjAw019NSwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wOC0yOFQxNzo0OToxNiswMjowMKIC9fcAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC'
        })
      }
    },
    initDate() {
      const now = new Date()
      if (!DATE_CHECK.test(this.data.defaultSelectDate)) {
        this.setData({
          defaultSelectDate: '',
        })
      }
      this.setData({
        dateRange:[],
        // selectedDate: this.data.defaultSelectDate || this.parseTime(now, '{y}-{m}-{d}'),
        today: this.parseTime(now, '{y}-{m}-{d}')
      })
      this.setCalendar(this.parseTime(now, '{y}-{m}'))
    }
  }
})