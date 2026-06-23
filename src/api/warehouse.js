import request from './index'

// 仓库列表
export const getWarehouseList = (params) => request.get('/warehouse', { params })
// 仓库详情
export const getWarehouseById = (id) => request.get(`/warehouse/${id}`)
// 新增仓库
export const addWarehouse = (data) => request.post('/warehouse', data)
// 更新仓库
export const updateWarehouse = (id, data) => request.put(`/warehouse/${id}`, data)
// 启用/禁用仓库
export const updateWarehouseStatus = (status, data) => request.post(`/warehouse/status/${status}`, data)
