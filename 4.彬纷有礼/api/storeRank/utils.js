import {
  myRank,
  unbox_getInfo,
  getInfo14
} from './api';


module.exports = {
  getActInfo() {
    return new Promise(resolve => {

      let obj = {
        rankInfo: null,
        msg: ''
      }
      myRank().then(res => {
        let {
          code,
          data,
          msg
        } = res;
        //有数据处理业务逻辑：
        if (code == 1) {
          //初始化开箱活动状态
          let {
            s_time,
            e_time
          } = data;
          //格式化奖券过期时间
          data.exp_time_date = this.parseTime(data.exp_time, "{y}-{m}-{d}")
          data.act_state = this.init_act_state({
            s_time,
            e_time
          });
          // 中奖判断：兑换罐数大于基数 并且 排名在200以内
          data.is_win = data.card_count >= data.kpi_1 && data.rank <= data.calc[data.calc.length - 1][1]
          obj.rankInfo = data;
          wx.setStorageSync('storeRankInfoZJ', JSON.stringify(data))
          resolve(obj)

        } else {

          obj.msg = msg;
          this.inActCoupon(false); //可转让店铺
        }
        //无数据时候提示返回的信息
        resolve(obj)
      });
    })

  },
  unboxGetInfo() {
    return new Promise(resolve => {

      let obj = {
        rankInfo: null,
        msg: ''
      }
      unbox_getInfo().then(res => {
        let {
          code,
          data,
          msg
        } = res;
        //有数据处理业务逻辑：
        if (code == 1) {
          //初始化开箱活动状态
          let {
            s_time,
            e_time,
            status
          } = data;

          //格式化奖券过期时间
          data.exp_time_date = this.parseTime(data.exp_time, "{y}-{m}-{d}")
          data.act_state = this.init_act_state({
            s_time,
            e_time,
            status
          });

          // 中奖判断：排名在所在活动区域要求内
          data.is_win = data.rev_num > 0 || (data.rank > 0 && data.rank <= data.calc[data.calc.length - 1][1]);
          obj.rankInfo = data;
          wx.setStorageSync('storeRankInfo', JSON.stringify(data))
          resolve(obj)

        } else {

          obj.msg = msg;
          this.inActCoupon(false); //可转让店铺
        }
        //无数据时候提示返回的信息
        resolve(obj)
      });
    })

  },
  /** 
   * 初始化活动的状态:活动预热，进行中，结束
   * {act_yure,act_ing,act_end,count_down_timestamp,act_expire}
   * act_expire:结束7天后不再展示任何弹窗
   */
  init_act_state({
    s_time = 0,
    e_time = 0,
    status = '未报名',
    inActName='inStoreRank14',
    dailyPopName='daily_pop_act_14'
  }) {
    let act_state = {
      act_yure: false, //预热
      act_ing: false, //进行中
      act_end: false, //结束
      count_down_timestamp: 0, //倒计时时间戳
      act_expire: false, //活动过期：默认结束7天以后
      daily_pop: false, //每日弹窗
      count_down_format: 'DD', //倒计时格式，默认天，小于1天显示时分秒
      status_title: '活动已结束', //活动状态默认已结束,
      total_day: 0, //总共天数
      countDownDay: [0],
      countdown_title: '活动已结束'
    }
    //开始时间
    let time_start = new Date(s_time.replace(new RegExp(/-/gm), '/'));
    time_start = time_start.getTime();

    //结束时间
    let time_end = new Date(e_time.replace(new RegExp(/-/gm), '/'));
    time_end = time_end.getTime();
    //过期时间：活动结束后1星期内604800000 毫秒=7天
    let time_expire = time_end + (60 * 60 * 24 * 1000 * 7);
    //当前时间
    let time_now = Date.now();
    // 计算时间差
    var diff = time_end - time_start;
    // 计算天数
    act_state.total_day = Math.ceil(diff / (60 * 60 * 24 * 1000));
    // 计算倒计时天数
    var coundDay = Math.floor((time_end - time_now) / (60 * 60 * 24 * 1000));
    coundDay = coundDay <= 0 ? '0' : coundDay;
    act_state.countDownDay = String(coundDay).split("");
    //活动过期：当前时间大于过期时间后面不用处理了
    if (time_now >= time_expire) {
      act_state.act_expire = true;
      act_state.act_end = true; //活动已结束
      this.inActCoupon(inActName,false); //可转让店铺

      return act_state;
    }
    //活动结束
    if (time_now >= time_end) {
      act_state.act_end = true;
      this.inActCoupon(inActName,false); //可转让店铺
      return act_state;
    }
    //活动进行中
    if (time_now >= time_start) {
      act_state.act_ing = true;
      act_state.status_title = '距离活动结束还剩';
      //倒计时为结束时间-当前时间
      act_state.count_down_timestamp = time_end - time_now;
      //如果倒计时小于1天，显示0天时分秒
      if (act_state.count_down_timestamp < 86400000) {
        // act_state.count_down_format = 'DD天HH时mm分ss秒';
        act_state.count_down_format = 'HH时mm分ss秒';
      }
      //是否需要每日弹窗提醒：活动进行中、本地缓存日期不相等
      let curr_date = this.parseTime(new Date(), '{y}-{m}-{d}');

      //需要判断当前页面是否是首页pages/tabBar/shouye/index
      var pages = getCurrentPages() || [];
      let isHome = false;
      let countPages = pages.length;
      let currentPage = pages[countPages - 1] || {};
      console.log("currentPage:::", currentPage.route)
      if (currentPage.route == 'pages/tabBar/shouye/index') {
        isHome = true;
      }
      // 当前日期不等于本地缓存日期，弹每日进度弹窗
      if ((this.getDailyPopDate('daily_pop_act_14') !== curr_date) && isHome) {
        //覆盖本地缓存日期
        this.setDailyPopDate('daily_pop_act_14',curr_date);
        act_state.daily_pop = true;
      }
      act_state.countdown_title = '活动进行中'
      if (status != '未报名') {
        this.inActCoupon(inActName,true); //活动进行中，不可转让店铺
      } else {
        this.inActCoupon(inActName,false); //未报名
      }
      return act_state;
    }
    //活动预热：未开始
    act_state.act_yure = true;
    act_state.status_title = '距离活动开始还剩';
    //倒计时为开始时间-当前时间
    act_state.count_down_timestamp = time_start - time_now;
    //如果倒计时小于1天，显示0天时分秒
    if (act_state.count_down_timestamp < 86400000) {
      act_state.count_down_format = 'HH时mm分ss秒';
      // act_state.count_down_format = 'DD天HH时mm分ss秒';
    }
    act_state.countdown_title = '活动未开始'
    return act_state;
  },

  //活动每日进度弹窗 日期缓存
  setDailyPopDate(name='daily_pop_act_14',date) {
    wx.setStorageSync(name, date)
  },
  getDailyPopDate(name='daily_pop_act_14') {
    return wx.getStorageSync(name)
  },
  //inActCoupon 活动券进行中禁止转让店铺，加入店铺，修改店铺地址 param:true false
  inActCoupon(name = 'inStoreRank14', param) {
    wx.setStorageSync(name, param);
  },
  //格式化当前时间
  parseTime(time, cFormat, zero = true) {
    if (arguments.length === 0 || !time) {
      return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
      date = time
    } else {
      if ((typeof time === 'string')) {
        if ((/^[0-9]+$/.test(time))) {
          // support "1548221490638 1612339800000"
          time = parseInt(time)
        } else {
          // support safari
          // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
          time = time.replace(new RegExp(/-/gm), '/')
        }
      }

      if ((typeof time === 'number') && (time.toString().length === 10)) {
        time = time * 1000
      }
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
    const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
      const value = formatObj[key]
      // Note: getDay() returns 0 on Sunday
      if (key === 'a') {
        return ['日', '一', '二', '三', '四', '五', '六'][value]
      }
      if (zero) {
        return value.toString().padStart(2, '0')
      } else {
        return value.toString()
      }
    })
    return time_str
  },

  //中奖弹窗：缓存一次 raffle_win_pop_date
  win_check_date() {
    //需要判断当前页面是否是首页pages/tabBar/shouye/index
    // var pages = getCurrentPages() || [];
    // let isHome = false;
    // let countPages = pages.length;
    // let currentPage = pages[countPages - 1] || {};
    // if (currentPage.route == 'pages/tabBar/shouye/index') {
    //   isHome = true;
    // }
    let isHome = true;
    let curr_date = this.parseTime(new Date(), '{y}-{m}-{d}');
    // 当前日期不等于本地缓存日期，弹每日进度弹窗
    if (!wx.getStorageSync('raffle_win_pop_date') && isHome) {
      //覆盖本地缓存日期
      wx.setStorageSync('raffle_win_pop_date', curr_date);
      return true
    }
    return false
  },
  pageMineDailyPop() {
    var pages = getCurrentPages() || [];
    let isHome = false;
    let countPages = pages.length;
    let currentPage = pages[countPages - 1] || {};
    if (currentPage.route == 'pages/tabBar/geren/index') {
      isHome = true;
    }
    let curr_date = this.parseTime(new Date(), '{y}-{m}-{d}');
    // 当前日期不等于本地缓存日期，弹每日进度弹窗
    if (wx.getStorageSync('page_mine_daily_pop') !== curr_date && isHome) {
      //覆盖本地缓存日期
      wx.setStorageSync('page_mine_daily_pop', curr_date);
      return true
    }
    return false
  },
  pageStoreRankHomeReport() {
    let curr_date = this.get_curr_date_ymd();
    // 当前日期不等于本地缓存日期，弹每日进度弹窗
    if (wx.getStorageSync('page_store_rank_daily_report') !== curr_date) {
      //覆盖本地缓存日期
      wx.setStorageSync('page_store_rank_daily_report', curr_date);
      return true
    }
    return false
  },
  get_curr_date_ymd() {
    const current_date = this.parseTime(new Date(), '{y}-{m}-{d}');
    return current_date;
  },
  actInfo14() {
    return new Promise(resolve => {
      let obj = {
        actInfo: null,
        msg: ''
      }
      getInfo14().then(res => {
        let {
          code,
          data,
          msg
        } = res;
        //有数据处理业务逻辑：
        if (code == 1) {
          //初始化活动状态
          let {
            s_time,
            e_time,
            win,//win 有报名则有数据，不然是空数组 ，里面region判断是否有补全资料,status=0 已报名 status=1 中奖未领取 status=2 已领取
            kpi_num, //兑奖人数
            calc,
          } = data;
          if( Array.isArray(win)&&win.length ==0) win = null;
          //格式化奖券过期时间
          data.exp_time_date = this.parseTime(data.exp_time, "{y}-{m}-{d}")
          data.e_time_date = this.parseTime(e_time, "{y}-{m}-{d}")
          data.exp_time_date_ymd = this.parseTime(data.exp_time, "{y}年{m}月{d}日")
          data.act_start_date = this.parseTime(new Date(s_time.replace(new RegExp(/-/gm), '/')).getTime(), "{y}年{m}月{d}日 {h}:{i}:{s}")
          data.act_start_date_ymd = this.parseTime(new Date(s_time.replace(new RegExp(/-/gm), '/')).getTime(), "{y}年{m}月{d}日")
          data.act_end_date = this.parseTime(new Date(e_time.replace(new RegExp(/-/gm), '/')).getTime(), "{y}年{m}月{d}日 {h}:{i}:{s}")
          data.act_end_date_ymd = this.parseTime(new Date(e_time.replace(new RegExp(/-/gm), '/')).getTime(), "{y}年{m}月{d}日")
          data.act_state = this.init_act_state({
            s_time,
            e_time,
            status:'不用报名'
          });
          // 活动是否中奖根据奖券发放时间判断
          data.is_win = Boolean(data.rev_time);
          // 判断赢手机是否中奖
          let raffle_win = false;
          if(win && win.status >= 1){
            raffle_win = true;
            data.calc = calc;
          }
          if(win && win.lucky_number){
            win.lucky_number = String(win.lucky_number).padStart(10,'0');
          }
          if(calc&&calc.lottery_number.length>0){
            let arr = calc.lottery_number.slice(0,5);
            calc.lottery_number_str = arr.join(""); //中奖弹窗需要字符串显示
          }
          data.win = win;

          data.raffle_win = raffle_win;
          // 判断抽奖是否可以报名:活动进行中&kpi_num>=20 & 未报名
          let raffle_apply = false;
          if(data.act_state.act_ing&& kpi_num>= calc.ticket_num && !win){
            raffle_apply = true;
          }
          data.raffle_apply = raffle_apply;
          obj.actInfo = data;
         
          wx.setStorageSync('storeRankActInfo14', JSON.stringify(data))
        } else {
          //无数据时候提示返回的信息
          obj.msg = msg;
          this.inActCoupon('inStoreRank14', false); //可转让店铺
        }
        resolve(obj)
      });
    })

  },
}