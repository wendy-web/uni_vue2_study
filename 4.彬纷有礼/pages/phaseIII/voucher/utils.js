const _app = getApp();
const COS_URL = _app.globalData.COS_URL || 'https://file.y1b.cn';
// 卡券tab map
var voucher_tab_map = {
  0: {
    1: {
      name: '中国红牛',
      api: '/api/card/getcardlog',
      list: 'exc_hn_list',
      nomore: 'exc_hn_nomore',
      param: {
        "next": 1,
        "check_status": 0,
        "exp_status": 0,
        "open": 3,
        "start_time": "",
        "end_time": ""
      },
      reset_param:{
        "next": 1,
        "check_status": 0,
        "exp_status": 0,
        "open": 3,
        "start_time": "",
        "end_time": ""
      }
    },
    2: {
      name: '战马',
      api: '/api/card/getexclog',
      list: 'exc_zm_list',
      nomore: 'exc_zm_nomore',
      param: {
        "next": 1,
        "check_status": 0,
        "type": "2",
        "exp_status": 0
      },
      reset_param:{
        "next": 1,
        "check_status": 0,
        "type": "2",
        "exp_status": 0
      }
    }
  },
  1: {
    name: '惠让券',
    api: '/api/card/actlist',
    list: 'hr_list',
    nomore: 'hr_nomore',
    param: {
      "start_time": "",
      "end_time": "",
      "next": 1
    },
    reset_param:{
      "start_time": "",
      "end_time": "",
      "next": 1
    }
  },
  2: {
    name: '活动',
    api: '/api/card/act4List',
    list: 'act_list',
    nomore: 'act_nomore',
    param: {
      "status": 1,
      "start_time": "",
      "end_time": ""
    },
    reset_param:{
      "status": 1,
      "start_time": "",
      "end_time": ""
    }
  }
}
// 卡券使用记录
// var voucher_used_history = {
//   0:{

//   },
//   2:{
      
//   },
// }
// 可用卡券红牛-周年图标水印
var hn_voucher_stamp_map = {
  0: {
    img:COS_URL + '/public/img/phaseIII/202103/stamp_25.png',
    class:'stamp_25'
  },
  1: {
    img:COS_URL + '/public/img/phaseIII/202103/stamp_25.png',
    class:'stamp_25'
  },
  2: {
    img:COS_URL + '/public/img/bfyl/202302/hn_stamp_26.png',
    class:'stamp_28'
  },
  3: {
    img:COS_URL + '/public/img/bfyl/202302/hn_stamp_27.png',
    class:'stamp_28'
  },
  4: {
    img:COS_URL + '/public/img/bfyl/202301/icon_zm_exc.png',
    class:'stamp_25'
  },
  5: {
    img:COS_URL + '/public/img/bfyl/202301/icon_zm_exc_award.png',
    class:'stamp_25'
  },
  6: {
    img:COS_URL + '/public/img/bfyl/202302/hg_stamp_28.png',
    class:'stamp_28'
  },
  7: {
    img:COS_URL + '/public/img/bfyl/202302/jl_stamp_28.png',
    class:'stamp_28'
  },
  9: {
    // img:COS_URL + '/public/img/bfyl/2023/08/cashCoupon/bg_type9_stamp.png',
    img:COS_URL + '/public/img/bfyl/2023/09/bg_coupon_right.png',
    class:'bg-type9-stamp'
  },
  11: {
    img:COS_URL + '/public/img/bfyl/202301/icon_zm_exc.png',
    class:'stamp_25'
  },
}
// 卡券标题
var voucher_title_map = {
  0: "【1元轻松享】",
  1: "【1元轻松享】",
  2: "【1元享红牛】",
  3: "【1元乐享】",
  4: "【1元乐享换购券】",
  5: "【1元乐享换购奖励券】",
  6: "【1元换购券】",
  7: "【1元换购奖励券】",
  9: "箱内码【产品兑换券】",
  11: "【1元乐享换购券】",
}
// 可用卡券列表背景
var voucher_bg_map = {
    0: COS_URL + '/public/img/phaseIII/202103/itemBG_25_1.png',
    1: COS_URL + '/public/img/phaseIII/202103/itemBG_25_1.png',
    2: COS_URL + '/public/img/bfyl/202302/voucher_bg_left.png',
    3: COS_URL + '/public/img/bfyl/202302/voucher_bg_left.png',
    4: COS_URL + '/public/img/bfyl/202301/bg_zm_coupon.png',
    5: COS_URL + '/public/img/bfyl/202301/bg_zm_coupon.png',
    6: COS_URL + '/public/img/bfyl/202302/voucher_bg_left.png',
    7: COS_URL + '/public/img/bfyl/202302/voucher_bg_left.png',
    // 8: COS_URL + '/public/img/bfyl/202302/voucher_bg_left.png',
    // 9: COS_URL + '/public/img/bfyl/2023/08/cashCoupon/bg_type9.png',
    9: COS_URL + '/public/img/bfyl/2023/09/bg_coupon_left.png',
    11: COS_URL + '/public/img/bfyl/202302/voucher_bg_left.png',
}
// 红牛已使用卡券周年 水印
var hn_used_voucher_stamp = {
  0: {
    img:COS_URL + '/public/img/phaseIII/20211020/stamp_25.png',
    class:'stamp_25'
  },
  1: {
    img:COS_URL + '/public/img/phaseIII/20211020/stamp_25.png',
    class:'stamp_25'
  },
  2: {
    img:COS_URL + '/public/img/bfyl/202202/icon_stamp_26.png',
    class:'stamp_27'
  },
  3: {
    img:COS_URL + '/public/img/bfyl/202202/icon_stamp_27.png',
    class:'stamp_27'
  },
  4: {
    img:COS_URL + '/public/img/bfyl/202202/icon_stamp_27.png',
    class:'stamp_27'
  },
  5: {
    img:COS_URL + '/public/img/bfyl/202202/icon_stamp_27.png',
    class:'stamp_27'
  },
  6: {
    img:COS_URL + '/public/img/bfyl/202302/hn_stamp_28.png',
    class:'stamp_28'
  },
  7: {
    img:COS_URL + '/public/img/bfyl/202302/hn_stamp_28.png',
    class:'stamp_28'
  },
  9: {
    img:COS_URL + '/public/img/bfyl/2023/08/cashCoupon/bg_type9_stamp_grey.png',
    class:'stamp_28'
  }
}
function getDistanceFromLatLonInKm({lat1,lon1,lat2,lon2}) {
  var R = 6371; // 地球半径，单位是公里
  var dLat = deg2rad(lat2-lat1);  
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // 距离，单位是公里
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}
// 2023年9月14日 已过期-换购券 水印
const expire_exc_stamp = {
  0: `${COS_URL}/public/img/bfyl/2023/09/icon_stamp_grey_25.png`,
  1: `${COS_URL}/public/img/bfyl/2023/09/icon_stamp_grey_25.png`,
  2: `${COS_URL}/public/img/bfyl/2023/09/icon_stamp_grey_26.png`,
  3: `${COS_URL}/public/img/bfyl/2023/09/icon_stamp_grey_27.png`,
  4: `${COS_URL}/public/img/bfyl/2023/09/icon_stamp_grey_27.png`,
  5: `${COS_URL}/public/img/bfyl/2023/09/icon_stamp_grey_27.png`,
  6: `${COS_URL}/public/img/bfyl/2023/09/icon_stamp_grey_28.png`,
  7: `${COS_URL}/public/img/bfyl/2023/09/icon_stamp_grey_28.png`,
  9: `${COS_URL}/public/img/bfyl/2023/09/icon_stamp_hn_dhq.png`,
  11:`${COS_URL}/public/img/bfyl/2023/09/icon_stamp_zm_grey.png`,
}
module.exports = {
  voucher_tab_map,
  // voucher_used_history
  voucher_bg_map,
  voucher_title_map,
  hn_voucher_stamp_map,
  hn_used_voucher_stamp,
  getDistanceFromLatLonInKm,
  expire_exc_stamp
}