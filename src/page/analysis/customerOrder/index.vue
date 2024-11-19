<route lang="yaml">
meta:
  title: 客户销售统计
  pageId: customerOrderAnalysis
  categoryList:
    - 报表中心
</route>

<template lang="pug">
.page
  el-card
    el-form(inline)
      el-form-item(label="客户")
        yy-customerSelect(v-model="filter.customer", @change="handleSearch")
      el-form-item(label="时间")
        yy-dateRange(v-model="filter.createTimeRange", @change="handleSearch")
      el-form-item
        el-button(type="primary", style="width: 200px", @click="handleSearch") 查询
      el-form-item
        el-button(type="warning", plain, @click="handleReset") 重置
        el-button(type="success", plain, @click="handleExport") 导出
  el-card
    el-table(:data="list", show-summary, :summary-method="getSummary")
      el-table-column(type="expand", fixed="left")
        template(#default="{ row }")
          el-table(:data="row.orderList", style="height: unset")
            el-table-column(label="订单编号", prop="code")
            el-table-column(label="配送方式", prop="isTakeTheir")
              template(#default="{ row }")
                span {{ row.isTakeTheir ? "自提" : "配送" }}
            el-table-column(label="订单总价", prop="totalPrice")
              template(#default="{ row }")
                span {{ formatPrice(row.totalPrice) }}
            el-table-column(label="优惠金额", prop="discountAmount")
              template(#default="{ row }")
                span(style="color: var(--color-red)") {{ formatPrice(row.discountAmount) }}
            el-table-column(label="实收金额", prop="actualAmount")
              template(#default="{ row }")
                span(style="color: var(--color-green)") {{ formatPrice(row.actualAmount) }}
            el-table-column(label="订单状态", prop="status")
              template(#default="{ row }")
                el-tag(v-if="row.status === '已作废'", type="danger") 已作废
                el-tag(v-else-if="row.status === '已完成'", type="success") 已完成
                el-tag(v-else-if="row.status === '已派工'", type="primary") 已派工
                el-tag(v-else, type="info") {{ row.status }}
      el-table-column(label="客户编号", prop="customer.code", fixed="left")
      el-table-column(label="客户名称", prop="customer.name", fixed="left")
        template(#default="{ row }")
          div(style="cursor: pointer", @click="jumpOrder(row)")
            el-tag(type="primary") {{ row.customer.name }}
      el-table-column(label="订单数量", prop="countOrder")
      el-table-column(label="商品销售数", prop="countBottle")
      el-table-column(label="销售重量（Kg）", prop="countWeight")
      el-table-column(label="应收金额", prop="priceTotal")
        template(#default="{ row }")
          span {{ formatPrice(row.priceTotal) }}
      el-table-column(label="实收金额", prop="priceReal")
        template(#default="{ row }")
          span {{ formatPrice(row.priceReal) }}
      el-table-column(label="优惠金额", prop="priceDiscount")
        template(#default="{ row }")
          span {{ formatPrice(row.priceDiscount) }}
      el-table-column(label="备注", prop="remark")
        template(#default="{ row }")
          el-popover(v-if="row.remark", trigger="hover", placement="top-start")
            p(style="white-space: pre-wrap") {{ row.remark }}
            template(#reference)
              el-button(type="primary", link size="small") 查看
</template>

<script setup>
import { useListPage } from "@/provider/listPage"
import Decimal from "decimal.js"

const { fetch, message, router } = inject("global")
const { formatPrice } = inject("format")

const filter = ref({
  customer: "",
  createTimeRange: [],
})
const list = ref([])

function handleSearch() {
  fetch
    .get("/order/analysis/customer", {
      params: {
        ...filter.value,
        createTimeRange: filter.value.createTimeRange?.map((i) => i.getTime()) || [],
      },
    })
    .then((res) => {
      list.value = res?.list || []
    })
}

function handleReset() {
  filter.value.customer = ""
  filter.value.createTimeRange = []
  handleSearch()
}

function getSummary() {
  const count = `共 ${list.value.length} 条`
  const totalOrder = list.value
    .reduce((acc, cur) => acc.plus(new Decimal(cur.countOrder || 0)), new Decimal(0))
    .toNumber()+" 单"
  const totalBottle = list.value
    .reduce((acc, cur) => acc.plus(new Decimal(cur.countBottle || 0)), new Decimal(0))
    .toNumber()+" 瓶"
  const totalWeight = list.value.reduce((acc, cur) => acc.plus(cur.countWeight), new Decimal(0)).toNumber() + " Kg"
  const totalPriceTotal = formatPrice(
    list.value.reduce((acc, cur) => acc.plus(cur.priceTotal), new Decimal(0)).toNumber(),
  )
  const totalPriceReal = formatPrice(
    list.value.reduce((acc, cur) => acc.plus(cur.priceReal), new Decimal(0)).toNumber(),
  )
  const totalDiscount = formatPrice(
    list.value.reduce((acc, cur) => acc.plus(cur.priceDiscount), new Decimal(0)).toNumber(),
  )

  return ["", "合计", count, totalOrder, totalBottle, totalWeight, totalPriceTotal, totalPriceReal, totalDiscount, ""]
}

function handleExport() {
  ElMessageBox.confirm(`确定导出当前筛选条件下共 ${list.value.length} 条数据吗？`, "导出数据提示", {
    confirmButtonText: "确定导出",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    fetch
      .post("/order/analysis/customer", {
        ...filter.value,
        createTimeRange: filter.value.createTimeRange?.map((i) => i.getTime()) || [],
      })
      .then((res) => {
        if (res) {
          window.open(res)
        }
      })
  })
}

function jumpOrder(row) {
  router.push(
    `/order/list?customer=${row.customer._id}&&startTime=${filter.value.createTimeRange[0] || ""}&&endTime=${filter.value.createTimeRange[1] || ""}`,
  )
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
