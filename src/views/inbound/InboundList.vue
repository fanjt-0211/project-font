<template>
  <el-card>
    <template #header>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span>入库记录</span>
        <el-button type="success" @click="openDialog()">入库</el-button>
      </div>
    </template>

    <el-form :inline="true" :model="query" @submit.prevent="fetchData">
      <el-form-item label="入库单号">
        <el-input v-model="query.inboundNo" placeholder="" clearable />
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="query.type" placeholder="全部" clearable style="width:120px">
          <el-option label="采购入库" :value="1" />
          <el-option label="退货入库" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="物资">
        <el-select v-model="query.materialId" placeholder="全部" clearable style="width:150px" filterable>
          <el-option v-for="m in materials" :key="m.id" :label="m.name" :value="m.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="仓库">
        <el-select v-model="query.warehouseId" placeholder="全部" clearable style="width:150px">
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
      <el-table-column prop="inboundNo" label="入库单号" width="160" />
      <el-table-column prop="typeName" label="类型" />
      <el-table-column prop="materialName" label="物资" />
      <el-table-column prop="warehouseName" label="仓库" />
      <el-table-column prop="quantity" label="数量" />
      <el-table-column prop="unitPrice" label="单价" />
      <el-table-column prop="totalAmount" label="总金额" />
      <el-table-column prop="supplier" label="供应商" />
      <el-table-column prop="operatorName" label="操作员" />
    </el-table>

    <el-pagination
      v-model:current-page="query.pageNum" v-model:page-size="query.pageSize"
      :total="total" :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next"
      @current-change="fetchData" @size-change="fetchData" style="margin-top:16px;justify-content:flex-end"
    />

    <!-- 新增入库弹窗 -->
    <el-dialog title="入库" v-model="dialogVisible" width="500px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="入库类型" prop="type">
          <el-select v-model="form.type" style="width:100%">
            <el-option label="采购入库" :value="1" />
            <el-option label="退货入库" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="物资" prop="materialId">
          <el-select v-model="form.materialId" style="width:100%" filterable>
            <el-option v-for="m in materials" :key="m.id" :label="`${m.name}(${m.code})`" :value="m.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="仓库" prop="warehouseId">
          <el-select v-model="form.warehouseId" style="width:100%">
            <el-option v-for="w in warehouses" :key="w.id" :label="w.name" :value="w.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input-number v-model="form.quantity" :min="1" style="width:100%" />
        </el-form-item>
        <el-form-item label="单价">
          <el-input-number v-model="form.unitPrice" :min="0" :precision="2" style="width:100%" />
          <span style="color:#909399;font-size:12px">留空则取物资采购价</span>
        </el-form-item>
        <el-form-item label="供应商">
          <el-input v-model="form.supplier" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getInboundList, addInbound } from '@/api/inbound'
import { getMaterialList } from '@/api/material'
import { getWarehouseList } from '@/api/warehouse'

const records = ref([])
const total = ref(0)
const loading = ref(false)
const dialogVisible = ref(false)
const formRef = ref(null)
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
const form = reactive({ type: 1, materialId: null, warehouseId: null, quantity: 1, unitPrice: null, supplier: '', remark: '' })

const rules = {
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  materialId: [{ required: true, message: '请选择物资', trigger: 'change' }],
  warehouseId: [{ required: true, message: '请选择仓库', trigger: 'change' }],
  quantity: [{ required: true, message: '请输入数量', trigger: 'blur' }]
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getInboundList(query)
    records.value = res.data.records
    total.value = res.data.total
  } finally { loading.value = false }
}

const openDialog = () => {
  Object.assign(form, { type: 1, materialId: null, warehouseId: null, quantity: 1, unitPrice: null, supplier: '', remark: '' })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  try {
    await addInbound({ ...form })
    ElMessage.success('入库成功')
    dialogVisible.value = false
    fetchData()
  } catch (e) { /* 错误已在拦截器中提示 */ }
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
