<route lang="yaml">
meta:
  title: 操作日志
  pageId: handleLog
  categoryList:
    - 报表中心
</route>

<template lang="pug">
.page
  el-card
    el-form(inline, @submit.prevent)
      el-form-item(label="账号")
        el-select(v-model="filter.account", style="width: 160px")
          el-option(label="全部", :value="undefined")
          el-option(v-for="i in accountList", :label="i.name", :value="i._id")
      el-form-item(label="")
        el-button(type="primary", @click="handleSearch") 查询
        el-button(type="warning", plain, @click="handleReset") 重置
  el-card
    template(#header)
      el-button(type="success", @click="handleAdd") 添加
    el-table(:data="list", row-class-name="tableRowWithAction")
      el-table-column(label="操作数据ID", prop="modelId")
      el-table-column(label="操作记录", prop="message")
      el-table-column(label="操作人")
        template(#default="{ row }")
          yy-accountChip(:detail="row.account")
      el-table-column(label="操作时间")
        template(#default="{ row }")
          span {{ formatTime(row.createTime) }}
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
import { useEditDialog, useListPage } from "@/provider/listPage"

const { fetch, router, message } = inject("global")
const { formatTime } = inject("format")

const { list, pagination, filter, getList, handleSearch, handleDelete, handleReset } = useListPage({
  url: "/handleLog/",
  filter: {
    account: "",
    handleType: "account"
  },
})

const accountList = ref([])
function getAccountList() {
  fetch.get("/account?size=10000").then((res) => {
    accountList.value = res.list
  })
}

onMounted(() => {
  getAccountList()
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
