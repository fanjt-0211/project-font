<template>
  <el-container style="height:100vh">
    <!-- 侧边栏 -->
    <el-aside :width="collapsed ? '64px' : '220px'" class="sidebar">
      <div class="logo-box">
        <el-icon :size="28" color="#fff"><Box /></el-icon>
        <span v-show="!collapsed" class="logo-text">仓库管理系统</span>
      </div>
      <el-menu
        :default-active="$route.path"
        router
        :collapse="collapsed"
        background-color="transparent"
        text-color="rgba(255,255,255,0.7)"
        active-text-color="#fff"
        class="side-menu"
      >
        <el-menu-item index="/home">
          <el-icon><DataAnalysis /></el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/user">
          <el-icon><UserFilled /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/material">
          <el-icon><GoodsFilled /></el-icon>
          <span>物资管理</span>
        </el-menu-item>
        <el-menu-item index="/category">
          <el-icon><Grid /></el-icon>
          <span>分类管理</span>
        </el-menu-item>
        <el-menu-item index="/warehouse">
          <el-icon><OfficeBuilding /></el-icon>
          <span>仓库管理</span>
        </el-menu-item>
        <el-menu-item index="/inbound">
          <el-icon><Sell /></el-icon>
          <span>入库管理</span>
        </el-menu-item>
        <el-menu-item index="/outbound">
          <el-icon><ShoppingBag /></el-icon>
          <span>出库管理</span>
        </el-menu-item>
        <el-menu-item index="/stock">
          <el-icon><Histogram /></el-icon>
          <span>库存管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 右侧内容 -->
    <el-container class="main-container">
      <el-header class="top-header">
        <div class="header-left">
          <el-icon :size="22" class="collapse-btn" @click="collapsed = !collapsed">
            <Fold v-if="!collapsed" /><Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="$route.meta.title">{{ $route.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-avatar :size="32" icon="UserFilled" />
          <span class="username">{{ username }}</span>
          <el-button type="danger" size="small" plain @click="logout">退出登录</el-button>
        </div>
      </el-header>
      <el-main class="content-area">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const collapsed = ref(false)
const username = ref(localStorage.getItem('username') || '')
const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  router.push('/login')
}
</script>

<style scoped>
.sidebar {
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  transition: width 0.3s;
  overflow: hidden;
}
.logo-box {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.logo-text {
  color: #fff;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 1px;
  white-space: nowrap;
}
.side-menu {
  border-right: none;
  margin-top: 8px;
}
.side-menu .el-menu-item {
  margin: 4px 8px;
  border-radius: 8px;
  transition: all 0.2s;
}
.side-menu .el-menu-item:hover {
  background: rgba(255,255,255,0.08) !important;
}
.side-menu .el-menu-item.is-active {
  background: linear-gradient(90deg, #409eff, #337ecc) !important;
  box-shadow: 0 4px 12px rgba(64,158,255,0.4);
}
.main-container { background: #f5f7fa; }
.top-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  padding: 0 24px;
  height: 56px;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.collapse-btn { cursor: pointer; color: #606266; }
.collapse-btn:hover { color: #409eff; }
.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.username { font-size: 14px; color: #606266; }
.content-area {
  padding: 20px;
  min-height: calc(100vh - 56px);
}
</style>
