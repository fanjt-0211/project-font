import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

const request = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000
})

// 需要重新登录的错误消息（后端 LoginCheckInterceptor 返回）
const AUTH_ERROR_MESSAGES = ['token已过期', '请先登录', 'token无效']

// 清除登录状态并跳转登录页
const redirectToLogin = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  ElMessage.warning('登录已过期，请重新登录')
  router.push('/login')
}

// 请求拦截器 — 携带 token
request.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.token = token
  }
  return config
})

// 响应拦截器 — 统一错误处理
request.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) {
      // 认证相关错误：清除 token 并跳转登录页，不弹出红色错误提示
      if (AUTH_ERROR_MESSAGES.some(msg => res.message && res.message.includes(msg))) {
        redirectToLogin()
        return Promise.resolve({ data: null })
      }
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message))
    }
    return res
  },
  error => {
    if (error.response && error.response.status === 403) {
      ElMessage.error('无权限操作')
    } else {
      ElMessage.error('网络错误')
    }
    return Promise.reject(error)
  }
)

export default request
