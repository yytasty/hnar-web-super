<route lang="yaml">
meta:
  title: 客户优惠
  pageId: customerDiscount
  order: 14
  categoryList:
    - 销售管理/价格管理
</route>

<template lang="pug">
.page
  el-card
    el-form(inline)
      el-form-item(label="名称")
        el-input(v-model="filter.name")
      el-form-item(label="适用客户类型")
        el-select(v-model="filter.type")
          el-option(label="全部", value="")
          el-option(v-for="i in customerTypeList", :label="i", :value="i")
      el-form-item
        el-button(type="info", @click="handleReset") 重置
        el-button(type="primary", @click="handleSearch") 查询
  el-card
    template(#header)
      el-button(type="success", @click="handleAdd") 添加
    el-table(:data="list")
      el-table-column(label="名称", prop="name")
      el-table-column(label="优惠类型", prop="type")
      el-table-column(label="优惠值", prop="value")
      el-table-column(label="适用客户类型", prop="customerTypeList")
        template(#default="{ row }")
          span {{ row.customerTypeList?.join(",") }}
      el-table-column(label="是否启用", prop="isEnable")
        template(#default="{ row }")
          el-switch(:modelValue="row.isEnable", disabled)
      el-table-column(label="创建人", prop="author")
        template(#default="{ row }")
          yy-accountChip(:detail="row.author")
      el-table-column(label="创建时间")
        template(#default="{ row }")
          span {{ formatTime(row.createTime) }}
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
import { customerTypeList, ensureCacheData } from "@/provider/cache"
import { useEditDialog, useListPage } from "@/provider/listPage"
import ComEdit from "./__com__/edit.vue"

const { fetch, message, router } = inject("global")
const { formatTime } = inject("format")

const { list, pagination, filter, getList, handleSearch, handleReset, handleDelete } = useListPage({
  url: "/customerDiscount",
  filter: {
    name: "",
  },
})

const { isShowEdit, currentEditId, isViewMode, handleAdd, handleEdit, handleView } = useEditDialog()

onBeforeMount(() => {
  ensureCacheData("customerTypeList")
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
