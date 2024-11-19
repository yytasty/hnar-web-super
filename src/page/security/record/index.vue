<route lang="yaml">
meta:
  title: 安检记录
  pageId: securityRecord
  categoryList:
    - 安全监管/入户安检
</route>

<template lang="pug">
.page
  el-card
    el-form(inline)
      el-form-item(label="安检单号")
        el-input(v-model="filter.code")
      el-form-item(label="安检时间")
        yy-dateRange(v-model="filter.dateRange", @change="handleSearch")
      el-form-item(label="内部编号")
        el-input(v-model="filter.internalCode")
      el-form-item(label="安检状态")
        el-select(v-model="filter.isPass", style="width: 200px")
          el-option(label="全部", value="")
          el-option(label="通过", :value="true")
          el-option(label="不通过", :value="false")
      el-form-item(label="整改状态")
        el-select(v-model="filter.isRectify", style="width: 200px")
          el-option(label="全部", value="")
          el-option(label="未整改", :value="false")
          el-option(label="已整改", :value="true")
      el-form-item(label="审核状态")
        el-select(v-model="filter.isAudit", style="width: 200px")
          el-option(label="全部", value="")
          el-option(label="待审核", :value="null")
          el-option(label="审核通过", :value="false")
          el-option(label="审核不通过", :value="true")
      el-form-item
        el-button(type="primary", @click="handleSearch") 查询
        el-button(type="warning", plain, @click="handleReset") 重置
  el-card
    el-table(:data="list")
      el-table-column(type="expand")
        template(#default="{ row }")
          el-descriptions(:column="2")
            el-descriptions-item(label="ID") {{ row._id }}
            el-descriptions-item(label="创建时间") {{ formatTime(row.createTime) }}
            el-descriptions-item(label="更新时间") {{ formatTime(row.updateTime) }}
      el-table-column(label="安检单号", prop="code")
      el-table-column(label="客户", prop="customer")
        template(#default="{ row }")
          yy-customerChip(:detail="row.customer")
      el-table-column(label="风险等级", prop="riskLevel")
        template(#default="{ row }")
          el-tag(type="success", v-if="row.riskLevel == 0") 绿码
          el-tag(type="warning", v-else-if="row.riskLevel === 1") 黄码
          el-tag(type="danger", v-else-if="row.riskLevel === 2") 红码
      el-table-column(label="安检状态", prop="isPass")
        template(#default="{ row }")
          el-tag(type="success", v-if="row.isPass") 通过
          el-tag(type="danger", v-else-if="row.isPass === false") 不通过
      el-table-column(label="审核状态", prop="isAudit")
        template(#default="{ row }")
          el-tag(type="success", v-if="row.isAudit") 审核通过
          el-tag(type="danger", v-else-if="row.isAudit === false") 审核不通过
          el-tag(type="info", v-else) 未处理
      el-table-column(label="整改状态")
        template(#default="{ row }")
          el-tag(type="success", v-if="row.isRectify") 已整改
          el-tag(type="info", v-else-if="!row.isPass") 未整改
      el-table-column(label="签收状态", prop="signature")
        template(#default="{ row }")
          el-popover(v-if="row.signature", trigger="click")
            template(#reference)
              el-tag(type="success", @click="handlePreviewSignature(row)") 已签收
            el-image(:src="row.signatureUrl", mode="aspectFill")
          el-tag(type="info", v-else) 未签收
      el-table-column(label="处理人", prop="handleStaff")
        template(#default="{ row }")
          yy-accountChip(:detail="row.handleStaff")
      el-table-column(label="创建人", prop="author")
        template(#default="{ row }")
          yy-accountChip(:detail="row.author")
      el-table-column(label="创建时间", prop="createTime")
        template(#default="{ row }")
          span {{ formatTime(row.createTime) }}
      el-table-column(label="操作", width="270px")
        template(#default="{ row }")
          el-button(size="small", plain, type="primary", @click="handleView(row._id)") 查看
          el-button(v-if="!row.isAudit", size="small", type="warning", plain, @click="handleAudit(row)") 审核通过
          template(v-if="!row.isPass")
            el-button(v-if="row.handleStaff", size="small", type="danger", plain, @click="handleCancelAssign(row)") 取消整改派工
            el-button(v-else, size="small", type="primary", @click="handleAssign(row)") 整改派工

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

ComDetail(v-model:isShow="isShowEdit", :currentId="currentEditId")
ComStaffPicker(v-model="isShowStaffPicker", @success="onStaffPick")
</template>

<script setup>
import ComStaffPicker from "@/component/picker/staff.vue"
import { useEditDialog, useListPage } from "@/provider/listPage"
import ComDetail from "./__com__/detail.vue"

const { fetch, message, router } = inject("global")
const { formatTime, formatDate } = inject("format")

const { list, pagination, filter, getList, handleSearch, handleReset } = useListPage({
  url: "/security/record",
  filter: {
    code: "",
    dateRange: [],
    isPass: "",
    isRectify: "",
    isAudit: "",
  },
})
const { currentEditId, isShowEdit, handleView } = useEditDialog()

const isShowStaffPicker = ref(false)
const assignId = ref("")
function handleAssign(row) {
  assignId.value = row?._id
  isShowStaffPicker.value = true
}
function handleCancelAssign(row) {
  fetch.put(`/security/record/${row._id}`, { handleStaff: "" }).then(() => {
    getList()
  })
}
function onStaffPick(val) {
  if (assignId.value) {
    fetch.put(`/security/record/${assignId.value}`, { handleStaff: val._id }).then(() => {
      getList()
    })
    return
  }
  formData.value.handleStaff = { _id: val._id, name: val.name }
}

function handleAudit(row) {
  fetch.put(`/security/record/${row._id}`, { isAudit: true }).then(() => {
    message.success("操作成功")
    getList()
  })
}

function handlePreviewSignature(row) {
  if (!row.signature) {
    message.error("未签收")
    return
  }
  fetch.get("/upload/signedUrl", { params: { url: row.signature } }).then((res) => {
    row.signatureUrl = res
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
