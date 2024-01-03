import { request } from '@/utils'

export default {
  getList: (data) => request.post('/xdyhos/jd/getkeywordList', data),
  operatSingleImage: (data) => request.post('/xdyhos/jd/keywordCreate', data),
  getSingleImage: (data) => request.post('/xdyhos/jd/keywordXq', data),
  deleteSingleImage: (data) => request.post('/xdyhos/jd/keywordDelete', data),
}
