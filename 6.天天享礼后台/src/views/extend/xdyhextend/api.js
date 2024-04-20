import { request } from '@/utils'

export default {
    getList: (data) => request.post('/xdyhos/Extend/getList', data),
    getLists: (data) => request.post('/xdyhos/Extend/getLists', data),
    create: (data) => request.post('/xdyhos/Extend/create', data),
    details: (data) => request.post('/xdyhos/Extend/details', data),
    delete: (data) => request.post('/xdyhos/Extend/del', data),
    getEcharts: (data) => request.post('/xdyhos/Extend/getEcharts', data),
}