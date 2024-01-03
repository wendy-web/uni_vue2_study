import { request } from '@/utils'

export default {
    groupDetails: (data) => request.post('/apios/Power/groupDetails', data),
    groupList: (data) => request.post('/apios/Power/groupList', data),
    getList: (data) => request.post('/apios/power/getList', data),
    useGetList: (data) => request.post('/apios/user/getList2', data),
    groupCreate: (data) => request.post('/apios/power/groupCreate', data),
    groupDelte: (data) => request.post('/apios/power/groupDelte', data),
}