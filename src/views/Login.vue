<template>
  <div class="login-page">
    <!-- 装饰圆 -->
    <div class="deco deco-1" />
    <div class="deco deco-2" />
    <div class="deco deco-3" />

    <!-- 登录卡片 -->
    <div class="login-card">
      <div class="card-left">
        <div class="brand-icon">
          <el-icon :size="44" color="#fff"><Box /></el-icon>
        </div>
        <h1>仓库物资管理</h1>
        <p>Warehouse Management System</p>
        <div class="divider" />
        <div class="features">
          <span>入库管理</span><span>库存监控</span>
          <span>出库管理</span><span>低库存预警</span>
        </div>
      </div>
      <div class="card-right">
        <h2>欢迎登录</h2>
        <p class="sub">请输入账号密码</p>
        <el-form :model="form" :rules="rules" ref="formRef" @submit.prevent="handleLogin">
          <el-form-item prop="username">
            <el-input
              v-model="form.username"
              placeholder="用户名"
              size="large"
              :prefix-icon="UserFilled"
              class="custom-input"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="密码"
              size="large"
              :prefix-icon="Lock"
              show-password
              class="custom-input"
              @keyup.enter="handleLogin"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              :loading="loading"
              class="login-btn"
              @click="handleLogin"
            >
              登 录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <p class="footer-text">仓库物资管理系统 &copy; 2026</p>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login } from '@/api/user'

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)

const form = reactive({ username: '', password: '' })

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  loading.value = true
  try {
    const res = await login({ username: form.username, password: form.password })
    localStorage.setItem('token', res.data)
    localStorage.setItem('username', form.username)
    ElMessage.success('登录成功')
    router.push('/home')
  } catch (e) {
    // 拦截器已提示
  } finally { loading.value = false }
}
</script>

<style scoped>
.login-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0c1929 0%, #13273f 30%, #1a365d 60%, #0f2035 100%);
  position: relative;
  overflow: hidden;
}

/* 装饰圆 */
.deco {
  position: absolute;
  border-radius: 50%;
  opacity: 0.06;
}
.deco-1 {
  width: 500px;
  height: 500px;
  background: #409eff;
  top: -150px;
  right: -120px;
}
.deco-2 {
  width: 300px;
  height: 300px;
  background: #67c23a;
  bottom: -80px;
  right: 350px;
}
.deco-3 {
  width: 400px;
  height: 400px;
  background: #e6a23c;
  bottom: -180px;
  left: -100px;
}

/* 卡片 */
.login-card {
  display: flex;
  width: 820px;
  height: 460px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 24px 80px rgba(0,0,0,0.4);
  z-index: 1;
}

/* 左侧 */
.card-left {
  width: 380px;
  background: linear-gradient(160deg, #1e3a5f 0%, #2d5a87 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 36px;
  position: relative;
}
.card-left::after {
  content: '';
  position: absolute;
  width: 200px;
  height: 200px;
  border: 2px solid rgba(255,255,255,0.06);
  border-radius: 50%;
  top: -60px;
  right: -60px;
}
.brand-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
}
.card-left h1 {
  color: #fff;
  font-size: 24px;
  margin: 0 0 8px 0;
  letter-spacing: 3px;
  font-weight: 600;
}
.card-left > p {
  color: rgba(255,255,255,0.45);
  font-size: 12px;
  letter-spacing: 2px;
  margin: 0;
  text-transform: uppercase;
}
.divider {
  width: 40px;
  height: 2px;
  background: rgba(255,255,255,0.2);
  margin: 28px 0;
  border-radius: 1px;
}
.features {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}
.features span {
  padding: 5px 14px;
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 20px;
  color: rgba(255,255,255,0.6);
  font-size: 12px;
}

/* 右侧 */
.card-right {
  flex: 1;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 52px;
}
.card-right h2 {
  font-size: 24px;
  color: #1d2129;
  margin: 0 0 6px 0;
  font-weight: 600;
}
.sub {
  color: #86909c;
  font-size: 14px;
  margin: 0 0 36px 0;
}
.custom-input :deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: none;
  background: #f2f3f5;
  transition: all 0.3s;
}
.custom-input :deep(.el-input__wrapper:hover) {
  background: #e5e6eb;
}
.custom-input :deep(.el-input__wrapper.is-focus) {
  background: #fff;
  box-shadow: 0 0 0 1px #409eff inset;
}
.login-btn {
  width: 100%;
  height: 46px;
  font-size: 16px;
  letter-spacing: 6px;
  border-radius: 8px;
  background: linear-gradient(135deg, #409eff, #337ecc);
  border: none;
}
.login-btn:hover {
  background: linear-gradient(135deg, #66b1ff, #409eff);
}

.footer-text {
  position: absolute;
  bottom: 24px;
  color: rgba(255,255,255,0.2);
  font-size: 12px;
  z-index: 1;
}
</style>
