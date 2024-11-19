<route lang="yaml">
meta:
  title: 钢瓶规格管理
  pageId: bottleSpecificManage
  categoryList:
    - 生产中心/钢瓶管理
</route>

<template lang="pug">
.page
  el-card
    template(#header)
      el-button(type="success", @click="handleAdd") 添加钢瓶规格
    el-table(:data="list")
      el-table-column(label="名称", prop="name", fixed="left")
      el-table-column(label="规格", prop="bottleType", fixed="left")
      el-table-column(label="检验周期(年)", prop="auditCycle")
      el-table-column(label="使用年限(年)", prop="yearLimit")
      el-table-column(label="空瓶重(KG)", prop="emptyWeight")
      el-table-column(label="排序", prop="order", sortable="custom")
      el-table-column(label="创建人", prop="author", sortable="custom")
        template(#default="{ row }")
          yy-accountChip(:detail="row.author")
      el-table-column(label="创建时间", prop="createTime", sortable="custom")
        template(#default="{ row }")
          span {{ formatTime(row.createTime) }}
      el-table-column(label="操作", width="220px", fixed="right")
        template(#default="{ row }")
          el-button(type="primary", plain, size="small", @click="handleView(row._id)") 详情
          el-button(type="warning", plain, size="small", @click="handleEdit(row._id)") 编辑
          el-button(type="danger", plain, size="small", @click="handleDelete(row._id)") 删除
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
  ComEdit(v-model:isShow="isShowEdit", :currentId="currentEditId", :isViewMode="isViewMode", @success="handleReset")
</template>

<script setup>
import { useEditDialog, useListPage } from "@/provider/listPage"
import ComEdit from "./__com__/edit.vue"
const { fetch, message, router } = inject("global")
const { formatTime } = inject("format")

const { list, pagination, filter, getList, handleSearch, handleReset, handleDelete } = useListPage({
  url: "/bottle/specific",
  filter: {
    sn: "",
  },
})

const { isShowEdit, currentEditId, isViewMode, handleAdd, handleEdit, handleView } = useEditDialog()

onMounted(() => {
  handleReset()
})
</script>

<style lang="less" scoped>
.el-table {
  height: calc(100vh - 300px);
}
</style>
