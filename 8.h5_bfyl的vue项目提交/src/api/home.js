import request from '@/utils/request'
// 原油墨检验单列表
export function citicinfoApi(data) {
  return request({
    url: '/app/ad/citicinfo',
    method: 'post',
    data
  })
}