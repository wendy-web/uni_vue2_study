import { request } from '@/utils'

export default {
    getList: (data) => request.post('/apios/extend/userTotal', data),
}