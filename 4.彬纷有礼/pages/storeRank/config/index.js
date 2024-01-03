// 奖品设置
let prizeConfig = [{
    rank: '1',
    num: 10,
    unit: '箱',
    brand: '红牛'

  },
  {
    rank: '2-5',
    num: 5,
    unit: '箱',
    brand: '红牛'
  },
  {
    rank: '6-20',
    num: 3,
    unit: '箱',
    brand: '红牛'
  },
  {
    rank: '21-50',
    num: 2,
    unit: '箱',
    brand: '红牛'
  },
  {
    rank: '51-100',
    num: 1,
    unit: '箱',
    brand: '红牛'
  },
  {
    rank: '101-200',
    num: 12,
    unit: '罐',
    brand: '红牛'
  },
]

// 深圳兑奖活动（红牛、战马）
let exc_sz = [
  [1, 30, 120, 72], // 一等奖：30名，原味红牛/罐 罐装战马/罐 
  [31, 90, 72, 48], // 二等奖：60名，红牛，战马
  [91, 170, 48, 24], // 三等奖：80名
  [171, 670, 12, 12] // 四等奖 500名
]
module.exports = {
  prizeConfig,
  // initPrizeConfig(calc = null) {
  //   let _prizeConfig = JSON.parse(JSON.stringify(prizeConfig))
  //   if (calc) {
  //     calc.forEach((calcItem,index) => {
  //       _prizeConfig.forEach((prizeItem, idx) => {
  //         if (index == 0) {
  //           _prizeConfig[index].rank = calcItem[0]
  //         } else {
  //           _prizeConfig[index].rank = calcItem[0] + '-' + calcItem[1]
  //         }
  //         _prizeConfig[index].num = calcItem[2]
  //         _prizeConfig[index].unit = calcItem[calcItem.length - 1]
  //       })
  //     })
  //     return _prizeConfig
  //   }
  //   return _prizeConfig
  // }

  initPrizeConfig(calc = null) {
    console.log("calc:", calc);
    let _prizeConfig = JSON.parse(JSON.stringify(prizeConfig))
    if (calc) {
      calc.forEach((calcItem, index) => {
        _prizeConfig.forEach((prizeItem, idx) => {
          if (index == 0) {
            _prizeConfig[index].rank = calcItem[0]
          } else {
            _prizeConfig[index].rank = calcItem[0] + '-' + calcItem[1]
          }
          _prizeConfig[index].num = calcItem[2]
          _prizeConfig[index].unit = calcItem[calcItem.length - 1]
        })
      })
      return _prizeConfig
    }
    return _prizeConfig
  },
  unboxInitPrizeConfig(calc = exc_sz) {
    let _prizeConfig = [];
    if (calc) {
      calc.forEach((calcItem, index) => {
        let obj = {};
        // obj.rank = index == 0 ? calcItem[0] : calcItem[0] + '-' + calcItem[1]
        obj.rank =  [calcItem[0] , calcItem[1]];
        obj.numArr = [calcItem[2], calcItem[3]];
        obj.unit = '张'
        _prizeConfig.push(obj)
      })
      return _prizeConfig
    }
    return _prizeConfig
  }
}