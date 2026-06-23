<template>
  <el-card>
    <template #header>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span>仓库列表</span>
        <el-button type="primary" @click="openDialog()">新增仓库</el-button>
      </div>
    </template>

    <el-form :inline="true" :model="query" @submit.prevent="fetchData">
      <el-form-item label="仓库编号">
        <el-input v-model="query.code" placeholder="" clearable />
      </el-form-item>
      <el-form-item label="仓库名称">
        <el-input v-model="query.name" placeholder="" clearable />
      </el-form-item>
      <el-form-item label="位置">
        <el-input v-model="query.location" placeholder="" clearable />
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

    <el-table :data="list" stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="code" label="仓库编号" />
      <el-table-column prop="name" label="仓库名称" />
      <el-table-column prop="location" label="位置" />
      <el-table-column prop="capacity" label="容量" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="status" label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '启用' : '禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button size="small" @click="openDialog(row)">编辑</el-button>
          <el-button size="small" :type="row.status === 1 ? 'warning' : 'success'"
            @click="toggleStatus(row)">{{ row.status === 1 ? '禁用' : '启用' }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="isEdit ? '编辑仓库' : '新增仓库'" v-model="dialogVisible" width="500px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="仓库编号" prop="code">
          <el-input v-model="form.code" />
        </el-form-item>
        <el-form-item label="仓库名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="位置">
          <el-input v-model="form.location" />
        </el-form-item>
        <el-form-item label="容量">
          <el-input-number v-model="form.capacity" :min="0" style="width:100%" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" />
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
import { getWarehouseList, addWarehouse, updateWarehouse, updateWarehouseStatus } from '@/api/warehouse'

const list = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)

const query = reactive({})

const resetQuery = () => {
  Object.keys(query).forEach(k => delete query[k])
  fetchData()
}
const form = reactive({ id: null, code: '', name: '', location: '', capacity: 0, description: '' })

const rules = {
  code: [{ required: true, message: '请输入仓库编号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入仓库名称', trigger: 'blur' }]
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getWarehouseList(query)
    list.value = res.data
  } finally { loading.value = false }
}

const openDialog = (row) => {
  if (row) {
    isEdit.value = true
    Object.assign(form, row)
  } else {
    isEdit.value = false
    Object.assign(form, { id: null, code: '', name: '', location: '', capacity: 0, description: '' })
  }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  if (isEdit.value) {
    await updateWarehouse(form.id, { code: form.code, name: form.name, location: form.location, capacity: form.capacity, description: form.description })
    ElMessage.success('修改成功')
  } else {
    await addWarehouse({ code: form.code, name: form.name, location: form.location, capacity: form.capacity, description: form.description })
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
  fetchData()
}

const toggleStatus = async (row) => {
  const newStatus = row.status === 1 ? 0 : 1
  const action = newStatus === 1 ? '启用' : '禁用'
  try {
    await ElMessageBox.confirm(`确定${action}该仓库？`, '提示', { type: 'warning' })
    await updateWarehouseStatus(newStatus, { id: row.id })
    ElMessage.success(`${action}成功`)
    fetchData()
  } catch (e) { /* cancelled */ }
}

onMounted(fetchData)
</script>
