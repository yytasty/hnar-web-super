<route lang="yaml">
meta:
  title: 客户退单
  pageId: customerRefund
  order: 21
  categoryList:
    - 客服中心/售后管理
</route>

<template lang="pug">
.page
  el-card
    el-form(inline)
      el-form-item(label="客户")
        yy-customerSelect(v-model="filter.customer", @change="handleSearch")
      el-form-item(label="气站")
        yy-stationSelect(v-model="filter.station", @change="handleSearch")
      el-form-item(label="配送员")
        yy-staffSelect(v-model="filter.courier", @change="handleSearch")
      el-form-item(label="钢瓶编号")
        el-input(v-model="filter.bottleCode", placeholder="请输入钢瓶编号", clearable, @change="handleSearch")
      el-form-item(label="状态")
        el-select(v-model="filter.status", clearable, @change="handleSearch")
          el-option(label="全部", value="")
          el-option(v-for="i in repairStatusList", :label="i", :value="i")
      el-form-item(label="来源")
        el-select(
          v-model="filter.source",
          clearable,
          @change="handleSearch",
          @clear="handleSearch",
          style="width: 200px"
        )
          el-option(label="全部", value="")
          el-option(label="坐席", value="坐席")
          el-option(label="客户", value="客户")
          el-option(label="其他", value="其他")
      el-form-item(label="创建日期")
        yy-dateRange(v-model="filter.createTimeRange", @change="handleSearch")
      el-form-item
        el-button(type="primary", @click="handleSearch") 查询
  el-card
    el-table(:data="list")
      el-table-column(label="ID", prop="_id")
      el-table-column(label="客户", prop="customer")
        template(#default="{ row }")
          yy-customerChip(:detail="row.customer")
      el-table-column(label="关联订单", prop="fromOrder")
      el-table-column(label="配送员", prop="courier")
        template(#default="{ row }")
          yy-accountChip(:detail="row.courier")
      el-table-column(label="状态", prop="status")
      el-table-column(label="创建时间")
        template(#default="{ row }")
          span {{ formatTime(row.createTime) }}
      el-table-column(label="操作")
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
import { repairStatusList } from "@/provider/dict"
import { useEditDialog, useListPage } from "@/provider/listPage"

const { fetch, message, router } = inject("global")
const { formatTime } = inject("format")

const { list, pagination, filter, getList, handleSearch, handleReset } = useListPage({
  url: "/refund",
  filter: {
    customer: "",
    station: "",
    courier: "",
    bottleCode: "",
    status: "",
    source: "",
    createTimeRange: [],
  },
})

const { isShowEdit, currentEditId, handleAdd, handleEdit } = useEditDialog()

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
