import request from './index'

// 入库分页列表
export const getInboundList = (params) => request.get('/inbound', { params })
// 入库详情
export const getInboundById = (id) => request.get(`/inbound/${id}`)
// 新增入库
export const addInbound = (data) => request.post('/inbound', data)
