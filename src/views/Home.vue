<template>
  <div class="dashboard">
    <!-- 欢迎 -->
    <div class="welcome-card">
      <div>
        <h2>👋 欢迎回来，{{ username }}</h2>
        <p>仓库物资管理系统 · 概览</p>
      </div>
      <el-icon :size="64" color="rgba(255,255,255,0.3)"><Histogram /></el-icon>
    </div>

    <!-- 快捷入口 -->
    <el-row :gutter="16">
      <el-col :span="6" v-for="item in cards" :key="item.title">
        <div class="nav-card" @click="$router.push(item.path)">
          <div class="nav-icon" :style="{ background: item.bg }">
            <el-icon :size="28" color="#fff"><component :is="item.icon" /></el-icon>
          </div>
          <div class="nav-info">
            <span class="nav-title">{{ item.title }}</span>
            <span class="nav-sub">{{ item.sub }}</span>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 库存预警 -->
    <el-card shadow="never" class="warn-card">
      <template #header>
        <div class="card-header">
          <div class="card-title"><el-icon color="#f56c6c"><WarningFilled /></el-icon> 库存预警</div>
          <el-tag type="danger" size="small">{{ warnings.length }} 项预警</el-tag>
        </div>
      </template>
      <el-table :data="warnings" stripe size="small" empty-text="🎉 暂无预警，所有物资库存充足">
        <el-table-column prop="materialCode" label="物资编号" width="140" />
        <el-table-column prop="materialName" label="物资名称" />
        <el-table-column prop="specification" label="规格" width="120" />
        <el-table-column prop="warehouseName" label="所在仓库" />
        <el-table-column prop="quantity" label="当前库存" align="center" width="100">
          <template #default="{ row }">
            <span class="danger-text">{{ row.quantity }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="minStock" label="最低库存" align="center" width="100" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getStockWarning } from '@/api/stock'

const username = ref(localStorage.getItem('username') || '')

const cards = [
  { title: '用户管理', sub: '系统用户维护', path: '/user', icon: 'UserFilled', bg: 'linear-gradient(135deg, #667eea, #764ba2)' },
  { title: '物资管理', sub: '物资信息维护', path: '/material', icon: 'GoodsFilled', bg: 'linear-gradient(135deg, #11998e, #38ef7d)' },
  { title: '分类管理', sub: '分类信息维护', path: '/category', icon: 'Grid', bg: 'linear-gradient(135deg, #f093fb, #f5576c)' },
  { title: '仓库管理', sub: '仓库信息维护', path: '/warehouse', icon: 'OfficeBuilding', bg: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
  { title: '入库管理', sub: '物资入库记录', path: '/inbound', icon: 'Sell', bg: 'linear-gradient(135deg, #43e97b, #38f9d7)' },
  { title: '出库管理', sub: '物资出库记录', path: '/outbound', icon: 'ShoppingBag', bg: 'linear-gradient(135deg, #fa709a, #fee140)' },
  { title: '库存管理', sub: '库存查询监控', path: '/stock', icon: 'Histogram', bg: 'linear-gradient(135deg, #a18cd1, #fbc2eb)' },
]

const warnings = ref([])

onMounted(async () => {
  try {
    const res = await getStockWarning()
    warnings.value = res.data
  } catch (e) { /* ignore */ }
})
</script>

<style scoped>
.dashboard { max-width: 1400px; margin: 0 auto; }

.welcome-card {
  background: linear-gradient(135deg, #409eff, #337ecc);
  border-radius: 12px;
  padding: 28px 36px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
}
.welcome-card h2 { margin: 0 0 6px 0; font-size: 22px; }
.welcome-card p { margin: 0; opacity: 0.75; font-size: 14px; }

.nav-card {
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: all 0.25s;
}
.nav-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}
.nav-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.nav-info {
  display: flex;
  flex-direction: column;
}
.nav-title { font-size: 15px; font-weight: 600; color: #303133; }
.nav-sub { font-size: 12px; color: #909399; margin-top: 2px; }

.warn-card { margin-top: 8px; border-radius: 10px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.card-title { display: flex; align-items: center; gap: 6px; font-size: 15px; font-weight: 600; }
.danger-text { color: #f56c6c; font-weight: 700; }
</style>
