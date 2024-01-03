// 奖品设置
const prizeConfig = [{
    min: 15, //最小兑奖人数
    max: 29, //最大兑奖人数
    hn_coupon: 6, //红牛券
    zm_coupon: 6 //战马券
  },
  {
    min: 30,
    max: 44,
    hn_coupon: 12,
    zm_coupon: 12
  },
  {
    min: 45,
    max: 59,
    hn_coupon: 18,
    zm_coupon: 18
  },
  {
    min: 60,
    max: 89,
    hn_coupon: 24,
    zm_coupon: 24
  },
  {
    min: 90,
    max: 199,
    hn_coupon: 42,
    zm_coupon: 42
  },
  {
    min: 200,
    max: 99999999,
    hn_coupon: 120,
    zm_coupon: 120
  },
];
// 中文数字字典
const CN_DIGITS = {
  "0": "零",
  "1": "一",
  "2": "二",
  "3": "三",
  "4": "四",
  "5": "五",
  "6": "六",
  "7": "七",
  "8": "八",
  "9": "九",
};
module.exports = {
  initPrizeConfig(calc = null) {
    let _prizeConfig = [];
    if (calc) {
      calc.forEach((calcItem, index) => {
        let obj = {};
        obj.min = calcItem[0];
        obj.max = calcItem[1];
        obj.hn_coupon = calcItem[2];
        obj.zm_coupon = calcItem[3];
        // let obj = {};
        // obj.rank = index == 0 ? calcItem[0] : calcItem[0] + '-' + calcItem[1]
        // obj.numArr = [calcItem[2], calcItem[3]];
        // obj.unit = '张'
        _prizeConfig.push(obj)
      })
      return _prizeConfig
    }
    return _prizeConfig
  },
  prizeConfig,
  unboxInitPrizeConfig(calc = exc_sz) {
    let _prizeConfig = [];
    if (calc) {
      calc.forEach((calcItem, index) => {
        let obj = {};
        obj.rank =  [calcItem[0] , calcItem[1]];
        obj.numArr = [calcItem[2], calcItem[3]];
        obj.unit = '张';
        obj.unit_box = '箱';
        obj.box_num = calcItem[2]/24;
        obj.prizeLevel = CN_DIGITS[index+1]
        _prizeConfig.push(obj)
      })
      return _prizeConfig
    }
    return _prizeConfig
  }
}