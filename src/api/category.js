import request from './index'

// 分类列表
export const getCategoryList = (params) => request.get('/category', { params })
// 分类详情
export const getCategoryById = (id) => request.get(`/category/${id}`)
// 新增分类
export const addCategory = (data) => request.post('/category', data)
// 更新分类
export const updateCategory = (data) => request.put('/category', data)
// 启用/禁用分类
export const updateCategoryStatus = (status, data) => request.post(`/category/status/${status}`, data)
