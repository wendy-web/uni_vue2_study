import { request } from '@/utils';

export default {
  goodsList: (data) => request.post('/apios/Goods/goodsList', data),
}
