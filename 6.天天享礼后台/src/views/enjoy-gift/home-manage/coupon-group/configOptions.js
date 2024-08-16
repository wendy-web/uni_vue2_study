import http from './api';
export const initPageOptions = [
  {
    label: '自建',
    value: 1,
    _tableData: null,
    getData: '',
  },
  {
    label: '京东',
    value: 2,
    _tableData: null,
    getData: http.goodsQueryList,
  },
  {
    label: '选品库',
    value: 3,
    _tableData: null,
    getData: http.goodsQueryList,
  },
  {
    label: '拼多多',
    value: 4,
    _tableData: null,
    getData: http.goodsSearch,
  },
]

export const userOptions = [
  {
    label: '天天享礼',
    value: 0,
  },
  {
    label: '彬纷享礼',
    value: 1,
  },
  {
    label: '省钱卡专享',
    value: 2,
  },
]
/**系统下拉 */
export const typeOptions = [
  {
    label: '苹果机',
    value: 1,
  },
  {
    label: '公共',
    value: 2,
  },
  {
    label: '安卓机',
    value: 3,
  },
]
export const yyOptions = [
  {
    label: '天天享礼',
    value: 0,
  },
  {
    label: '彬纷享礼',
    value: 1,
  },
]
export const typeStatus = [
  {
    label: '上架',
    value: 1,
  },
  {
    label: '下架',
    value: 0,
  },
]
export const typeAdd = [
  {
    label: '手动配置',
    value: 0,
  },
  {
    label: '系统配置',
    value: 1,
  },
]
export const tyOptionsUpdate = [
  {
    label: '京东半屏',
    value: 0,
  },
  {
    label: '天天享礼全屏',
    value: 1,
  },
  {
    label: '天天享礼半屏',
    value: 2,
  },
]
export const pathOptions = [
  {
    label: '个人中心',
    value: 0,
  },
  {
    label: '扫码未中奖',
    value: 1,
  },
]
