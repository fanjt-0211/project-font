<template>
  <router-view />
</template>

<style>
/* 全局样式 */
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

/* === 表格 === */
.el-table {
  border-radius: 6px;
  overflow: hidden;
  font-size: 13px;
}
.el-table th.el-table__cell {
  background: #f8f9fb;
  color: #515a6e;
  font-weight: 600;
  font-size: 13px;
  height: 44px;
  border-bottom: 1px solid #e8eaec;
}
.el-table td.el-table__cell {
  height: 42px;
  border-bottom: 1px solid #f0f1f3;
}
.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell {
  background: #fafbfc;
}
.el-table__body tr:hover > td.el-table__cell {
  background: #f0f5ff;
}

/* === 卡片 === */
.el-card {
  border-radius: 8px;
  border: 1px solid #e8eaec;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.el-card__header {
  border-bottom: 1px solid #f0f1f3;
  padding: 14px 20px;
  font-weight: 600;
  color: #1d2129;
}

/* === 分页 === */
.el-pagination {
  margin-top: 16px;
  justify-content: flex-end;
}

/* === 搜素表单内联间距 === */
.el-form--inline .el-form-item {
  margin-right: 12px;
}

/* === 弹窗 === */
.el-dialog {
  border-radius: 10px;
}
.el-dialog__header {
  border-bottom: 1px solid #f0f1f3;
  padding: 16px 24px;
  margin-right: 0;
}
.el-dialog__body {
  padding: 24px;
}

/* === 按钮 === */
.el-button--primary {
  box-shadow: 0 2px 6px rgba(64,158,255,0.3);
}
.el-button--primary:hover {
  box-shadow: 0 4px 12px rgba(64,158,255,0.45);
}

/* === 标签 === */
.el-tag {
  border-radius: 4px;
}
</style>
