import request from './index'

// 登录
export const login = (data) => request.post('/users/login', data)

// 用户列表
export const getUserList = (params) => request.get('/users', { params })
// 用户详情
export const getUserById = (id) => request.get(`/users/${id}`)
// 新增用户
export const addUser = (data) => request.post('/users', data)
// 更新用户
export const updateUser = (data) => request.put('/users', data)
// 启用/禁用用户
export const updateUserStatus = (status, data) => request.post(`/users/status/${status}`, data)
