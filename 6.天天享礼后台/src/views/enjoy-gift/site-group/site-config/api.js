import { request } from '@/utils'

export default {
  getList: (data) => request.post('/apios/Jd/siteList', data),
  getGroupDetails: (data) => request.post('/apios/Jd/siteXq', data),
  operatGroup: (data) => request.post('/apios/Jd/createSite', data),
}
