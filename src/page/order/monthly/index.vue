<route lang="yaml">
meta:
  title: 月结订单
  pageId: monthlyOrderList
  order: 3
  categoryList:
    - 客服中心/订单管理
    - 销售管理/订单管理
</route>

<template lang="pug">
.page
  el-card
    el-form(inline)
      el-form-item(label="客户")
        yy-customerSelect(v-model="filter.customer", @change="handleSearch")
      el-form-item(label="配送门店")
        yy-storeSelect(v-model="filter.store", @change="handleSearch")
      el-form-item(label="订单时间")
        yy-dateRange(v-model="filter.createTimeRange", @change="handleSearch")
      el-form-item
        el-button(type="primary", @click="search") 查询
      el-form-item
        el-button(type="warning", @click="handleShowSuccess") 结算
  el-card
    el-table(:data="list", show-summary, :summary-method="getSummaries", @selection-change="handleSelectionChange")
      el-table-column(type="selection", width="100")
      el-table-column(type="expand")
        template(#default="{ row }")
          div(style="margin: 10px 100px; padding: 20px; box-shadow: 0 0 5px #ccc")
            el-descriptions(:column="2")
              el-descriptions-item(label="ID：") {{ row._id }}
              el-descriptions-item(label="创建时间：") {{ formatTime(row.createTime) }}
              el-descriptions-item(label="备注：") {{ row.remark }}
              el-descriptions-item(label="来源：") {{ row.source }}
            el-table(:data="row.productList", border)
              el-table-column(label="商品名称", prop="productName")
              el-table-column(label="商品数量", prop="num")
              el-table-column(label="商品单价", prop="price")
              el-table-column(label="楼层价", prop="floorPrice")
      el-table-column(label="订单编号", prop="code")
      el-table-column(label="客户", prop="customer")
        template(#default="{ row }")
          yy-customerChip(:detail="row.customer")
      el-table-column(label="配送方式", prop="isTakeTheir")
        template(#default="{ row }")
          span {{ row.isTakeTheir ? "自提" : "配送" }}
      el-table-column(label="订单总价", prop="totalPrice")
      el-table-column(label="订单状态", prop="status")
      el-table-column(label="付款方式", prop="payType")
      el-table-column(label="支付状态", prop="payStatus")
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
yy-dialog(v-model="showSuccess", width="400px")
  template(#title) 
    div(style="color: red") 确定要结算选中的所有订单
      span(style="color: rgba(255, 120, 0, 1)") （{{ selectList.length }}个）
      span 吗
  el-form
    el-form-item(label="总金额：") {{ totalPrice }}
    el-form-item(label="备注：")
      el-input(v-model="remark", type="textarea", style="width: 300px", :autosize="{ minRows: 4, maxRows: 4 }")
  template(#footer)
    el-button(type="primary", @click="handleSuccess", :loading="successLoading") 确定
    el-button(type="default", @click="showSuccess = false") 取消
</template>

<script setup>
import { useListPage } from "@/provider/listPage"
import Decimal from "decimal.js"
import { dayjs } from "element-plus"
const { fetch, message, router } = inject("global")
const { formatTime } = inject("format")
const { list, pagination, filter, getList, handleSearch, handleReset } = useListPage({
  url: "/order",
  filter: {
    _id: "",
    customer: "",
    store: "",
    createTimeRange: [dayjs().startOf("month").toDate(), dayjs().endOf("month").toDate()],
  },
  extendFilter: () => ({
    payType: "月结",
    status: "已派工",
  }),
})
pagination.value.size = 10000

// 选中的数据
const selectList = ref([])
function handleSelectionChange(val) {
  selectList.value = val
}

// 表格统计总价
const totalPrice = ref(0)
function getSummaries() {
  totalPrice.value = selectList.value
    .reduce((a, b) => a.add(b.totalPrice), new Decimal(0))
    .toNumber()
    .toFixed(2)
  const sums = ["合计", "", "", "", "", totalPrice.value]
  return sums
}

// 点击了查询，选择列表变空
function search() {
  selectList.value = []
  handleSearch()
}

// 结算相关
const remark = ref("")
const showSuccess = ref(false)
function handleShowSuccess() {
  if (!selectList.value.length) {
    return message.error("请先选择订单")
  }
  remark.value = ""
  showSuccess.value = true
}

// 提交结算
const successLoading = ref(false)
function handleSuccess() {
  if (!remark.value) {
    return message.error("请先填写备注")
  }
  successLoading.value = true
  fetch
    .put(`/order/batch/monthly/success`, { orderIdList: selectList.value.map((v) => v._id), remark: remark.value })
    .then(() => {
      search()
      message.success("操作成功")
      showSuccess.value = false
    })
    .catch((e) => {
      message.error(e.message || e.msg || e || "操作失败")
    })
    .finally(() => {
      successLoading.value = false
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
