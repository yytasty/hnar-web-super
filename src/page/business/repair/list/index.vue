<route lang="yaml">
meta:
  title: 客户报修
  pageId: customerRepair
  order: 22
  categoryList:
    - 客服中心/售后管理
</route>

<template lang="pug">
.page
  el-card
    el-form(inline)
      el-form-item(label="客户")
        yy-customerSelect(v-model="filter.customer", @change="handleSearch")
      el-form-item(label="类型")
        el-radio-group(v-model="filter.type", @change="handleSearch")
          el-radio-button(value="") 全部
          el-radio-button(v-for="i in typeList", :value="i") {{ i }}
      el-form-item(label="创建时间")
        yy-dateRange(v-model="filter.createTimeRange", @change="handleSearch")
      el-form-item(label="状态")
        el-select(v-model="filter.status", clearable, @change="handleSearch")
          el-option(label="全部", value="")
          el-option(v-for="i in repairStatusList", :label="i", :value="i")
      el-form-item
        el-button(type="primary", @click="handleSearch") 查询
  el-card
    el-table(:data="list")
      //- el-table-column(label="ID", prop="_id")
      el-table-column(label="类型", prop="type")
      el-table-column(label="客户", prop="customer")
        template(#default="{ row }")
          yy-customerChip(:detail="row.customer")
      el-table-column(label="预约时间")
        template(#default="{ row }")
          span {{ formatTime(row.planTime) }}
      el-table-column(label="维修状态", prop="status")
        template(#default="{ row }")
          yy-status(:status="row.status")
      el-table-column(label="维修人", prop="handleStaff")
        template(#default="{ row }")
          yy-accountChip(:detail="row.handleStaff")
      el-table-column(label="创建时间")
        template(#default="{ row }")
          span {{ formatTime(row.createTime) }}
      el-table-column(label="操作")
        template(#default="{ row }")
          el-button(type="success", size="small", @click="handleAssign(row)") 指派
          el-button(type="primary", size="small", @click="handleView(row._id)") 详情
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

ComDetail(v-model:isShow="isShowEdit", :currentId="currentEditId", :isViewMode="isViewMode", @success="getList")
ComStaffPick(v-model="isShowStaffPicker", @success="onStaffPick")
</template>

<script setup>
import ComStaffPick from "@/component/picker/staff.vue"
import { repairStatusList } from "@/provider/dict"
import { useEditDialog, useListPage } from "@/provider/listPage"
import ComDetail from "./__com__/detail.vue"

const { fetch, message, router } = inject("global")
const { formatTime } = inject("format")

const { list, pagination, filter, getList, handleSearch, handleReset } = useListPage({
  url: "/repair",
  filter: {
    customer: "",
    type: "",
    createTimeRange: [],
  },
})

const { isShowEdit, currentEditId, isViewMode, handleAdd, handleEdit, handleView } = useEditDialog()

const typeList = ref([])
function getTypeList() {
  fetch.get("/config/repairTypeList").then((res) => {
    typeList.value = res || []
  })
}

const isShowStaffPicker = ref(false)
const assignId = ref("")
function onStaffPick(val) {
  if (assignId.value) {
    fetch.put(`/repair/${assignId.value}`, { handleStaff: val._id }).then(() => {
      message.success("指派成功")
      getList()
    })
  }
}
function handleAssign(row) {
  assignId.value = row._id
  isShowStaffPicker.value = true
}

onMounted(() => {
  getTypeList()
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
