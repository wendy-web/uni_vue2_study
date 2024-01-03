import {request} from '@/utils'

export default {
    goodsQueryList: (data) => request.post('/api/Get/goodsQuery', data),
    goodsList: (data) => request.post('/apios/Goods/getList', data),
    leakList: (data) => request.post('/apios/Popover/leakList', data),
    leakGoods: (data) => request.post('/apios/Popover/leakGoods', data),
    leakDel: (data) => request.post('/apios/Popover/leakDel', data),
    leakTime: (data) => request.post('/apios/Popover/leakTime', data),
    leakSort: (data) => request.post('/apios/Popover/leakSort', data),
    goodsSearch: (data) => request.post('/api/Pinduoduo/goodsSearch', data),
    goodsList2: (data) => request.post('/api/get/jusbaoGoods', data),
}