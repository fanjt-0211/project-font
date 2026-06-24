<template>
  <el-card>
    <template #header>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span>分类列表</span>
        <el-button type="success" @click="openDialog()">新增分类</el-button>
      </div>
    </template>

    <el-form :inline="true" :model="query" @submit.prevent="fetchData">
      <el-form-item label="分类名称">
        <el-input v-model="query.name" placeholder="" clearable />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="query.status" placeholder="全部" clearable style="width:100px">
          <el-option label="启用" :value="1" />
          <el-option label="禁用" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="records" stripe v-loading="loading" style="width:100%">
      <el-table-column type="index" :index="indexMethod" label="序号" width="60" align="center" />
      <el-table-column prop="name" label="分类名称" />
      <el-table-column prop="description" label="描述" show-overflow-tooltip />
      <el-table-column prop="parentName" label="归属" align="center">
        <template #default="{ row }">
          <span v-if="row.parentName">{{ row.parentName }}</span>
          <span v-else style="color:#c0c4cc">—</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '启用' : '禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button size="small" @click="openDialog(row)">编辑</el-button>
          <el-button size="small" :type="row.status === 1 ? 'danger' : 'success'"
            @click="toggleStatus(row)">{{ row.status === 1 ? '禁用' : '启用' }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="query.pageNum" v-model:page-size="query.pageSize"
      :total="total" :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next"
      @current-change="fetchData" @size-change="fetchData" style="margin-top:16px;justify-content:flex-end"
    />

    <el-dialog :title="isEdit ? '编辑分类' : '新增分类'" v-model="dialogVisible" width="500px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" />
        </el-form-item>
        <el-form-item label="父分类">
          <el-select v-model="form.parentId" placeholder="无" clearable style="width:100%">
            <el-option v-for="c in allCategories" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序号">
          <el-input-number v-model="form.sortOrder" :min="0" />
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCategoryList, addCategory, updateCategory, updateCategoryStatus } from '@/api/category'

const records = ref([])
const total = ref(0)
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)
const allCategories = ref([])

const query = reactive({ pageNum: 1, pageSize: 10 })

const resetQuery = () => {
  Object.keys(query).forEach(k => delete query[k])
  Object.assign(query, { pageNum: 1, pageSize: 10 })
  fetchData()
}
const indexMethod = (index) => {
  return (query.pageNum - 1) * query.pageSize + index + 1
}
const form = reactive({ id: null, name: '', description: '', parentId: null, sortOrder: 0 })

const rules = { name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }] }

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getCategoryList(query)
    records.value = res.data.records
    total.value = res.data.total
  } finally { loading.value = false }
}

const fetchAllCategories = async () => {
  const res = await getCategoryList({ pageNum: 1, pageSize: 999 })
  allCategories.value = res.data.records
}

const openDialog = (row) => {
  if (row) {
    isEdit.value = true
    Object.assign(form, row)
  } else {
    isEdit.value = false
    Object.assign(form, { id: null, name: '', description: '', parentId: null, sortOrder: 0 })
  }
  fetchAllCategories()
  dialogVisible.value = true
}

const handleSubmit = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  try {
    if (isEdit.value) {
      await updateCategory({ ...form })
      ElMessage.success('修改成功')
    } else {
      await addCategory({ name: form.name, description: form.description, parentId: form.parentId, sortOrder: form.sortOrder })
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    fetchData()
  } catch (e) { /* 错误已在拦截器中提示 */ }
}

const toggleStatus = async (row) => {
  const newStatus = row.status === 1 ? 0 : 1
  const action = newStatus === 1 ? '启用' : '禁用'
  try {
    await ElMessageBox.confirm(`确定${action}该分类？`, '提示', { type: 'warning' })
    await updateCategoryStatus(newStatus, { id: row.id })
    ElMessage.success(`${action}成功`)
    fetchData()
  } catch (e) { /* cancelled */ }
}

onMounted(fetchData)
</script>
