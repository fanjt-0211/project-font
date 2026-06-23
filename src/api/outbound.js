import request from './index'

// 出库分页列表
export const getOutboundList = (params) => request.get('/outbound', { params })
// 出库详情
export const getOutboundById = (id) => request.get(`/outbound/${id}`)
// 新增出库
export const addOutbound = (data) => request.post('/outbound', data)
