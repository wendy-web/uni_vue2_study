import {
  getInfo,
  getDisplayInfo,
  getInfoDG,
  getInfoSZ,
  unboxActInfoGz,
  excActInfoGz,
  getInfoDg18
} from './index';

module.exports = {
  act2_getinfo() {
    return new Promise(resolve => {

      let obj = {
        act_info: null,
        msg: ''
      }
      getInfo().then(res => {
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
          //未激活时候初始化陈列活动状态
          if (data.next_cl) {
            data.next_cl.act_state = this.init_next_cl_state(data.next_cl.e_time)
          }
          obj.act_info = data;

        }
        //无数据时候提示返回的信息
        obj.msg = msg;
        this.inActCoupon(false); //可转让店铺
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
  }) {
    let act_state = {
      act_yure: false, //预热
      act_ing: false, //进行中
      act_end: false, //结束
      count_down_timestamp: 0, //倒计时时间戳
      act_expire: false, //活动过期：默认结束7天以后
      daily_pop: false, //每日弹窗
      count_down_format: 'DD天', //倒计时格式，默认天，小于1天显示时分秒
      status_title: '活动已结束', //活动状态默认已结束
      total_day: 0, //总共天数
      countDownDay: [0]
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
      this.inActCoupon(false); //可转让店铺

      return act_state;
    }
    //活动结束
    if (time_now >= time_end) {
      act_state.act_end = true;
      this.inActCoupon(false); //可转让店铺
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
      //开箱，和陈列活动可能是一起，也可能只有开箱，陈列未解锁。页面需要判断是否解锁陈列
      let curr_date = this.parseTime(new Date(), '{y}-{m}-{d}');

      //需要判断当前页面是否是首页pages/tabBar/shouye/index
      var pages = getCurrentPages() || [];
      let isHome = false;
      let countPages = pages.length;
      let currentPage = pages[countPages - 1] || {};
      if (currentPage.route == 'pages/tabBar/shouye/index') {
        isHome = true;
      }
      // 当前日期不等于本地缓存日期，弹每日进度弹窗
      if ((this.getDailyPopDate() !== curr_date) && isHome) {
        //覆盖本地缓存日期
        this.setDailyPopDate(curr_date);
        act_state.daily_pop = true;
      }
      this.inActCoupon(true); //活动进行中，不可转让店铺
      return act_state;
    }
    //活动预热：未开始
    act_state.act_yure = true;
    act_state.status_title = '活动未开始';
    //倒计时为开始时间-当前时间
    act_state.count_down_timestamp = time_start - time_now;
    //如果倒计时小于1天，显示0天时分秒
    if (act_state.count_down_timestamp < 86400000) {
      act_state.count_down_format = 'DD天HH时mm分ss秒';
    }
    return act_state;
  },

  //初始化next_cl
  init_next_cl_state(e_time) {
    let act_state = {
      act_yure: false, //预热
      act_ing: false, //进行中
      act_end: false, //结束
      count_down_timestamp: 0, //倒计时时间戳
      act_expire: false, //活动过期：默认结束7天以后
      daily_pop: false, //每日弹窗
      count_down_format: 'DD天', //倒计时格式，默认天，小于1天显示时分秒
      status_title: '活动已结束', //活动状态默认已结束
    }
    //结束时间
    let time_end = new Date(e_time.replace(new RegExp(/-/gm), '/'));
    time_end = time_end.getTime();
    //过期时间：活动结束后1星期内604800000 毫秒=7天
    let time_expire = time_end + 604800000;
    //当前时间
    let time_now = Date.now();
    //活动过期：当前时间大于过期时间后面不用处理了
    if (time_now >= time_expire) {
      act_state.act_expire = true;
      act_state.act_end = true; //活动已结束
      this.inActCoupon(false); //可转让店铺

      return act_state;
    }
    //活动结束
    if (time_now >= time_end) {
      act_state.act_end = true;
      this.inActCoupon(false); //可转让店铺
      return act_state;
    }

    //活动进行中
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
    //需要判断当前页面是否是首页pages/tabBar/shouye/index
    var pages = getCurrentPages() || [];
    let isHome = false;
    let countPages = pages.length;
    let currentPage = pages[countPages - 1] || {};
    if (currentPage.route == 'pages/tabBar/shouye/index') {
      isHome = true;
    }

    return act_state;
  },
  //初始化首页陈列活动时间：距离结束
  init_display_state(e_time) {
    let act_state = {
      act_yure: false, //预热
      act_ing: false, //进行中
      act_end: false, //结束
      count_down_timestamp: 0, //倒计时时间戳
      act_expire: false, //活动过期：默认结束7天以后
      daily_pop: false, //每日弹窗
      count_down_format: 'DD天', //倒计时格式，默认天，小于1天显示时分秒
      status_title: '活动已结束', //活动状态默认已结束
    }
    //结束时间
    let time_end = new Date(e_time.replace(new RegExp(/-/gm), '/'));
    time_end = time_end.getTime();
    //过期时间：活动结束后1星期内604800000 毫秒=7天
    let time_expire = time_end + 604800000;
    //当前时间
    let time_now = Date.now();
    //活动过期：当前时间大于过期时间后面不用处理了
    if (time_now >= time_expire) {
      act_state.act_expire = true;
      act_state.act_end = true; //活动已结束
      this.inActCoupon(false); //可转让店铺

      return act_state;
    }
    //活动结束
    if (time_now >= time_end) {
      act_state.act_end = true;
      this.inActCoupon(false); //可转让店铺
      return act_state;
    }

    //活动进行中
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
    //需要判断当前页面是否是首页pages/tabBar/shouye/index
    var pages = getCurrentPages() || [];
    let isHome = false;
    let countPages = pages.length;
    let currentPage = pages[countPages - 1] || {};
    if (currentPage.route == 'pages/tabBar/shouye/index') {
      isHome = true;
    }
    console.log("init_display_state isHome:", isHome);
    //开箱，和陈列活动可能是一起，也可能只有开箱，陈列未解锁。页面需要判断是否解锁陈列
    let curr_date = this.parseTime(new Date(), '{y}-{m}-{d}');
    // 当前日期不等于本地缓存日期，弹每日进度弹窗
    let daily_pop_date = this.getDisplayDailyPopDate();
    if ((daily_pop_date != curr_date) && isHome) {
      //覆盖本地缓存日期
      this.setDisplayDailyPopDate(curr_date);
      act_state.daily_pop = true;
      console.error("init_display_state act_state", act_state);
    }
    this.inActCoupon(true); //活动进行中，不可转让店铺

    return act_state;
  },
  //开箱活动每日进度弹窗 日期缓存
  setDailyPopDate(name='daily_pop_date',date) {
    wx.setStorageSync(name, date)
  },
  getDailyPopDate(name='daily_pop_date') {
    return wx.getStorageSync(name)
  },
  //陈列活动每日进度弹窗 日期缓存
  setDisplayDailyPopDate(date) {
    wx.setStorageSync('diaplay_daily_pop_date', date)
  },
  getDisplayDailyPopDate() {
    return wx.getStorageSync('diaplay_daily_pop_date')
  },
  //开箱活动每日进度弹窗 日期缓存
  setUnboxDailyPopDate(name='unbox_daily_pop_date_sz',date) {
    wx.setStorageSync(name, date)
  },
  getUnboxDailyPopDate(name='unbox_daily_pop_date_sz') {
    return wx.getStorageSync(name)
  },
  //inActCoupon 开箱活动券进行中禁止转让店铺，加入店铺，修改店铺地址 param:true false
  inActCoupon(param) {
    wx.setStorageSync('inActCoupon', param);
  },
  inUnboxActCoupon(name = 'inUnboxAct_SZ', param) {
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
  //判断陈列拍照时间
  //获取拍照状态，拍照次数，下次拍照日期
  displayTakePhotoState: function (displayInfo) {
    let state = {
      step_bar_type: '1',
      next_display_date: ''
    }
    let page = displayInfo.page; //0 可以传图，1当天传图失败5次，2区间已成功
    let _step_bar_type = 1; //1活动进度；2下次可拍照，3现在可进行第x次
    let _next_display_date = ''; //下次可拍照日期
    let follow_time = displayInfo.calc.follow_time * 1000;
    let _next_time = follow_time; //下次可拍照时间，默认加间隔时间
    let last_time = displayInfo.last_time ? new Date(displayInfo.last_time.replace(new RegExp(/-/gm), '/')).getTime() : null;
    let end_time = displayInfo.end_time ? new Date(displayInfo.end_time.replace(new RegExp(/-/gm), '/')).getTime() : null;

    let {
      s_num,
      kpi_num
    } = displayInfo;
    //已达标
    if (s_num >= kpi_num) {
      state.step_bar_type = 1;
      state.next_display_date = '';
      return state
    }
    // 区间已成功，下次拍照时间：上一次成功时间+间隔时间
    if (page == 2) {
      if (displayInfo.calc.follow_time >= 86400) {
        let day_last_time = this.parseTime(last_time, "{y}/{m}/{d}");
        last_time = new Date(day_last_time).getTime();
      }
      _next_time += last_time;
      _step_bar_type = 2;
      _next_display_date = this.parseTime(_next_time, "{m}月{d}日", false);
      state.step_bar_type = _step_bar_type;
      state.next_display_date = _next_display_date;
      return state
    }
    // 当天传图失败5次 ，下次拍照时间：上次上传时间+1天
    if (page == 1) {
      _next_time = 86400000;
      if (displayInfo.calc.follow_time >= 86400) {
        let day_last_time = this.parseTime(end_time, "{y}/{m}/{d}");
        end_time = new Date(day_last_time).getTime();
      }
      _next_time += end_time;
      _step_bar_type = 2;
      _next_display_date = this.parseTime(_next_time, "{m}月{d}日", false);

      state.step_bar_type = _step_bar_type;
      state.next_display_date = _next_display_date;
      return state
    }
    //可上传图片
    if (page == 0) {
      _step_bar_type = 3;
      _next_display_date = this.parseTime(Date.now(), "{m}月{d}日", false);
      state.step_bar_type = _step_bar_type;
      state.next_display_date = _next_display_date;
      return state
    }

  },
  //获取陈列信息
  display_getinfo() {
    return new Promise(resolve => {
      let obj = {
        display_info: null,
        msg: ''
      }
      getDisplayInfo().then(res => {
        let {
          code,
          data,
          msg
        } = res;
        //有数据处理业务逻辑：
        if (code == 1) {
          //初始化开箱活动状态
          let {
            e_time
          } = data;
          data.act_state = this.init_display_state(e_time);
          data.photo_state = this.displayTakePhotoState(data)
          obj.display_info = data;

        }
        //无数据时候提示返回的信息
        obj.msg = msg;
        resolve(obj)
      });
    })
  },
  //开箱中奖弹窗：缓存一次unbox_win_pop_date
  unbox_win_check_date() {
    //需要判断当前页面是否是首页pages/tabBar/shouye/index
    var pages = getCurrentPages() || [];
    let isHome = false;
    let countPages = pages.length;
    let currentPage = pages[countPages - 1] || {};
    if (currentPage.route == 'pages/tabBar/shouye/index') {
      isHome = true;
    }
    let curr_date = this.parseTime(new Date(), '{y}-{m}-{d}');
    // 当前日期不等于本地缓存日期，弹每日进度弹窗
    if (!wx.getStorageSync('unbox_win_pop_date') && isHome) {
      //覆盖本地缓存日期
      wx.setStorageSync('unbox_win_pop_date', curr_date);
      return true
    }
    return false
  },
  //陈列中奖弹窗：缓存一次dispaly_win_pop_date
  display_win_check_date() {
    //需要判断当前页面是否是首页pages/tabBar/shouye/index
    var pages = getCurrentPages() || [];
    let isHome = false;
    let countPages = pages.length;
    let currentPage = pages[countPages - 1] || {};
    if (currentPage.route == 'pages/tabBar/shouye/index') {
      isHome = true;
    }
    let curr_date = this.parseTime(new Date(), '{y}-{m}-{d}');
    // 当前日期不等于本地缓存日期，弹每日进度弹窗
    if (!wx.getStorageSync('dispaly_win_pop_date') && isHome) {
      //覆盖本地缓存日期
      wx.setStorageSync('dispaly_win_pop_date', curr_date);
      return true
    }
    return false
  },

  win_check_date() {
    //需要判断当前页面是否是首页pages/tabBar/shouye/index
    var pages = getCurrentPages() || [];
    let isHome = false;
    let countPages = pages.length;
    let currentPage = pages[countPages - 1] || {};
    if (currentPage.route == 'pages/tabBar/shouye/index') {
      isHome = true;
    }
    let curr_date = this.parseTime(new Date(), '{y}-{m}-{d}');
    // 当前日期不等于本地缓存日期，弹每日进度弹窗
    if (!wx.getStorageSync('dg_act_win_pop_date') && isHome) {
      //覆盖本地缓存日期
      wx.setStorageSync('dg_act_win_pop_date', curr_date);
      return true
    }
    return false
  },
  checkPrize(exchange, prizeConfig) {
    for (let i = 0; i < prizeConfig.length; i++) {
      const config = prizeConfig[i];
      if (exchange >= config[0] && exchange <= config[1]) {
        const level = i + 1;
        const coupons = config[2] + config[3];
        const nextLevel = i + 1;
        var nextLevelExchange = 0;
        var nextLevelCoupon = 0;
        if (nextLevel < prizeConfig.length) {
          nextLevelExchange = prizeConfig[nextLevel][0] - exchange;
          nextLevelCoupon = prizeConfig[nextLevel][2] + prizeConfig[nextLevel][3];
        }

        return {
          level,
          coupons,
          nextLevelExchange,
          nextLevelCoupon
        }

      }
    }
    return {
      level: 0, //当前区间
      coupons: 0, //当前累计已获得奖券数
      nextLevelExchange: 0, // 距离下一个区间还需要兑换数量
      nextLevelCoupon: 0 // 下一个区间奖券数
    }
  },
  // 2023年7月14日 东莞7-8月 兑奖（战马）活动
  act5_getinfo() {
    return new Promise(resolve => {

      let obj = {
        actInfo: null,
        msg: ''
      }
      getInfoDG().then(res => {
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
          data.exp_time_date_ymd = this.parseTime(data.exp_time, "{y}年{m}月{d}日")
          data.act_start_date = this.parseTime(new Date(s_time.replace(new RegExp(/-/gm), '/')).getTime(), "{y}年{m}月{d}日 {h}:{i}:{s}")
          data.act_start_date_ym = this.parseTime(new Date(s_time.replace(new RegExp(/-/gm), '/')).getTime(), "{y}年{m}月{d}日")
          data.act_end_date = this.parseTime(new Date(e_time.replace(new RegExp(/-/gm), '/')).getTime(), "{y}年{m}月{d}日 {h}:{i}:{s}")
          data.act_end_date_ym = this.parseTime(new Date(e_time.replace(new RegExp(/-/gm), '/')).getTime(), "{y}年{m}月{d}日")
          data.act_state = this.init_act_state({
            s_time,
            e_time
          });
          let prizeInfo = this.checkPrize(data.kpi_num, data.calc);
          data.is_win = Boolean(data.rev_time || prizeInfo.coupons);
          obj.actInfo = data;

          wx.setStorageSync('shopActInfo', JSON.stringify(data))
        } else {
          //无数据时候提示返回的信息
          obj.msg = msg;
          this.inActCoupon(false); //可转让店铺
        }

        resolve(obj)
      });
    })

  },
  // 检查所属奖励区间
  checkRewardRange(kpi_num, calc) {
    let arr = [];
    for (let i = 0; i < calc.length; i++) {
      const config = calc[i];
      if (kpi_num >= config[0] && kpi_num <= config[1]) {
        arr = config;
        break
      }
    }
    return arr;
  },
  // 深圳开箱活动初始化
  init_unbox_state({
    s_time = 0,
    e_time = 0,
  }) {
    let act_state = {
      act_yure: false, //预热
      act_ing: false, //进行中
      act_end: false, //结束
      count_down_timestamp: 0, //倒计时时间戳
      act_expire: false, //活动过期：默认结束7天以后
      daily_pop: false, //每日弹窗
      count_down_format: 'DD天', //倒计时格式，默认天，小于1天显示时分秒
      status_title: '活动已结束', //活动状态默认已结束
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
      this.inUnboxActCoupon('inUnboxAct_SZ', false); //可转让店铺

      return act_state;
    }
    //活动结束
    if (time_now >= time_end) {
      act_state.act_end = true;
      this.inUnboxActCoupon('inUnboxAct_SZ', false); //可转让店铺
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
      //开箱，和陈列活动可能是一起，也可能只有开箱，陈列未解锁。页面需要判断是否解锁陈列
      let curr_date = this.parseTime(new Date(), '{y}-{m}-{d}');

      //需要判断当前页面是否是首页pages/tabBar/shouye/index
      var pages = getCurrentPages() || [];
      let isHome = false;
      let countPages = pages.length;
      let currentPage = pages[countPages - 1] || {};
      if (currentPage.route == 'pages/tabBar/shouye/index') {
        isHome = true;
      }
      // 当前日期不等于本地缓存日期，弹每日进度弹窗
      if ((this.getUnboxDailyPopDate('unbox_daily_pop_date_sz') !== curr_date) && isHome) {
        //覆盖本地缓存日期
        this.setUnboxDailyPopDate('unbox_daily_pop_date_sz',curr_date);
        act_state.daily_pop = true;
      }
      this.inUnboxActCoupon('inUnboxAct_SZ', true); //活动进行中，不可转让店铺
      act_state.countdown_title = '活动进行中'
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
  // 2023年7月25日 深圳8月开箱活动
  act5_getinfo_sz() {
    return new Promise(resolve => {

      let obj = {
        actInfo: null,
        msg: ''
      }
      getInfoSZ().then(res => {
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
            kpi_num,
            calc
          } = data;
          //格式化奖券过期时间
          data.exp_time_date = this.parseTime(data.exp_time, "{y}-{m}-{d}")
          data.exp_time_date_ymd = this.parseTime(data.exp_time, "{y}年{m}月{d}日")
          data.act_start_date = this.parseTime(new Date(s_time.replace(new RegExp(/-/gm), '/')).getTime(), "{y}年{m}月{d}日 {h}:{i}:{s}")
          data.act_start_date_ym = this.parseTime(new Date(s_time.replace(new RegExp(/-/gm), '/')).getTime(), "{y}年{m}月{d}日")
          data.act_end_date = this.parseTime(new Date(e_time.replace(new RegExp(/-/gm), '/')).getTime(), "{y}年{m}月{d}日 {h}:{i}:{s}")
          data.act_end_date_ym = this.parseTime(new Date(e_time.replace(new RegExp(/-/gm), '/')).getTime(), "{y}年{m}月{d}日")
          data.act_state = this.init_unbox_state({
            s_time,
            e_time
          });
          // 根据kpi_num(开箱目标) 判断奖励区间 reward_rang:[]
          data.reward_rang = this.checkRewardRange(kpi_num, calc)
          data.is_win = Boolean(data.rev_time);
          obj.actInfo = data;
          let {
            kpi_1,
            act_state,
          } = data;
          // 获得活动券的规则：0.5倍 || 3箱送2罐
          data.coupon_reward_rule = kpi_1 > 19 ? '（3箱送2罐）' : '0.5倍';
          // 再开箱数，可再获得活动券数
          let next_unbox_num = 0,
            next_coupon_num = 0;
          // 活动进行中才有最少、最多可获得券数（非预热）
          if (!act_state.act_yure) {
            let {
              min_num = 0, max_num = 0, s_num, rev_num, kpi_1, kpi_2
            } = data;
            // 开箱目标，小于最小目标取最小目标，最多不超过最大目标
            let unbox_target = s_num >= kpi_1 ? kpi_2 : kpi_1;
            next_unbox_num = unbox_target - s_num;
            next_unbox_num = next_unbox_num < 0 ? 0 : next_unbox_num;
            let reward_target = rev_num >= min_num ? max_num : min_num;
            next_coupon_num = reward_target - rev_num;
            next_coupon_num = next_coupon_num < 0 ? 0 : next_coupon_num;
          }

          //开箱进度条
          let {
            s_num,
            kpi_2
          } = data;
          // let progressPercent = parseFloat((s_num / kpi_2).toFixed(2)) * 100;
          let progressPercent = Math.ceil(s_num / kpi_2 * 100);
          if (progressPercent > 100) progressPercent = 100;
          data.next_unbox_num = next_unbox_num;
          data.next_coupon_num = next_coupon_num;
          data.progressPercent = progressPercent;
          data.kpi_1 = Math.abs(kpi_1);
          data.kpi_2 = Math.abs(kpi_2);
          wx.setStorageSync('shopUnboxActInfoSZ', JSON.stringify(data))
        } else {
          //无数据时候提示返回的信息
          obj.msg = msg;
          this.inUnboxActCoupon('inUnboxAct_SZ', false); //可转让店铺
        }
        resolve(obj)
      });
    })

  },
  // 是否参与活动：判断禁止转让店铺的
  isInAct(name = 'inUnboxAct_GZ', param) {
    wx.setStorageSync(name, param);
  },
  // 初始化活动开始状态
  initActState({
    s_time = 0,
    e_time = 0,
    status = '未报名',
    inActName='inUnboxAct_GZ',
    dailyPopName='daily_pop_act_16'
  }) {
    let act_state = {
      act_yure: false, //预热
      act_ing: false, //进行中
      act_end: false, //结束
      count_down_timestamp: 0, //倒计时时间戳
      act_expire: false, //活动过期：默认结束7天以后
      daily_pop: false, //每日弹窗
      count_down_format: 'DD天', //倒计时格式，默认天，小于1天显示时分秒
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
      this.isInAct(inActName,false); //可转让店铺

      return act_state;
    }
    //活动结束
    if (time_now >= time_end) {
      act_state.act_end = true;
      this.isInAct(inActName,false); //可转让店铺
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
      if ((this.getDailyPopDate(dailyPopName) !== curr_date) && isHome) {
        //覆盖本地缓存日期
        this.setDailyPopDate(dailyPopName,curr_date);
        act_state.daily_pop = true;
      }
      act_state.countdown_title = '活动进行中'
      if (status != '未报名') {
        this.isInAct(inActName,true); //活动进行中，不可转让店铺
      } else {
        this.isInAct(inActName,false); //未报名
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
  // 2023年8月24日 广州开箱活动
  gzUnboxActInfo(){
    return new Promise(resolve => {

      let obj = {
        actInfo: null,
        msg: ''
      }
      unboxActInfoGz().then(res => {
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
            status,
            rev_time=''
          } = data;
          //格式化奖券过期时间
          data.exp_time_date = this.parseTime(data.exp_time, "{y}-{m}-{d}")
          data.exp_time_date_ymd = this.parseTime(data.exp_time, "{y}年{m}月{d}日")
          data.act_start_date = this.parseTime(new Date(s_time.replace(new RegExp(/-/gm), '/')).getTime(), "{y}年{m}月{d}日 {h}:{i}:{s}")
          data.act_start_date_ym = this.parseTime(new Date(s_time.replace(new RegExp(/-/gm), '/')).getTime(), "{y}年{m}月{d}日")
          data.act_end_date = this.parseTime(new Date(e_time.replace(new RegExp(/-/gm), '/')).getTime(), "{y}年{m}月{d}日 {h}:{i}:{s}")
          data.act_end_date_ym = this.parseTime(new Date(e_time.replace(new RegExp(/-/gm), '/')).getTime(), "{y}年{m}月{d}日")
          data.act_state = this.initActState({
            s_time,
            e_time,
            status,
            inActName:'inUnboxAct_GZ',
            dailyPopName:'daily_pop_act_16'
          });
          data.is_win = Boolean(rev_time);
          obj.actInfo = data;
         
          wx.setStorageSync('gzUnboxActInfo', JSON.stringify(data))
        } else {
          //无数据时候提示返回的信息
          obj.msg = msg;
          this.isInAct('inUnboxAct_GZ', false); //可转让店铺
        }
        resolve(obj)
      });
    })
  },
  // 2023年8月25日 广州 战马兑奖活动
  gzExcActInfo(){
    return new Promise(resolve => {
      let obj = {
        actInfo: null,
        msg: ''
      }
      excActInfoGz().then(res => {
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
            rev_time='',
            status='不用报名'
          } = data;
          //格式化奖券过期时间
          data.exp_time_date = this.parseTime(data.exp_time, "{y}-{m}-{d}")
          data.exp_time_date_ymd = this.parseTime(data.exp_time, "{y}年{m}月{d}日")
          data.act_start_date = this.parseTime(new Date(s_time.replace(new RegExp(/-/gm), '/')).getTime(), "{y}年{m}月{d}日 {h}:{i}:{s}")
          data.act_start_date_ym = this.parseTime(new Date(s_time.replace(new RegExp(/-/gm), '/')).getTime(), "{y}年{m}月{d}日")
          data.act_end_date = this.parseTime(new Date(e_time.replace(new RegExp(/-/gm), '/')).getTime(), "{y}年{m}月{d}日 {h}:{i}:{s}")
          data.act_end_date_ym = this.parseTime(new Date(e_time.replace(new RegExp(/-/gm), '/')).getTime(), "{y}年{m}月{d}日")
          data.act_state = this.initActState({
            s_time,
            e_time,
            status,
            inActName:'inExcAct_GZ',
            dailyPopName:'daily_pop_act_17'
          });
          //ID可用于判断是否已经参与活动，来处理是否能转让店铺，null就是可以转让店铺
          if(data.id == null){
            this.isInAct('inExcAct_GZ', false); //可转让店铺
          }
          data.is_win = Boolean(rev_time);
          data.trans_shop_name = 'gz_zm_exc';
          obj.actInfo = data;
         
          wx.setStorageSync('gzExcActInfo', JSON.stringify(data))
        } else {
          //无数据时候提示返回的信息
          obj.msg = msg;
          this.isInAct('inExcAct_GZ', false); //可转让店铺
        }
        resolve(obj)
      });
    })
  },
  // 10月东莞战马兑奖活动11月30日结束
  dgZmExcActInfo(){
    return new Promise(resolve => {
      let obj = {
        actInfo: null,
        msg: ''
      }
      getInfoDg18().then(res => {
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
            rev_time='',
            status='不用报名'
          } = data;
          //格式化奖券过期时间
          data.exp_time_date = this.parseTime(data.exp_time, "{y}-{m}-{d}")
          data.exp_time_date_ymd = this.parseTime(data.exp_time, "{y}年{m}月{d}日")
          data.act_start_date = this.parseTime(new Date(s_time.replace(new RegExp(/-/gm), '/')).getTime(), "{y}年{m}月{d}日 {h}:{i}:{s}")
          data.act_start_date_ym = this.parseTime(new Date(s_time.replace(new RegExp(/-/gm), '/')).getTime(), "{y}年{m}月{d}日")
          data.act_end_date = this.parseTime(new Date(e_time.replace(new RegExp(/-/gm), '/')).getTime(), "{y}年{m}月{d}日 {h}:{i}:{s}")
          data.act_end_date_ym = this.parseTime(new Date(e_time.replace(new RegExp(/-/gm), '/')).getTime(), "{y}年{m}月{d}日")
          data.act_state = this.initActState({
            s_time,
            e_time,
            status,
            inActName:'inExcAct_DG_ZM',
            dailyPopName:'daily_pop_act_18'
          });
          
          data.is_win = Boolean(rev_time);
          data.trans_shop_name = 'gz_zm_exc';
          obj.actInfo = data;
         
          wx.setStorageSync('dgZmExcActInfo', JSON.stringify(data))
        } else {
          //无数据时候提示返回的信息
          obj.msg = msg;
          this.isInAct('inExcAct_DG_ZM', false); //可转让店铺
        }
        resolve(obj)
      });
    })
  },
}