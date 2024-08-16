import { request } from '@/utils';

export default {
  goodsQueryList: (data) => request.post('/api/Get/goodsQuery', data), // 关键词搜索
  jingfen: (data) => request.post('/api/get/jingfen', data), // 京东精选搜索
  category: (data) => request.post('/api/Get/category', data), // 获取京东的类目
  groupList: (data) => request.post('/apios/Group/groupList', data), // 获取群列表
  queueCreate: (data) => request.post('/apios/Group/queueCreate', data), // 添加创建列表
  goodsSearch: (data) => request.post('/api/Pinduoduo/goodsSearch', data), // 拼多多的商品搜索
  goodsCats: (data) => request.post('/api/Pinduoduo/goodsCats', data), // 拼多多的商品搜索
  goodsRecommend: (data) => request.post('/api/Pinduoduo/goodsRecommend', data), // 拼多多的推荐商品接口
}
