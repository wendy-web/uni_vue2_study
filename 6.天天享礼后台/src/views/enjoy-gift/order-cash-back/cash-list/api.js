import { request } from '@/utils';

export default {
  groupList: (data) => request.post('/apios/Profit/groupList', data),
  groupStatus: (data) => request.post('/apios/Profit/groupStatus', data),
  groupDetail: (data) => request.post('/apios/Profit/groupDetail', data),
  goodsQueryList: (data) => request.post('/api/Get/goodsQuery', data),
  goodsSearch: (data) => request.post('/api/Pinduoduo/goodsSearch', data),
  couponList: (data) => request.post('/apios/coupon/getAll', data),
  groupCreate: (data) => request.post('/apios/Profit/groupCreate', data),
  shopGroup: (data) => request.post('/apios/profit/shopGroup', data),
  groupDelete: (data) => request.post('/apios/Profit/groupDelete', data),
}
