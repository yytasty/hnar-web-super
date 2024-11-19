<route lang="yaml">
meta:
  title: 客户档案
  pageId: customerList
  order: 11
  categoryList:
    - 客服中心/客户管理
</route>

<template lang="pug">
.page
  el-card
    el-form(inline, label-width="6em")
      yy-multipleTypeFilter(v-model:filter="filter", :filterTypeList="filterTypeList", @search="handleSearch")
      el-form-item(label="开户时间")
        yy-dateRange(v-model="filter.createTimeRange", @change="handleSearch")
      el-form-item(label="风险等级")
        el-radio-group(v-model="filter.riskGrade")
          el-radio-button(value="") 全部
          el-radio-button(v-for="i in customerRiskGradeList", :value="i") {{ i }}
    el-form(inline, label-width="6em")
      el-form-item(label="所属门店")
        yy-storeSelect(v-model="filter.store", @change="handleSearch")
      el-form-item(label="所属配送员")
        yy-staffSelect(v-model="filter.courier", @change="handleSearch")
      el-form-item(label="客户类型")
        el-select.value(v-model="filter.type", clearable, style="width: 200px")
          el-option(v-for="item in customerTypeList", :label="item", :value="item")
      el-form-item(label="客户来源")
        el-select.value(v-model="filter.source", clearable, @change="handleSearch", @clear="handleSearch")
          el-option(v-for="item in customerSourceList", :label="item", :value="item")
      el-form-item(label="付款方式")
        el-select.value(v-model="filter.payType", clearable, @change="handleSearch", @clear="handleSearch")
          el-option(label="全部", value="")
          el-option(v-for="item in customerPayTypeList", :label="item", :value="item")
      el-form-item(label="创建人")
        yy-staffSelect(v-model="filter.author", @change="handleSearch")
      el-form-item
        el-button(type="primary", @click="handleSearch") 查询
        el-button(type="warning", plain, @click="handleReset") 重置
  el-card
    template(#header)
      .tableHeader
        .pickActon
          el-button(v-if="!isMultiplePicker", type="primary", plain, @click="isMultiplePicker = true") 批量选择操作
          template(v-else)
            el-button(type="warning", plain, @click="handleCancelPick") 取消批量选择
            el-button(type="primary", @click="handleBatchType") 批量更新客户类型
        .rightAction
          el-button(type="success", @click="handleAdd") 添加客户
          el-button-group(style="margin-left: 10px")
            el-button(type="success", plain, @click="isShowImport = true") 导入数据
            el-button(type="warning", plain, @click="handleExport") 导出数据
    el-table(:data="list", ref="tableRef", stripe, row-class-name="tableRowWithAction")
      el-table-column(type="selection", v-if="isMultiplePicker", fixed="left")
      el-table-column(type="expand", fixed="left")
        template(#default="{ row }")
          div(style="padding-left: 20px; background-color: #fff")
            el-descriptions(:column="2")
              el-descriptions-item(label="ID") {{ row._id }}
      el-table-column(label="编号", prop="code", fixed="left")
      el-table-column(label="姓名", prop="name", fixed="left")
      el-table-column(label="客户电话", prop="phone")
      el-table-column(label="所属门店", prop="store.name")
      el-table-column(label="所属配送员", width="120px")
        template(#default="{ row }")
          yy-accountChip(:detail="row.courier")
      el-table-column(label="客户类型", prop="type")
      el-table-column(label="客户性质", prop="quality")
      el-table-column(label="支付方式", prop="payType")
        template(#default="{ row }")
          el-tag(v-if="row.payType === '现金'", type="success") 现金
          el-tag(v-else-if="row.payType === '月结'", type="warning") 月结
          el-tag(v-else, type="info") {{ row.payType }}
      el-table-column(label="风险等级", prop="riskGrade")
        template(#default="{ row }")
          el-tag(v-if="row.riskGrade === '绿码'", type="success") 绿码
          el-tag(v-else-if="row.riskGrade === '黄码'", type="warning") 黄码
          el-tag(v-else-if="row.riskGrade === '红码'", type="danger") 红码
          el-tag(v-else, type="info") {{ row.riskGrade }}
      el-table-column(label="客户来源", prop="source")
      el-table-column(label="状态", align="left", width="140px")
        template(#default="{ row }")
          el-checkbox(:modelValue="true", size="small") 基本信息
          el-checkbox(
            :modelValue="!!row.addressInfo?.address && !!row.addressInfo?.location?.coordinates?.[0]",
            size="small"
          ) 地址信息
          el-checkbox(:modelValue="isContractReady(row)", size="small") 合同信息
          el-checkbox(:modelValue="isHaveLicenseInfo(row)", size="small") 证照信息
      el-table-column(label="电子合同", width="120px")
        template(#default="{ row }")
          el-button(
            v-if="row.contractInfo?.contractUrl",
            type="success",
            plain,
            size="small",
            @click="handlePreviewContract(row)"
          ) 查看电子合同
          el-button(v-else, type="primary", plain, size="small", @click="handleGenerateContract(row)") 生成电子合同
      el-table-column(label="创建人", width="120px")
        template(#default="{ row }")
          yy-accountChip(:detail="row.author")
      el-table-column(label="创建时间")
        template(#default="{ row }")
          span {{ formatTime(row.createTime) }}
      el-table-column(label="操作", width="160px", fixed="right")
        template(#default="{ row }")
          el-button(type="success", plain, size="small", @click="handleOrder(row)") 立即下单
          el-button(type="primary", plain, size="small", @click="handleEdit(row)") 编辑
          .extendAction
            el-button(type="warning", plain, size="small", @click="handleResetPassword(row._id)") 重置密码
            el-button(type="danger", size="small", plain, @click="handleDelete(row)") 删除
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
  ComImport(v-model:isShow="isShowImport", @success="handleReset")
  ComContract(v-model:isShow="isShowContract", :currentId="currentEditId", @success="getList")
</template>

<script setup>
import { ElMessageBox, ElOption, ElSelect } from "element-plus"
import { useRouteQuery } from "@vueuse/router"

import { customerNatureList, customerSourceList, customerTypeList, ensureCacheData } from "@/provider/cache"
import { customerPayTypeList, customerRiskGradeList } from "@/provider/dict"
import { useEditDialog, useListPage } from "@/provider/listPage"
import { datePickShortcutBefore } from "@/util/time"

import ComImport from "./__com__/batchImport.vue"
import ComContract from "./__com__/contract.vue"

const { fetch, message, router } = inject("global")
const { formatTime } = inject("format")

const queryId = useRouteQuery("id", "", { transform: String })

const { list, pagination, filter, getList, handleSearch, handleReset, handleDelete } = useListPage({
  url: "/customer",
  filter: {
    name: "",
    riskGrade: "",
    type: "",
    source: "",
    payType: "",
    courier: "",
    author: "",
    store: "",
    areaList: [],
    createTimeRange: [],
  },
})

const filterTypeList = ref([
  { label: "客户名称", value: "name" },
  { label: "客户编号", value: "code" },
  { label: "客户电话", value: "phone" },
  { label: "身份证号", value: "idCard" },
  { label: "ID", value: "_id" },
])

const { currentEditId } = useEditDialog()

function handleAdd() {
  router.push(`/customer/edit`)
}
function handleEdit(row) {
  if (!row._id) return
  router.push(`/customer/edit?id=${row._id}`)
}

const isMultiplePicker = ref(false)
const tableRef = ref(null)
function handleCancelPick() {
  isMultiplePicker.value = false
  tableRef.value.clearSelection()
}

function isHaveLicenseInfo(row) {
  if (!row.licenseType) return false
  if (row.licenseType === "营业执照") {
    return !!row.businessLicenseInfo
  } else if (row.licenseType === "身份证") {
    return !!row.idCardInfo
  } else if (row.licenseType === "户口本") {
    return !!row.householdInfo
  }
  return !!row.idCardInfo || !!row.householdInfo || !!row.businessLicenseInfo
}

function handleOrder(row) {
  router.push(`/workspace?tab=下单&customerId=${row._id}`)
}

const batchType = ref("")
function handleBatchType() {
  const pickIdList = tableRef.value?.getSelectionRows()?.map((i) => i._id)
  if (!pickIdList?.length) return
  ElMessageBox({
    title: "请选择要批量设置的客户类型",
    message: () =>
      h(
        ElSelect,
        {
          modelValue: batchType.value,
          "onUpdate:modelValue": (val) => {
            batchType.value = val
          },
          style: `width:200px;`,
        },
        () =>
          customerTypeList.value?.map((i) => {
            return h(ElOption, { label: i, value: i })
          }),
      ),
  }).then((res) => {
    fetch
      .post("/customer/batch/type", {
        customerList: pickIdList,
        type: batchType.value,
      })
      .then(() => {
        message.success("批量更新状态成功")
        getList()
      })
  })
}

const isShowImport = ref(false)
function handleExport() {
  ElMessageBox.confirm(`确定导出当前筛选条件下共 ${pagination.value.total} 条数据吗？`, "导出数据提示", {
    confirmButtonText: "确定导出",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    fetch
      .post(
        "/customer/export",
        {},
        {
          params: filter.value,
        },
      )
      .then((url) => {
        window.open(url)
      })
  })
}

function handleResetPassword(id) {
  ElMessageBox.prompt("请输入新密码", "重设密码", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  }).then(({ value }) => {
    if (value === "") {
      message.error("密码不能为空")
      return
    }
    fetch
      .post(`/customer/${id}/resetPassword`, {
        password: value,
      })
      .then(() => {
        message.success("重设密码成功")
      })
  })
}

function isContractReady(row) {
  return !!row.contractInfo?.code && !!row.contractInfo?.startDate && !!row.contractInfo?.endDate
}

function handlePreviewContract(row) {
  if (row.contractInfo?.contractUrl) {
    fetch.get("/upload/signedUrl", { params: { url: row.contractInfo.contractUrl } }).then((res) => {
      window.open(res)
    })
  }
}

const isShowContract = ref(false)
function handleGenerateContract(row) {
  if (!isContractReady(row)) {
    message.error("请先完善合同信息")
    return
  }
  isShowContract.value = true
  currentEditId.value = row._id
}

onBeforeMount(async () => {
  ensureCacheData("customerTypeList")
  ensureCacheData("customerSourceList")
})
onMounted(async () => {
  handleReset()
  if (queryId.value) {
    handleEdit(queryId.value)
  }
})
</script>

<style lang="less" scoped>
.page {
  width: 100%;
}
.label {
  width: 100px;
  margin-right: 10px;
}
.value {
  width: 200px !important;
}

.el-table {
  height: calc(100vh - 300px);
}

.extendAction {
  margin-top: 5px;
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding-right: 15px;
}
</style>
