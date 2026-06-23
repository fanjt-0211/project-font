<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6" v-for="card in cards" :key="card.title">
        <el-card shadow="hover" @click="$router.push(card.path)" style="cursor:pointer;margin-bottom:16px">
          <div style="display:flex;align-items:center">
            <el-icon :size="40" :color="card.color"><component :is="card.icon" /></el-icon>
            <div style="margin-left:16px">
              <div style="font-size:14px;color:#909399">{{ card.title }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 库存预警 -->
    <el-card style="margin-top:20px">
      <template #header>库存预警</template>
      <el-table :data="warnings" stripe size="small" empty-text="暂无预警">
        <el-table-column prop="materialName" label="物资名称" />
        <el-table-column prop="quantity" label="当前库存" />
        <el-table-column prop="minStock" label="最低库存" />
        <el-table-column prop="warehouseName" label="所在仓库" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getStockWarning } from '@/api/stock'

const cards = [
  { title: '用户管理', path: '/user', icon: 'User', color: '#409eff' },
  { title: '物资管理', path: '/material', icon: 'Goods', color: '#67c23a' },
  { title: '分类管理', path: '/category', icon: 'Menu', color: '#e6a23c' },
  { title: '仓库管理', path: '/warehouse', icon: 'OfficeBuilding', color: '#f56c6c' },
  { title: '入库管理', path: '/inbound', icon: 'Download', color: '#909399' },
  { title: '出库管理', path: '/outbound', icon: 'Upload', color: '#b37feb' },
  { title: '库存管理', path: '/stock', icon: 'Box', color: '#f5222d' },
]

const warnings = ref([])

onMounted(async () => {
  try {
    const res = await getStockWarning()
    warnings.value = res.data
  } catch (e) { /* ignore */ }
})
</script>
