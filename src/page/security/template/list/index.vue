<route lang="yaml">
meta:
  title: 安检模板
  pageId: securityTemplate
  categoryList:
    - 安全监管/入户安检
</route>

<template lang="pug">
.page
  el-card
    el-form(inline)
      el-form-item(label="标题")
        el-input(v-model="filter.title")
      el-form-item(label="客户类型")
        el-select(v-model="filter.customerTypeList", @change="handleSearch")
          el-option(label="全部", value="")
          el-option(v-for="item in customerTypeList", :label="item", :value="item")
      el-form-item(label="类型")
        el-radio-group(v-model="filter.type", @change="handleSearch")
          el-radio-button(value="") 全部
          el-radio-button(value="daily") 日常入户检
          el-radio-button(value="year") 年检
      el-form-item(label="状态")
        el-select(v-model="filter.isEnable", style="width: 200px")
          el-option(label="全部", value="")
          el-option(label="启用", :value="true")
          el-option(label="未启用", :value="false")
      el-form-item(label="创建时间")
        yy-dateRange(v-model="filter.dateRange", @change="handleSearch")
      el-form-item
        el-button(type="primary", @click="handleSearch") 查询
        el-button(type="warning", plain, @click="handleReset") 重置
  el-card
    template(#header)
      el-button(type="success", @click="handleAdd") 添加
    el-table(:data="list")
      el-table-column(type="expand")
        template(#default="{ row }")
          el-descriptions(:column="2")
            el-descriptions-item(label="ID") {{ row._id }}
            el-descriptions-item(label="创建时间") {{ formatTime(row.createTime) }}
            el-descriptions-item(label="更新时间") {{ formatTime(row.updateTime) }}
      el-table-column(label="标题", prop="title")
      el-table-column(label="所属公司", prop="company")
        template(#default="{ row }")
          span {{ row.company?.name || row.company }}
      el-table-column(label="编制单位", prop="authorized")
      el-table-column(label="盖章图片", prop="signatureImage")
        template(#default="{ row }")
          yy-image(:src="row.signatureImage")
      el-table-column(label="备注", prop="remark")
      el-table-column(label="适用客户类型", prop="customerTypeList")
      el-table-column(label="类型", prop="type")
        template(#default="{ row }")
          el-tag(v-if="row.type === 'daily'", type="primary") 日常入户检
          el-tag(v-else-if="row.type === 'year'", type="warning") 年检
      el-table-column(label="状态", prop="isEnable")
        template(#default="{ row }")
          el-switch(:modelValue="row.isEnable")
      el-table-column(label="创建人", prop="author")
        template(#default="{ row }")
          yy-accountChip(:detail="row.author")
      el-table-column(label="更新时间", prop="updateTime")
        template(#default="{ row }")
          span {{ formatTime(row.updateTime) }}
      el-table-column(label="操作", width="300px")
        template(#default="{ row }")
          el-button(size="small", plain, type="primary", @click="handleEdit(row._id)") 编辑
          el-button(
            size="small",
            plain,
            type="success",
            @click="router.push(`/security/template/detail?id=${row._id}`)"
          ) 安检项明细
          el-button(size="small", plain, type="primary", @click="handleCopy(row._id)") 复制
          el-button(size="small", plain, type="danger", @click="handleDelete(row._id)") 删除
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
import { customerTypeList, ensureCacheData } from "@/provider/cache"
import { useEditDialog, useListPage } from "@/provider/listPage"
import ComEdit from "./__com__/edit.vue"

const { fetch, message, router } = inject("global")
const { formatTime, formatDate } = inject("format")

const { list, pagination, filter, getList, handleSearch, handleReset, handleDelete } = useListPage({
  url: "/security/template",
  filter: {
    title: "",
    dateRange: "",
    company: "",
    customerTypeList: "",
    isEnable: "",
  },
})
const { isShowEdit, currentEditId, handleAdd, handleEdit } = useEditDialog()

function handleCopy(id) {
  fetch.post(`/security/template/${id}/copy`).then(() => {
    message.success("复制成功")
    getList()
  })
}

onBeforeMount(async () => {
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
