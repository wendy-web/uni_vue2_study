import { request } from '@/utils'

export default {
  singletonCreate: (data) => request.post('/xdyhos/Team/singletonCreate', data),
  singletonXq: (data) => request.post('/xdyhos/Team/singletonXq', data),
  tabbarTeam: (data) => request.post('/xdyhos/Team/tabbarTeam', data),
  tabbarTeamXq: (data) => request.post('/xdyhos/Team/tabbarTeamXq', data),
  advertisementConfig: (data) => request.post('/xdyhos/Team/advertisementConfig', data),
  advertisementXq: (data) => request.post('/xdyhos/Team/advertisementXq', data),
  rebateConfig: (data) => request.post('/xdyhos/Team/rebateConfig', data),
  rebateXq: (data) => request.post('/xdyhos/Team/rebateXq', data),
}
