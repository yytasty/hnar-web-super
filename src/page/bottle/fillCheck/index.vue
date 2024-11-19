<route lang="yaml">
meta:
  title: 钢瓶充装后检查
  pageId: bottleFillCheck
  categoryList:
    - 生产中心/充装管理
</route>

<template lang="pug">
.page
  el-card
    el-form(inline)
      el-form-item(label="条码")
        el-input(v-model="filter.sn")
      el-form-item
        el-button(type="primary", @click="handleSearch") 查询
  el-card
    el-table(:data="list")
      el-table-column(label="ID", prop="_id")
      el-table-column(label="条码", prop="sn")
      el-table-column(label="使用气站", prop="station")
      el-table-column(label="电子标签", prop="rfid")
      el-table-column(label="钢瓶规格", prop="bottleSpecific")
      el-table-column(label="钢瓶厂家", prop="bottleFactory")
      el-table-column(label="创建时间", prop="createTime")
      el-table-column(label="更新时间", prop="updateTime")
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

const { list, pagination, filter, getList, handleSearch, handleReset } = useListPage({
  url: "/bottle/fillCheck",
  filter: {
    sn: "",
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
.el-table {
  height: calc(100vh - 300px);
}
</style>
