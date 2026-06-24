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

    <el-table :data="pagedRecords" :row-class-name="tableRowClassName" v-loading="loading" style="width:100%">
      <el-table-column type="index" :index="indexMethod" label="序号" width="60" align="center" />
      <el-table-column label="分类名称">
        <template #default="{ row }">
          <span v-if="row._isParent" class="parent-name">{{ row.name }}</span>
          <span v-else-if="row._isOrphan" class="orphan-name">{{ row.name }}</span>
          <span v-else class="child-name">
            <span class="tree-prefix">├─</span>{{ row.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" show-overflow-tooltip />
      <el-table-column label="归属" align="center" width="100">
        <template #default="{ row }">
          <span v-if="!row._isParent && row.parentName">
            {{ row.parentName }}
            <el-tag v-if="row._isOrphan" size="small" type="info" style="margin-left:4px">?</el-tag>
          </span>
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
      v-model:current-page="currentPage" v-model:page-size="pageSize"
      :total="groupedRecords.length" :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next"
      @current-change="handlePageChange" @size-change="handlePageChange"
      style="margin-top:16px;justify-content:flex-end"
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
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCategoryList, addCategory, updateCategory, updateCategoryStatus } from '@/api/category'

const rawRecords = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)
const allCategories = ref([])
const currentPage = ref(1)
const pageSize = ref(10)

const query = reactive({ pageNum: 1, pageSize: 999 })

const resetQuery = () => {
  Object.keys(query).forEach(k => delete query[k])
  Object.assign(query, { pageNum: 1, pageSize: 999 })
  currentPage.value = 1
  fetchData()
}

const groupedRecords = computed(() => {
  const list = rawRecords.value
  if (!list || list.length === 0) return []
  // A category is top-level when parentId is null, undefined, 0, or empty string
  const isTopLevel = (item) => {
    const pid = item.parentId
    return pid == null || pid === 0 || pid === ''
  }
  // Separate top-level categories and build children map
  const childrenMap = {}
  const parents = []
  list.forEach(item => {
    if (isTopLevel(item)) {
      parents.push(item)
    } else {
      if (!childrenMap[item.parentId]) childrenMap[item.parentId] = []
      childrenMap[item.parentId].push(item)
    }
  })
  // Sort parents by sortOrder
  parents.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
  // Build result: each parent followed by its sorted children
  const result = []
  const parentIds = new Set(parents.map(p => p.id))
  parents.forEach(parent => {
    result.push({ ...parent, _isParent: true })
    const children = childrenMap[parent.id] || []
    children.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    children.forEach(child => result.push({ ...child, _isParent: false }))
  })
  // Handle orphans: children whose parent is not in the dataset (e.g., parent filtered out by search)
  const orphans = []
  list.forEach(item => {
    if (!isTopLevel(item) && !parentIds.has(item.parentId)) {
      orphans.push(item)
    }
  })
  if (orphans.length > 0) {
    orphans.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    orphans.forEach(child => result.push({ ...child, _isParent: false, _isOrphan: true }))
  }
  return result
})

// Frontend pagination: slice the grouped records
const pagedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return groupedRecords.value.slice(start, start + pageSize.value)
})

const indexMethod = (index) => {
  return (currentPage.value - 1) * pageSize.value + index + 1
}

const handlePageChange = () => {
  // currentPage / pageSize are already updated by v-model
}

const tableRowClassName = ({ row }) => {
  if (row._isParent) return 'parent-row'
  if (row._isOrphan) return 'orphan-row'
  return 'child-row'
}
const form = reactive({ id: null, name: '', description: '', parentId: null, sortOrder: 0 })

const rules = { name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }] }

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getCategoryList(query)
    rawRecords.value = res.data.records
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
    delete form._isParent
    delete form._isOrphan
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

<style scoped>
:deep(.parent-row) {
  background-color: #f5f7fa;
}
:deep(.parent-row) td {
  border-top: 2px solid #e4e7ed !important;
}
:deep(.parent-row:first-child) td {
  border-top: none !important;
}
:deep(.orphan-row) {
  background-color: #fdf6ec;
}
.parent-name {
  font-weight: 600;
}
.orphan-name {
  padding-left: 8px;
  color: #909399;
}
.child-name {
  padding-left: 8px;
}
.tree-prefix {
  color: #c0c4cc;
  margin-right: 6px;
  font-family: monospace;
}
</style>
