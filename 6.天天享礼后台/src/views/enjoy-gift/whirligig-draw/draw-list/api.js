import { request } from '@/utils';

export default {
  getList: (data) => request.post('/apios/Whirligig/getList', data),
  getDetail: (data) => request.post('/apios/Whirligig/getXq', data),
  goodsQueryList: (data) => request.post('/api/Get/goodsQuery', data),
  goodsQueryList2: (data) => request.post('/api/Pinduoduo/goodsSearch', data),
  doCreate: (data) => request.post('/apios/Whirligig/create', data),
  doDelete: (data) => request.post('/apios/Whirligig/delete', data),
}
