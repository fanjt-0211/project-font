import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/',
    component: () => import('@/views/Layout.vue'),
    redirect: '/home',
    children: [
      { path: 'home', name: 'Home', component: () => import('@/views/Home.vue'), meta: { title: '首页' } },
      { path: 'user', name: 'User', component: () => import('@/views/user/UserList.vue'), meta: { title: '用户管理' } },
      { path: 'material', name: 'Material', component: () => import('@/views/material/MaterialList.vue'), meta: { title: '物资管理' } },
      { path: 'category', name: 'Category', component: () => import('@/views/category/CategoryList.vue'), meta: { title: '分类管理' } },
      { path: 'warehouse', name: 'Warehouse', component: () => import('@/views/warehouse/WarehouseList.vue'), meta: { title: '仓库管理' } },
      { path: 'inbound', name: 'Inbound', component: () => import('@/views/inbound/InboundList.vue'), meta: { title: '入库管理' } },
      { path: 'outbound', name: 'Outbound', component: () => import('@/views/outbound/OutboundList.vue'), meta: { title: '出库管理' } },
      { path: 'stock', name: 'Stock', component: () => import('@/views/stock/StockList.vue'), meta: { title: '库存管理' } }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫 — 未登录跳转到登录页
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/home')
  } else {
    next()
  }
})

export default router
