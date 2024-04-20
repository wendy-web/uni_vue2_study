import { request } from '@/utils';

export default {
  groupCreate: (data) => request.post('/apios/free/speedCreate', data),
  groupList: (data) => request.post('/apios/free/speedList', data),
  groupStatus: (data) => request.post('/apios/free/speedStatus', data),
  groupDetail: (data) => request.post('/apios/free/speedDetail', data),
  goodsQueryList: (data) => request.post('/api/Get/goodsQuery', data),
  goodsSearch: (data) => request.post('/api/Pinduoduo/goodsSearch', data),
  couponList: (data) => request.post('/apios/coupon/getAll', data),
  shopGroup: (data) => request.post('/apios/free/speedGroup', data),
  groupDelete: (data) => request.post('/apios/free/speedDelete', data),
}
