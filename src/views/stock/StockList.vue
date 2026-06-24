<template>
  <el-card>
    <template #header>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span>库存列表</span>
        <el-button type="warning" @click="showWarning">库存预警</el-button>
      </div>
    </template>

    <el-form :inline="true" :model="query" @submit.prevent="fetchData">
      <el-form-item label="物资">
        <el-select v-model="query.materialId" placeholder="全部" clearable style="width:180px" filterable>
          <el-option v-for="m in materials" :key="m.id" :label="m.name" :value="m.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="仓库">
        <el-select v-model="query.warehouseId" placeholder="全部" clearable style="width:180px">
          <el-option v-for="w in warehouses" :key="w.id" :label="w.name" :value="w.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="records" stripe v-loading="loading">
      <el-table-column type="index" :index="indexMethod" label="序号" width="60" />
      <el-table-column prop="materialCode" label="物资编号" />
      <el-table-column prop="materialName" label="物资名称" />
      <el-table-column prop="specification" label="规格" />
      <el-table-column prop="unit" label="单位" />
      <el-table-column prop="warehouseName" label="仓库" />
      <el-table-column prop="quantity" label="当前库存">
        <template #default="{ row }">
          <span :style="{ color: row.quantity < row.minStock ? '#f56c6c' : '#67c23a', fontWeight: 'bold' }">
            {{ row.quantity }}
          </span>
          <el-tag v-if="row.quantity < row.minStock" type="danger" size="small" style="margin-left:8px">预警</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="minStock" label="最低库存" />
    </el-table>

    <el-pagination
      v-model:current-page="query.pageNum" v-model:page-size="query.pageSize"
      :total="total" :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next"
      @current-change="fetchData" @size-change="fetchData" style="margin-top:16px;justify-content:flex-end"
    />

    <!-- 预警弹窗 -->
    <el-dialog title="库存预警" v-model="warningVisible" width="800px">
      <el-table :data="warnings" stripe empty-text="暂无库存预警">
        <el-table-column prop="materialName" label="物资名称" />
        <el-table-column prop="materialCode" label="物资编号" />
        <el-table-column prop="specification" label="规格" />
        <el-table-column prop="warehouseName" label="仓库" />
        <el-table-column prop="quantity" label="当前库存">
          <template #default="{ row }">
            <span style="color:#f56c6c;font-weight:bold">{{ row.quantity }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="minStock" label="最低库存" />
      </el-table>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getStockList, getStockWarning } from '@/api/stock'
import { getMaterialList } from '@/api/material'
import { getWarehouseList } from '@/api/warehouse'

const records = ref([])
const total = ref(0)
const loading = ref(false)
const warningVisible = ref(false)
const warnings = ref([])
const materials = ref([])
const warehouses = ref([])

const query = reactive({ pageNum: 1, pageSize: 10 })

const resetQuery = () => {
  Object.keys(query).forEach(k => delete query[k])
  Object.assign(query, { pageNum: 1, pageSize: 10 })
  fetchData()
}
const indexMethod = (index) => {
  return (query.pageNum - 1) * query.pageSize + index + 1
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getStockList(query)
    records.value = res.data.records
    total.value = res.data.total
  } finally { loading.value = false }
}

const showWarning = async () => {
  const res = await getStockWarning()
  warnings.value = res.data
  warningVisible.value = true
}

onMounted(async () => {
  fetchData()
  const [mr, wr] = await Promise.all([
    getMaterialList({ pageNum: 1, pageSize: 999 }),
    getWarehouseList()
  ])
  materials.value = mr.data.records || []
  warehouses.value = wr.data || []
})
</script>
