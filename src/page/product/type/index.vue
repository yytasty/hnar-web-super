<route lang="yaml">
meta:
  title: 商品类型
  pageId: productType
  order: 2
  categoryList:
    - 销售管理/商品管理
</route>

<template lang="pug">
.page
  el-card
    el-form(inline)
      el-form-item(label="类型名称")
        el-input(v-model="filter.name", placeholder="请输入商品类型名称")
      el-form-item
        el-button(type="info", @click="handleReset") 重置
        el-button(type="primary", @click="handleSearch") 查询
  el-card
    template(#header)
      el-button(type="success", @click="handleAdd") 添加
      //- el-button(type="danger", @click="handleAdd") 批量删除
    el-table(:data="list")
      //- el-table-column(type='selection')
      el-table-column(label="商品类型编号", prop="code")
      el-table-column(label="商品类型名称", prop="name")
      el-table-column(label="净重", prop="hasNetWeight")
        template(#default="{ row }")
          span {{ row.hasNetWeight ? "是" : "" }}
      el-table-column(label="操作人")
        template(#default="{ row }")
          yy-accountChip(:detail="row.author")
      el-table-column(label="操作时间")
        template(#default="{ row }")
          span {{ formatTime(row.updateTime) }}
      el-table-column(label="备注", prop="remark")
      el-table-column(label="操作")
        template(#default="{ row }")
          el-button(type="primary", size="small", @click="handleEdit(row._id)") 修改
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
import { ElMessageBox } from "element-plus"
import ComEdit from "./__com__/edit.vue"
const { fetch, message, router } = inject("global")
const { formatTime } = inject("format")

const { list, pagination, filter, getList, handleSearch, handleReset } = useListPage({
  url: "/productType",
  filter: {
    name: "",
  },
})

const { isShowEdit, currentEditId, handleAdd, handleEdit } = useEditDialog()

// 删除
const handleDelete = async (id) => {
  ElMessageBox.confirm("确定删除该商品类型吗？", "提示", {
    type: "warning",
  }).then(() => {
    fetch
      .delete(`/productType/${id}`)
      .then(() => {
        message.success("删除成功")
        getList()
      })
      .catch(() => {
        message.error("删除失败")
      })
  })
}

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
