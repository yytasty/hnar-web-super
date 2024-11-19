<route lang="yaml">
meta:
  title: 押瓶单
  pageId: guarantyList
  categoryList:
    - 客服中心/押瓶管理
    - 销售管理/押瓶管理
</route>

<template lang="pug">
.page
  el-card
    el-form(inline)
      el-form-item(label="客户")
        yy-customerSelect(v-model="filter.customer", @change="handleSearch")
      el-form-item(label="押金单号")
        el-input(v-model="filter.code", placeholder="请输入押金单号")
      el-form-item
        el-button(type="primary", @click="handleSearch") 查询
        el-button(type="warning", plain, @click="handleReset") 重置
  el-card
    template(#header)
      .tableHeader
        el-button(type="success", @click="handleAdd") 添加押瓶单
        .rightAction
          el-button(type="warning", plain, @click="handleExport") 导出数据
    el-table(:data="list", row-class-name="tableRowWithAction")
      el-table-column(label="来源订单", prop="fromOrder")
      el-table-column(label="客户", prop="customer", width="120px")
        template(#default="{ row }")
          yy-customerChip(:detail="row.customer")
      el-table-column(label="押金单号", prop="code")
      el-table-column(label="押瓶规格", prop="bottleSpecific")
        template(#default="{ row }")
          span {{ row.bottleSpecific?.name || row.bottleSpecific }}
      el-table-column(label="押金", prop="guarantyPrice")
      el-table-column(label="押瓶数量", prop="count")
      el-table-column(label="押瓶开始时间", prop="startDate")
        template(#default="{ row }")
          span {{ formatDate(row.startDate) }}
      el-table-column(label="收租方式", prop="rentType")
      el-table-column(label="租金", prop="rentPrice")
      el-table-column(label="来源", prop="source")
      //- el-table-column(label="处理人", prop="handleStaff")
        template(#default="{ row }")
          yy-accountChip(:detail="row.handleStaff")
      el-table-column(label="状态", prop="status")
        template(#default="{ row }")
          el-tag(v-if="row.status === '生效中'", type="success") 生效中
          el-tag(v-else-if="row.status === '已作废'", type="danger") 已作废
          el-tag(v-else, type="info") {{ row.status }}
      el-table-column(label="创建时间", prop="createTime")
        template(#default="{ row }")
          span {{ formatTime(row.createTime) }}
      el-table-column(label="操作", width="220px", fixed="right")
        template(#default="{ row }")
          //- el-button(v-if="row.handleStaff", type="danger", size="small", plain, @click="handleCancelAssign(row)") 取消派工
          //- el-button(v-else, type="primary", size="small", plain, @click="handleAssign(row)") 派工
          el-button(type="primary", size="small", @click="handleEdit(row)") 编辑
          .extendAction
            el-button(type="danger", size="small", plain, @click="handleDelete(row)")
              el-icon
                Delete
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

ComStaffPicker(v-model="isShowStaffPicker", @success="onStaffPick")
ComEdit(v-model:isShow="isShowEdit", :currentId="currentEditId", @success="getList")
</template>

<script setup>
import ComStaffPicker from "@/component/picker/staff.vue"
import { useEditDialog, useListPage } from "@/provider/listPage"
import ComEdit from "./__com__/edit.vue"

const { fetch, message, router } = inject("global")
const { formatDate, formatTime } = inject("format")

const { list, pagination, filter, getList, handleSearch, handleReset, handleDelete } = useListPage({
  url: "/guaranty",
  filter: {
    code: "",
    customer: "",
  },
})
const { isShowEdit, currentEditId, handleAdd, handleEdit } = useEditDialog()

const isShowStaffPicker = ref(false)
function onStaffPick(val) {
  if (assignId.value) {
    fetch.put(`/guaranty/${assignId.value}`, { handleStaff: val._id }).then(() => {
      getList()
    })
    return
  }
  formData.value.handleStaff = { _id: val._id, name: val.name }
}
const assignId = ref("")
function handleAssign(row) {
  assignId.value = row?._id
  isShowStaffPicker.value = true
}
function handleCancelAssign(row) {
  fetch.put(`/guaranty/${row._id}`, { handleStaff: "" }).then(() => {
    getList()
  })
}

function handleExport() {
  ElMessageBox.confirm(`确定导出当前筛选条件下共 ${pagination.value.total} 条数据吗？`, "导出数据提示", {
    confirmButtonText: "确定导出",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    fetch
      .post("/guaranty/export", {
        ...filter.value,
      })
      .then((url) => {
        window.open(url)
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
