<route lang="yaml">
meta:
  title: 充装电子秤
  pageId: scaleManage
  categoryList:
    - 生产中心/充装管理
</route>

<template lang="pug">
.page
  el-card
    el-form(inline)
      el-form-item(label="电子秤号")
        el-input(v-model="filter.code")
      el-form-item(label="所属部门")
        yy-stationSelect(v-model="filter.station")
      el-form-item
        el-button(type="primary", @click="handleSearch") 查询
  el-card
    template(#header)
      el-button(type="success", @click="handleAdd") 添加电子秤
    el-table(:data="list")
      el-table-column(label="ID", prop="_id")
      el-table-column(label="称号", prop="code")
      el-table-column(label="所属部门", prop="station")
      el-table-column(label="排序", prop="order")
      el-table-column(label="备注", prop="remark")
      el-table-column(label="创建时间", prop="createTime")
        template(#default="{ row }")
          span {{ formatTime(row.createTime) }}
      el-table-column(label="操作")
        template(#default="{ row }")
          el-button(type="primary", size="small", @click="handleEdit(row._id)") 编辑
          el-button(type="danger", size="small", @click="handleDelete(row._id)") 删除
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
const { formatTime } = inject("format")

const { list, pagination, filter, getList, handleSearch, handleReset } = useListPage({
  url: "/bottle/scale",
  filter: {
    code: "",
    station: "",
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
