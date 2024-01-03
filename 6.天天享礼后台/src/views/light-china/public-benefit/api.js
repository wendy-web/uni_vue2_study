import { request } from '@/utils'
export default {
  getList: (data) => request.post('/bfzxos/commonweal/getList', data),
  getInfo: (data) => request.post('/bfzxos/commonweal/getInfo', data),
  delete: (data) => request.post('/bfzxos/commonweal/delete', data),
  updateStatus: (data) => request.post('/bfzxos/commonweal/updateStatus', data),
  sendWxMsg: (data) => request.post('/bfzxos/commonweal/sendWxMsg', data),
  create: (data) => request.post('/bfzxos/commonweal/create', data),
  createIntroduce: (data) => request.post('/bfzxos/commonweal/createIntroduce', data),
  createInstitution: (data) => request.post('/bfzxos/commonweal/createInstitution', data),
  createProgress: (data) => request.post('/bfzxos/commonweal/createProgress', data),
  createPerform: (data) => request.post('/bfzxos/commonweal/createPerform', data),
  createCert: (data) => request.post('/bfzxos/commonweal/createCert', data),
  createWxMsg: (data) => request.post('/bfzxos/commonweal/createWxMsg', data),
}
