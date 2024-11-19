<route lang="yaml">
meta:
  title: 钢瓶档案
  pageId: bottleList
  categoryList:
    - 生产中心/钢瓶管理
</route>

<template lang="pug">
.page
  el-card
    el-form(inline)
      yy-multipleTypeFilter(v-model:filter="filter", :filterTypeList="filterTypeList", @search="handleSearch")
      el-form-item(label="使用气站")
        yy-stationSelect(v-model="filter.station", @change="handleSearch")
      el-form-item(label="使用门店")
        yy-storeSelect(v-model="filter.store", @change="handleSearch")
      el-form-item(label="钢瓶规格")
        el-select(v-model="filter.bottleSpecific", clearable, style="width: 200px", @change="handleSearch")
          el-option(label="全部", value="")
          el-option(v-for="i in bottleSpecificList", :label="i.name", :value="i._id")
      el-form-item(label="钢瓶厂家")
        el-select(v-model="filter.bottleFactory", clearable, style="width: 200px", @change="handleSearch")
          el-option(label="全部", value="")
          el-option(v-for="i in bottleFactoryList", :label="i.name", :value="i._id")
      el-form-item(label="状态")
        el-select(v-model="filter.status", clearable, style="width: 200px", @change="handleSearch")
          el-option(label="全部", value="")
          el-option(v-for="i in bottleStatusList", :label="i", :value="i")
      el-form-item(label="创建人")
        yy-staffSelect(v-model="filter.author", @change="handleSearch")
      el-form-item(label="创建日期")
        yy-dateRange(v-model="filter.createTimeRange", @change="handleSearch")
      el-form-item(label="出厂日期")
        yy-dateRange(v-model="filter.productionDateRange", @change="handleSearch", type="monthrange")
      el-form-item(label="末检日期")
        yy-dateRange(v-model="filter.auditDateRange", @change="handleSearch", type="monthrange")
      el-form-item(label="钢瓶照片")
        el-select(v-model="filter.bottleImageLength", clearable, style="width: 200px", @change="handleSearch")
          el-option(label="全部", value="")
          el-option(label="无照片", :value="0")
          el-option(label="有照片", :value="1")
          el-option(label="有两张以上", :value="2")
          el-option(label="有三张以上", :value="3")
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
            el-button(type="primary", @click="handleBatchStatus") 批量更新状态
        .rightAction
          el-button(type="success", @click="handleAdd") 添加钢瓶
          el-button-group(style="margin-left: 10px")
            el-button(type="success", plain, @click="isShowImport = true") 导入数据
            el-button(type="warning", plain, @click="handleExport") 导出数据
    el-table(:data="list", ref="tableRef", stripe)
      el-table-column(type="selection", v-if="isMultiplePicker", fixed="left")
      el-table-column(type="expand", fixed="left")
        template(#default="{ row }")
          el-descriptions(:column="2")
            el-descriptions-item(label="ID") {{ row._id }}
            el-descriptions-item(label="产权类型") {{ row.property }}
            el-descriptions-item(label="来源") {{ row.source }}
            el-descriptions-item(label="创建人") {{ row.author?.name || row.author }}
            el-descriptions-item(label="创建时间") {{ formatTime(row.createTime) }}
            el-descriptions-item(label="更新时间") {{ formatTime(row.updateTime) }}
            el-descriptions-item(label="出厂日期") {{ formatDate(row.productionDate) }}
            el-descriptions-item(label="末检日期") {{ formatDate(row.auditDate) }}
            el-descriptions-item(label="下检日期") {{ formatDate(row.nextAuditDate) }}
            el-descriptions-item(label="报废日期") {{ formatDate(row.scrapDate) }}
          el-descriptions(:column="1")
            el-descriptions-item(label="检验报告")
              yy-imageList(v-model="row.auditReportList")
            el-descriptions-item(label="钢瓶交付文件")
              yy-imageList(v-model="row.deliveryFileList")
            el-descriptions-item(label="检验质量说明书")
              yy-imageList(v-model="row.auditQualityFileList")
            el-descriptions-item(label="制造监督验证书")
              yy-imageList(v-model="row.manufactureFileList")
            el-descriptions-item(label="钢瓶照片")
              yy-imageList(v-model="row.bottleImageList")
            el-descriptions-item(label="阀门照片")
              yy-imageList(v-model="row.valveImageList")

      el-table-column(label="条码", prop="sn", fixed="left")
      el-table-column(label="产品编号", prop="productCode")
      el-table-column(label="内部编号", prop="internalCode")
      el-table-column(label="电子标签", prop="rfid")
      el-table-column(label="所属部门", prop="station")
        template(#default="{ row }")
          span {{ row.station?.name || row.station }}
      el-table-column(label="使用门店", prop="store")
        template(#default="{ row }")
          span {{ row.store?.name || row.store }}
      el-table-column(label="钢瓶规格", prop="bottleSpecific")
        template(#default="{ row }")
          span {{ row.bottleSpecific?.name || row.bottleSpecific }}
      el-table-column(label="钢瓶厂家", prop="bottleFactory")
        template(#default="{ row }")
          span {{ row.bottleFactory?.name || row.bottleFactory }}
      el-table-column(label="出厂日期", prop="productionDate")
        template(#default="{ row }")
          span {{ formatDate(row.productionDate) }}
      el-table-column(label="末检日期", prop="auditDate")
        template(#default="{ row }")
          span {{ formatDate(row.auditDate) }}
      el-table-column(label="产权", prop="property")
      el-table-column(label="状态", prop="status")
        template(#default="{ row }")
          el-tag(v-if="row.status === '正常'", type="success") 正常
          el-tag(v-else-if="row.status === '作废'", type="danger") 作废
          el-tag(v-else-if="row.status === '过期'", type="warning") 过期
          el-tag(v-else, type="info") {{ row.status }}
      el-table-column(label="更新时间", prop="updateTime")
        template(#default="{ row }")
          span {{ formatTime(row.updateTime) }}
      el-table-column(label="操作", fixed="right", width="160px")
        template(#default="{ row }")
          el-button(type="primary", plain, size="small", @click="handleEdit(row._id)") 编辑
          el-button(type="info", plain, size="small", @click="handleViewLog(row._id)") 流转记录
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
  ComLog(v-model:isShow="isShowLog", :currentId="currentEditId", @success="handleReset")
  ComImport(v-model:isShow="isShowImport", @success="handleReset")
</template>

<script setup>
import { ElMessageBox, ElOption, ElSelect } from "element-plus"

import { bottleFactoryList, bottleSpecificList, ensureCacheData } from "@/provider/cache"
import { bottleStatusList } from "@/provider/dict"
import { useEditDialog, useListPage } from "@/provider/listPage"

import ComImport from "./__com__/batchImport.vue"
import ComEdit from "./__com__/edit.vue"
import ComLog from "./__com__/log.vue"

const { fetch, message, router } = inject("global")
const { formatTime, formatDate } = inject("format")

const { list, pagination, filter, getList, handleSearch, handleReset } = useListPage({
  url: "/bottle",
  filter: {
    sn: "",
    rfid: "",
    productCode: "",
    internalCode: "",
    station: "",
    status: "",
    bottleSpecific: "",
    bottleFactory: "",
    author: "",
    createTimeRange: [],
    productionDateRange: [],
    auditDateRange: [],
    bottleImageLength: "",
  },
})
const { isShowEdit, currentEditId, handleAdd, handleEdit } = useEditDialog()

const filterTypeList = ref([
  { label: "钢瓶条码", value: "sn" },
  { label: "电子标签", value: "rfid" },
  { label: "产品编号", value: "productCode" },
  { label: "内部编号", value: "internalCode" },
  { label: "ID", value: "_id" },
])

const isMultiplePicker = ref(false)
const tableRef = ref(null)
function handleCancelPick() {
  isMultiplePicker.value = false
  tableRef.value.clearSelection()
}

const batchStatus = ref("")
function handleBatchStatus() {
  const pickIdList = tableRef.value?.getSelectionRows()?.map((i) => i._id)
  if (!pickIdList?.length) return
  ElMessageBox({
    title: "请选择要批量设置的状态",
    message: () =>
      h(
        ElSelect,
        {
          modelValue: batchStatus.value,
          "onUpdate:modelValue": (val) => {
            batchStatus.value = val
          },
          style: `width:200px;`,
        },
        () =>
          bottleStatusList.map((i) => {
            return h(ElOption, { label: i, value: i })
          }),
      ),
  }).then((res) => {
    fetch
      .post("/bottle/batch/status", {
        bottleList: pickIdList,
        status: batchStatus.value,
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
        "/bottle/export",
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

const isShowLog= ref(false)
function handleViewLog(id) {
  isShowLog.value = true
  currentEditId.value = id
}

onBeforeMount(() => {
  ensureCacheData("bottleSpecificList")
  ensureCacheData("bottleFactoryList")
})

onMounted(() => {
  handleReset()
})
</script>

<style lang="less" scoped>
.el-table {
  height: calc(100vh - 300px);
}
</style>
