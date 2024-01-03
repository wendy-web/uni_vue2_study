import { request } from '@/utils'

export default {
    getList: (data) => request.post('/apios/Power/getList', data),
    getLists: (data) => request.post('/apios/Power/getLists', data),
    create: (data) => request.post('/apios/Power/create', data),
    details: (data) => request.post('/apios/Power/details', data),
    delete: (data) => request.post('/apios/power/delete', data),
}