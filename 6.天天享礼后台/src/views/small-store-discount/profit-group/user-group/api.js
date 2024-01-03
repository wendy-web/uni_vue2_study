import { request } from '@/utils'

export default {
    getList: (data) => request.post('/xdyhos/team/userList', data),
    getXq: (data) => request.post('/xdyhos/team/userXq', data),
    create: (data) => request.post('/xdyhos/team/userCreate', data),
    getParent: (data) => request.post('/xdyhos/team/userParent', data),
}