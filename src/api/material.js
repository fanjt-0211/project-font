import request from './index'

// 物资分页列表
export const getMaterialList = (params) => request.get('/material', { params })
// 物资详情
export const getMaterialById = (id) => request.get(`/material/${id}`)
// 新增物资
export const addMaterial = (data) => request.post('/material', data)
// 更新物资
export const updateMaterial = (id, data) => request.put(`/material/${id}`, data)
