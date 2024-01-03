import { request } from '@/utils'

export default {
    getList: (data) => request.post('/apios/popover/getList', data),
    operatSingleImage: (data) => request.post('/apios/popover/create', data),
    getSingleImage: (data) => request.post('/apios/popover/getXq', data),
    deleteSingleImage: (data) => request.post('/apios/popover/delete', data),
    updateSingleImageStatus: (data) => request.post('/apios/popover/updateStatus', data),
    getLists: (data) => request.post('/apios/Jd/getLists', data),
}