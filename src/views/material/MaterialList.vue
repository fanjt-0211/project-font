<template>
  <el-card>
    <template #header>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span>物资列表</span>
        <div>
          <el-button type="warning" @click="showWarning">低库存预警</el-button>
          <el-button type="primary" @click="openDialog()">新增物资</el-button>
        </div>
      </div>
    </template>

    <el-form :inline="true" :model="query" @submit.prevent="fetchData">
      <el-form-item label="物资编号">
        <el-input v-model="query.code" placeholder="模糊搜索" clearable />
      </el-form-item>
      <el-form-item label="物资名称">
        <el-input v-model="query.name" placeholder="模糊搜索" clearable />
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="query.categoryId" placeholder="全部" clearable style="width:150px">
          <el-option v-for="c in categories" :key="c.id" :label="c.name" :value="c.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button @click="query = { pageNum: 1, pageSize: 10 }; fetchData()">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="records" stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="code" label="物资编号" />
      <el-table-column prop="name" label="物资名称" />
      <el-table-column prop="categoryName" label="分类" />
      <el-table-column prop="specification" label="规格" />
      <el-table-column prop="unit" label="单位" />
      <el-table-column prop="purchasePrice" label="采购价" />
      <el-table-column prop="sellPrice" label="销售价" />
      <el-table-column prop="minStock" label="最低库存" />
      <el-table-column label="操作" width="80">
        <template #default="{ row }">
          <el-button size="small" @click="openDialog(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="query.pageNum" v-model:page-size="query.pageSize"
      :total="total" :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next"
      @change="fetchData" style="margin-top:16px;justify-content:flex-end"
    />

    <!-- 弹窗 -->
    <el-dialog :title="isEdit ? '编辑物资' : '新增物资'" v-model="dialogVisible" width="560px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="90px">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="物资编号" prop="code">
              <el-input v-model="form.code" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物资名称" prop="name">
              <el-input v-model="form.name" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="分类" prop="categoryId">
              <el-select v-model="form.categoryId" style="width:100%">
                <el-option v-for="c in categories" :key="c.id" :label="c.name" :value="c.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规格">
              <el-input v-model="form.specification" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="单位">
              <el-input v-model="form.unit" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最低库存" prop="minStock">
              <el-input-number v-model="form.minStock" :min="0" style="width:100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="最高库存">
              <el-input-number v-model="form.maxStock" :min="0" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="描述">
              <el-input v-model="form.description" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="采购价">
          <el-input-number v-model="form.purchasePrice" :min="0" :precision="2" style="width:200px" />
        </el-form-item>
        <el-form-item label="销售价">
          <el-input-number v-model="form.sellPrice" :min="0" :precision="2" style="width:200px" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 预警弹窗 -->
    <el-dialog title="低库存预警" v-model="warningVisible" width="700px">
      <el-table :data="warnings" stripe empty-text="暂无预警物资">
        <el-table-column prop="code" label="编号" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="categoryName" label="分类" />
        <el-table-column prop="minStock" label="最低库存" />
      </el-table>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getMaterialList, addMaterial, updateMaterial, getMaterialWarning } from '@/api/material'
import { getCategoryList } from '@/api/category'

const records = ref([])
const total = ref(0)
const loading = ref(false)
const dialogVisible = ref(false)
const warningVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)
const categories = ref([])
const warnings = ref([])

const query = reactive({ pageNum: 1, pageSize: 10 })
const form = reactive({
  id: null, code: '', name: '', categoryId: null, specification: '', unit: '',
  purchasePrice: null, sellPrice: null, minStock: 0, maxStock: 0, description: ''
})

const rules = {
  code: [{ required: true, message: '请输入物资编号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入物资名称', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }]
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getMaterialList(query)
    records.value = res.data.records
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

const openDialog = (row) => {
  if (row) {
    isEdit.value = true
    Object.assign(form, row)
  } else {
    isEdit.value = false
    Object.assign(form, { id: null, code: '', name: '', categoryId: null, specification: '', unit: '', purchasePrice: null, sellPrice: null, minStock: 0, maxStock: 0, description: '' })
  }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  const payload = { ...form }
  if (isEdit.value) {
    await updateMaterial(form.id, payload)
    ElMessage.success('修改成功')
  } else {
    await addMaterial(payload)
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
  fetchData()
}

const showWarning = async () => {
  const res = await getMaterialWarning()
  warnings.value = res.data
  warningVisible.value = true
}

onMounted(async () => {
  fetchData()
  const res = await getCategoryList()
  categories.value = res.data
})
</script>
