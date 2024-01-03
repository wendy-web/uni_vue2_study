import request from '@/utils/request'
// 有礼2023年账单
export function bill2023Api(data) {
  return request({
    url: '/api/info/bill2023',
    method: 'post',
    data
  })
}
