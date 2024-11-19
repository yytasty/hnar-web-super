<route lang="yaml">
meta:
  title: 钢瓶流失
  pageId: bottleMissing
  categoryList:
    - 安全监管/风险管控
</route>

<template lang="pug">
.page
  el-card
    el-form(inline)
      el-form-item(label="气瓶条码")
        el-input(v-model="filter.sn")
      el-form-item(label="最后时间")
        yy-dateRange(v-model="filter.createTimeRange", @change="handleSearch")
      el-form-item
        el-button(type="primary", @click="handleSearch") 搜索
        el-button(type="default", @click="handleReset") 重置
  el-card
    template(#header)
      el-button(type="success", @click="handleAdd") 添加
    el-table(:data="list")
      el-table-column(label="ID", prop="_id")
      el-table-column(label="气瓶条码", prop="sn")
      el-table-column(label="操作类型", prop="type")
      el-table-column(label="上次位置", prop="lastPosition")
      el-table-column(label="最后时间")
        template(#default="{ row }")
          span {{ formatTime(row.lastTime) }}
      el-table-column(label="操作人")
        template(#default="{ row }")
          span {{ row.handleStaff?.name || row.handleStaff }}
      el-table-column(label="操作")
        template(#default="{ row }")
    el-pagination(
      style="margin-top: 20px; justify-content: center",
      background,
      size="small",
      v-model:current-page="pagination.page",
      v-model:page-size="pagination.size",
      :total="pagination.total",
      layout="total,sizes,prev, pager, next",
      @change="getList"
    )
</template>

<script setup>
import { useListPage } from "@/provider/listPage"
const { fetch, message, router } = inject("global")
const { formatTime } = inject("format")

const { list, pagination, filter, getList, handleSearch, handleReset, handleDelete, onSortChange } = useListPage({
  url: "/bottle/auditCompany",
  filter: {
    name: "",
    createTimeRange: [],
  },
})

onMounted(() => {
  handleReset()
})
</script>

<style lang="less" scoped>
.page {
  width: 100%;
}
</style>
