<route lang="yaml">
meta:
  title: 车辆管理
  pageId: carManage
  order: 5
  categoryList:
    - 生产中心
</route>

<template lang="pug">
.page
  el-card
    el-form(inline)
      el-form-item(label="车牌号")
        el-input(v-model="filter.plateNumber")
      el-form-item
        el-button(type="primary", @click="handleSearch") 查询
  el-card
    template(#header)
      el-button(type="success", @click="handleAdd") 添加
    el-table(:data="list")
      el-table-column(label="车牌号", prop="plateNumber")
      el-table-column(label="类型", prop="type")
      el-table-column(label="使用状态", prop="status")
      el-table-column(label="名称", prop="name")
      el-table-column(label="型号", prop="model")
      el-table-column(label="当前司机", prop="currentDriver")
        template(#default="{ row }")
          yy-accountChip(:detail="row.currentDriver")
      el-table-column(label="所属部门", prop="station")
        template(#default="{ row }")
          span {{ row.station?.name || row.station }}
      el-table-column(label="所属门店", prop="store")
        template(#default="{ row }")
          span {{ row.store?.name || row.store }}
      el-table-column(label="登记日期", prop="registerDate")
        template(#default="{ row }")
          span {{ formatDate(row.registerDate) }}
      el-table-column(label="备注", prop="remark")
      el-table-column(label="创建时间")
        template(#default="{ row }")
          span {{ formatTime(row.createTime) }}
      el-table-column(label="更新时间")
        template(#default="{ row }")
          span {{ formatTime(row.updateTime) }}
      el-table-column(label="操作")
        template(#default="{ row }")
          el-button(type="primary", size="small", @click="handleEdit(row._id)") 编辑
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
import { useEditDialog, useListPage } from "@/provider/listPage"
import ComEdit from "./__com__/edit.vue"

const { fetch, message, router } = inject("global")
const { formatTime, formatDate } = inject("format")

const { list, pagination, filter, getList, handleSearch, handleReset } = useListPage({
  url: "/car",
  filter: {
    plateNumber: "",
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
