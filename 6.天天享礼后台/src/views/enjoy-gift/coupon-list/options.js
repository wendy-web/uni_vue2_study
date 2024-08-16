/** 启用状态下拉列表 */
export const lsOptions = [
  {
    label: '启用',
    value: 2,
  },
  {
    label: '未启用',
    value: 1,
  },
  {
    label: '系统停用',
    value: 0,
  },
]
/**启用状态下拉列表 */
export const options = [
  {
    label: '上架',
    value: 1,
  },
  {
    label: '下架',
    value: 0,
  },
]
/** 启用状态下拉列表 */
export const dtOptions = [
  {
    label: '商品',
    value: 1,
  },
  {
    label: '公众号',
    value: 2,
  },
  {
    label: '视频号',
    value: 3,
  },
  {
    label: '小程序',
    value: 4,
  },
  {
    label: '聚推客电影',
    value: 5,
  },
  {
    value: 6,
    label: '小程序内页',
  },
  {
    value: 7,
    label: '视频组件',
  },
  {
    value: 8,
    label: '乐唯娃娃机',
  },
  {
    value: 9,
    label: '多商品滑动',
  },
  {
    value: 10,
    label: '广告推券',
  },
  {
    value: 11,
    label: '小程序h5',
  },
  /*{
          value: 12,
          label: '惠吃喝囤券',
        },*/
  {
    value: 13,
    label: '高返现商品',
  },
  {
    value: 14,
    label: '橙券商品',
  },
]

// 系统类型
export const deviceOptions = [
  {
    label: '苹果',
    value: 1,
  },
  {
    label: '公共',
    value: 2,
  },
  {
    label: '安卓',
    value: 3,
  },
]
// 红包金额
export const amountOptions = [
  {
    label: '2元',
    value: 200,
  },
  {
    label: '3元',
    value: 300,
  },
  {
    label: '5元',
    value: 500,
  },
  {
    label: '10元',
    value: 1000,
  },
  {
    label: '20元',
    value: 2000,
  },
  {
    label: '30元',
    value: 3000,
  },
  {
    label: '40元',
    value: 4000,
  },
]
// 砸金蛋金额
export const amount2Options = [
  {
    label: '10元',
    value: 1000,
  },
  {
    label: '15元',
    value: 1500,
  },
  {
    label: '20元',
    value: 2000,
  },
  {
    label: '25元',
    value: 2500,
  },
  {
    label: '30元',
    value: 3000,
  },
  {
    label: '35元',
    value: 3500,
  },
  {
    label: '40元',
    value: 4000,
  },
]

// 红包金额类型
export const amounttypeOptions = [
  {
    label: '红包金额个性化',
    value: 1,
  },
  {
    label: '指定红包金额',
    value: 2,
  },
  {
    label: '红包抵后价',
    value: 3,
  },
]

// 营销工具
export const pddOptions = [
  {
    label: '红包',
    value: 0,
  },
  {
    label: '新人红包',
    value: 2,
  },
  {
    label: '刮刮卡',
    value: 3,
  },
  {
    label: '员工内购',
    value: 5,
  },
  {
    label: '砸金蛋',
    value: 12,
  },
  {
    label: '千万补贴B端页面',
    value: 14,
  },
  {
    label: '充值中心B端页面',
    value: 15,
  },
  {
    label: '千万补贴C端页面',
    value: 16,
  },
  {
    label: '超级红包',
    value: 23,
  },
  {
    label: '礼金全场N折活动B端页面',
    value: 24,
  },
  {
    label: '带货赢千万',
    value: 27,
  },
  {
    label: '千万神券C端页面',
    value: 34,
  },
  {
    label: '千万神券B端页面',
    value: 35,
  },
  {
    label: '超级红包B端推品页',
    value: 37,
  },
]
export const giftOptions = [
  {
    value: 0,
    label: '否',
  },
  {
    value: 1,
    label: '是',
  },
]
export const tjOptions = [
  {
    value: 0,
    label: '是',
  },
  {
    value: 1,
    label: '否',
  },
]
// 主体关系
export const isMainOptions = [
  {
    label: '同主体',
    value: 1,
  },
  {
    label: '非同主体',
    value: 2,
  },
]
// 跳转方式
export const isMainOptions2 = [
  {
    label: '直接跳转',
    value: 1,
  },
  {
    label: '中转跳转',
    value: 2,
  },
]
export const xcxType = [
  {
    label: '请选择',
    value: 0,
  },
  {
    label: '京东联盟',
    value: 1,
  },
  {
    label: '美团联盟',
    value: 2,
  },
  {
    label: '拼多多',
    value: 3,
  },
  {
    label: '其他',
    value: 4,
  },
]

// 跳转方式
export const jumpType = ref([
  {
    label: '直接跳转',
    value: 1,
  },
  {
    label: '进入跳转',
    value: 2,
  },
])
export const typeOptions = ref([
  {
    label: '麦当劳',
    value: 1,
    disabled: true,
  },
  {
    label: '肯德基',
    value: 2,
    disabled: true,
  },
  {
    label: '瑞幸',
    value: 3,
    disabled: true,
  },
  {
    label: '星巴克',
    value: 4,
    disabled: true,
  },
])

export const pathOptions = ref([
  {
    label: '小程序内页',
    value: 5,
  },
  {
    label: '惠生活',
    value: 1,
  },
  {
    label: '福利中心',
    value: 2,
  },
  {
    label: '领券中心',
    value: 3,
  },
  {
    label: '海威瑞幸',
    value: 4,
  },
  {
    label: '海威麦当劳',
    value: 6,
  },
  {
    label: '海威肯德基',
    value: 7,
  },
])
// 小程序的打开方式
export const openMiniType = ref([
  {
    label: '跳转打开',
    value: 1,
  },
  {
    label: '半屏打开',
    value: 2,
  },
])
// 返佣商品的打开方式
export const openMiniType2 = ref([
  {
    label: '直接打开',
    value: 1,
  },
  {
    label: '详情打开',
    value: 2,
  },
])
// 充值的类型
export const rechargeOptions = ref([
  {
    label: '手机号码充值',
    value: 1,
    placeholder: '请输入手机号码',
  },
  {
    label: '其他账号充值',
    value: 2,
    placeholder: '请输入手机号码或QQ账号',
  },
])
//拼多多频道来源
export const resourceOptions = ref([
  {
    label: '限时秒杀',
    value: 4,
  },
  {
    label: '活动转链',
    value: 39998,
  },
  {
    label: '百亿补贴',
    value: 39996,
  },
  {
    label: '领券中心',
    value: 40000,
  },
  {
    label: '火车票',
    value: 50005,
  },
])
