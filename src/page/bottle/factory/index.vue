<route lang="yaml">
meta:
  title: 钢瓶厂家
  pageId: bottleFactory
  categoryList:
    - 生产中心/钢瓶管理
</route>

<template lang="pug">
.page
  el-card
    el-form(inline)
      el-form-item(label="厂家名称")
        el-input(v-model.trim="filter.name")
      el-form-item(label="厂家代码")
        el-input(v-model.trim="filter.code")
      el-form-item(label="是否常用")
        el-select(v-model="filter.isStar", @change="handleSearch")
          el-option(
            :label="item.label",
            :value="item.value",
            v-for="item in [ { label: '全部', value: '' }, { label: '是', value: true }, { label: '否', value: false }, ]"
          )
      el-form-item(label="创建人")
        yy-staffSelect(v-model="filter.author")
      el-form-item(label="创建时间")
        yy-dateRange(v-model="filter.createTimeRange", @change="handleSearch")
      el-form-item
        el-button(type="primary", @click="handleSearch") 搜索
        el-button(type="warning", plain, @click="handleReset") 重置
  el-card
    template(#header)
      el-button(type="success", @click="handleAdd") 添加钢瓶厂家
    el-table(:data="list", @sort-change="onSortChange")
      el-table-column(label="常用", align="center", width="60px", fixed="left")
        template(#default="{ row }")
          el-icon(size="20", color="var(--color-primary)", v-if="row.isStar")
            StarFilled
      el-table-column(label="厂家名称", prop="name", sortable="custom", fixed="left")
        template(#default="{ row }")
          el-tag(v-if="row.shortName", size="small", type="info") {{ row.shortName }}
          div {{ row.name }}
          div {{ row.desc }}
      el-table-column(label="厂家代码", prop="code", sortable="custom")
      el-table-column(label="制造许可证编号", prop="prcLicenseNo", sortable="custom")
      el-table-column(label="单位代码", prop="unitCode", sortable="custom")
      el-table-column(label="备注", prop="remark", sortable="custom")
      el-table-column(label="排序", prop="order", sortable="custom")
      el-table-column(label="创建人", prop="author", sortable="custom")
        template(#default="{ row }")
          yy-accountChip(:detail="row.author")
      el-table-column(label="创建时间", prop="createTime", sortable="custom")
        template(#default="{ row }")
          span {{ formatTime(row.createTime) }}
      el-table-column(label="操作", fixed="right", width="150px")
        template(#default="{ row }")
          el-button(type="primary", plain, size="small", @click="handleEdit(row._id)") 编辑
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

  ComEdit(v-model:isShow="isShowEdit", :currentId="currentEditId", @success="handleReset")
</template>

<script setup>
import { useEditDialog, useListPage } from "@/provider/listPage"
import ComEdit from "./__com__/edit.vue"
const { fetch, message, router } = inject("global")
const { formatTime } = inject("format")

const { list, pagination, filter, getList, handleSearch, handleReset, handleDelete, onSortChange } = useListPage({
  url: "/bottle/factory",
  filter: {
    name: "",
    code: "",
    isStar: "",
    author: "",
    createTimeRange: [],
  },
})

const { isShowEdit, currentEditId, handleAdd, handleEdit } = useEditDialog()

onMounted(() => {
  handleReset()
})
</script>

<style lang="less" scoped>
.el-table {
  height: calc(100vh - 300px);
}
</style>
