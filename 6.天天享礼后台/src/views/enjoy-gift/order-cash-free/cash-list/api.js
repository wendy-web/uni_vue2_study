import { request } from '@/utils';

export default {
  groupCreate: (data) => request.post('/apios/free/groupCreate', data),
  groupList: (data) => request.post('/apios/free/groupList', data),
  groupStatus: (data) => request.post('/apios/free/groupStatus', data),
  groupDetail: (data) => request.post('/apios/free/groupDetail', data),
  goodsQueryList: (data) => request.post('/api/Get/goodsQuery', data),
  goodsSearch: (data) => request.post('/api/Pinduoduo/goodsSearch', data),
  couponList: (data) => request.post('/apios/coupon/getAll', data),
  shopGroup: (data) => request.post('/apios/free/shopGroup', data),
  groupDelete: (data) => request.post('/apios/free/groupDelete', data),
}
