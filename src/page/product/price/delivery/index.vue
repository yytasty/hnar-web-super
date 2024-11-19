<route lang="yaml">
meta:
  title: 商品配送费用
  pageId: productDeliveryPrice
  order: 11
  categoryList:
    - 销售管理/价格管理
</route>

<template lang="pug">
.page
  el-card
    el-form(inline)
      el-form-item(label="商品")
        yy-productSelect(v-model="filter.product", @change="handleSearch")
      el-form-item
        el-button(type="info", @click="handleReset") 重置
        el-button(type="primary", @click="handleSearch") 查询
  el-card
    template(#header)
      el-button(type="success", @click="handleAdd") 添加
    el-table(:data="list")
      el-table-column(label="商品名称", prop="productList")
        template(#default="{ row }")
          div(v-for="item in row.productList", :key="item._id") {{ item?.name || "-" }}
      el-table-column(label="基础配送费用(元)", prop="basicPrice")
      el-table-column(label="操作人", prop="operator")
        template(#default="{ row }")
          yy-accountChip(:detail="row.author")
      el-table-column(label="查看详情")
        template(#default="{ row }")
          el-button(type="primary", link  size="small", @click="handleView(row._id)") 查看
      el-table-column(label="排序", prop="sortNum")
      el-table-column(label="操作时间")
        template(#default="{ row }")
          span {{ formatTime(row.updateTime) }}
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
  ComEdit(v-model:isShow="isShowEdit", :currentId="currentEditId", @success="handleReset", :isViewMode="isViewMode")
</template>

<script setup>
import { useEditDialog, useListPage } from "@/provider/listPage"
import ComEdit from "./__com__/edit.vue"

const { fetch, message, router } = inject("global")
const { formatTime } = inject("format")

const { list, pagination, filter, getList, handleSearch, handleReset, handleDelete } = useListPage({
  url: "/productDeliveryPrice",
  filter: {
    name: "",
  },
})

const { isShowEdit, currentEditId, isViewMode, handleAdd, handleEdit, handleView } = useEditDialog()

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
