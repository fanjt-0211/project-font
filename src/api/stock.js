import request from './index'

// 库存分页列表
export const getStockList = (params) => request.get('/stock', { params })
// 库存详情
export const getStockById = (id) => request.get(`/stock/${id}`)
// 库存预警
export const getStockWarning = () => request.get('/stock/warning')
