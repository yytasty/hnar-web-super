<route lang="yaml">
meta:
  title: 客户开户申请
  pageId: customerRegisterList
  order: 11
  categoryList:
    - 客服中心/客户管理
</route>

<template lang="pug">
.page
  el-card
    el-form(inline, label-width="6em")
      el-form-item(label="姓名")
        el-input(v-model="filter.name", placeholder="请输入姓名")
      el-form-item(label="客户电话")
        el-input(v-model="filter.phone", placeholder="请输入客户电话")
      el-form-item(label="创建时间")
        yy-dateRange(v-model="filter.createTimeRange", @change="handleSearch")
      el-form-item
        el-button(type="primary", @click="handleSearch") 查询
        el-button(type="warning", plain, @click="handleReset") 重置
  el-card
    el-table(:data="list", ref="tableRef", stripe, row-class-name="tableRowWithAction")
      el-table-column(label="姓名", prop="name", fixed="left")
      el-table-column(label="客户电话", prop="phone")
      el-table-column(label="身份证")
        template(#default="{ row }")
          yy-imageList(:modelValue="row.imageList|| []")

      el-table-column(label="用气地址", prop="address")
      el-table-column(label="用气瓶数", prop="useBottleNum")
      el-table-column(label="钢瓶规格", prop="bottleSpecific.name")
      el-table-column(label="钢瓶押金", prop="guarantyPrice")
      el-table-column(label="所属配送员", prop="courier.name")
      el-table-column(label="备注", prop="remark")
      el-table-column(label="状态", prop="status")
      el-table-column(label="创建时间")
        template(#default="{ row }")
          span {{ formatTime(row.createTime) }}
      el-table-column(label="操作", width="160px", fixed="right")
        template(#default="{ row }")
          el-button(v-if="row.status=='待处理'" type="primary", plain, size="small", @click="handleEdit(row._id)") 审核
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
  ComEdit(v-model:isShow="isShowEdit", :currentId="currentEditId", @success="handleReset")
</template>

<script setup>
import { customerNatureList, customerSourceList, customerTypeList, ensureCacheData } from "@/provider/cache"
import { customerPayTypeList, customerRiskGradeList } from "@/provider/dict"
import { useEditDialog, useListPage } from "@/provider/listPage"
import { datePickShortcutBefore } from "@/util/time"

import ComEdit from "./__com__/edit.vue"

const { fetch, message, router } = inject("global")
const { formatTime } = inject("format")

const { list, pagination, filter, getList, handleSearch, handleReset, handleDelete } = useListPage({
  url: "/customerRegister",
  filter: {
    name: "",
    phone: "",
    createTimeRange: [],
  },
})
const { isShowEdit, currentEditId, handleAdd, handleEdit } = useEditDialog()

const tableRef = ref(null)

onMounted(async () => {
  handleReset()
})
</script>

<style lang="less" scoped>
.page {
  width: 100%;
}
.label {
  width: 100px;
  margin-right: 10px;
}
.value {
  width: 200px !important;
}

.el-table {
  height: calc(100vh - 300px);
}

.extendAction {
  margin-top: 5px;
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding-right: 15px;
}
</style>
