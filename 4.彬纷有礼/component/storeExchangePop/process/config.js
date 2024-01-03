export const prizeConfig = [{
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
// 计算当前兑换人数在奖励设置的区间，累计奖券，距离下一个区间所需的兑换数量
export function checkPrize(exchange = 0) {
  for (let i = 0; i < prizeConfig.length; i++) {
    const config = prizeConfig[i];
    if (exchange >= config.min && exchange <= config.max) {
      const level = i + 1;
      const coupons = config.hn_coupon + config.zm_coupon;
      const nextLevel = i + 1;
      var nextLevelExchange = 0;
      var nextLevelCoupon = 0;
      if (nextLevel < prizeConfig.length) {
        nextLevelExchange = prizeConfig[nextLevel].min - exchange;
        nextLevelCoupon = prizeConfig[nextLevel].hn_coupon + prizeConfig[nextLevel].zm_coupon;
      }
      return {
        level,
        coupons,
        nextLevelExchange,
        nextLevelCoupon
      }
    }
  }
  // 默认是第一个区间
  const firstConfig = prizeConfig[0];
  var nextLevelExchange = firstConfig['min'] - exchange;
  var nextLevelCoupon = firstConfig['hn_coupon'] + firstConfig['zm_coupon'];
  return {
    level: 0, //当前区间
    coupons: 0, //当前累计已获得奖券数
    nextLevelExchange: nextLevelExchange > 0 ? nextLevelExchange : 0, // 距离下一个区间还需要兑换数量
    nextLevelCoupon: nextLevelCoupon // 下一个区间奖券数
  }
}