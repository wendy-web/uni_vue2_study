import { request } from '@/utils'

export default {
    getList: (data) => request.post('/apios/Extend/getList', data),
    getLists: (data) => request.post('/apios/Extend/getLists', data),
    create: (data) => request.post('/apios/Extend/create', data),
    details: (data) => request.post('/apios/Extend/details', data),
    delete: (data) => request.post('/apios/Extend/del', data),
    getEcharts: (data) => request.post('/apios/Extend/getEcharts', data),
    noteList: (data) => request.post('/apios/Extend/noteList', data),
    noteDel: (data) => request.post('/apios/Extend/noteDel', data),
    noteXq: (data) => request.post('/apios/Extend/noteXq', data),
    noteCreate: (data) => request.post('/apios/Extend/noteCreate', data),
}