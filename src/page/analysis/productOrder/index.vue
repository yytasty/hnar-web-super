<route lang="yaml">
meta:
  title: 商品销售统计
  pageId: productOrderAnalysis
  categoryList:
    - 报表中心
</route>

<template lang="pug">
.page
  el-card
    el-form(inline)
      el-form-item(label="商品类型")
        yy-productTypeSelect(v-model="filter.productType", @change="handleSearch")
      el-form-item(label="商品")
        yy-productSelect(
          v-model="filter.productList",
          :productType="filter.productType",
          @change="handleSearch",
          :multiple="true"
        )
      el-form-item(label="客户")
        yy-customerSelect(v-model="filter.customer", @change="handleSearch")
      el-form-item(label="订单创建人")
        el-select(v-model="filter.operator", style="width: 300px")
          el-option(label="全部" value="")
          el-option(
            v-for="item in operatorList",
            :key="item._id",
            :label="`${item.name}`",
            :value="item._id"
          )
      el-form-item(label="时间")
        yy-dateRange(v-model="filter.createTimeRange", @change="handleSearch")
      el-form-item
        el-button(type="primary", style="width: 200px", @click="handleSearch") 查询
      el-form-item
        el-button(type="warning", plain, @click="handleReset") 重置
        el-button(type="success", plain, @click="handleExport") 导出
  el-card(v-loading="loading")
    el-table(:data="list", show-summary, :summary-method="getSummary")
      el-table-column(label="商品编号", prop="productCode", fixed="left")
      el-table-column(label="商品名称", prop="productName", fixed="left")
      el-table-column(label="销售日期", prop="createTime")
        template(#default="{ row }")
          span {{ formatDate(row.createTime) }}
      el-table-column(label="客户编号", prop="customer.code")
      el-table-column(label="客户名称", prop="customer.name")
      el-table-column(label="商品规格", prop="productSpecificName")
      el-table-column(label="单位", prop="productUnit")
      el-table-column(label="单价", prop="price")
      el-table-column(label="数量", prop="num")
      el-table-column(label="净重", prop="weight")
        template(#default="{ row }")
          span {{ row.weight || "" }}
      el-table-column(label="总重", prop="totalWeight")
        template(#default="{ row }")
          span {{ row.weight || "" }}
      el-table-column(label="应收金额", prop="totalPrice")
        template(#default="{ row }")
          span {{ formatPrice(row.totalPrice) }}
      el-table-column(label="配送费", prop="deliveryPrice")
        template(#default="{ row }")
          span {{ formatPrice(row.deliveryPrice) }}
      el-table-column(label="楼层费", prop="floorPrice")
        template(#default="{ row }")
          span {{ formatPrice(row.floorPrice) }}
      el-table-column(label="备注", prop="remark")
        template(#default="{ row }")
          el-popover(v-if="row.remark", trigger="hover", placement="top-start")
            p(style="white-space: pre-wrap") {{ row.remark }}
            template(#reference)
              el-button(type="primary", link size="small") 查看
</template>

<script setup>
import Decimal from "decimal.js"

const { fetch, message, router } = inject("global")
const { formatTime, formatDate, formatPrice } = inject("format")

const filter = ref({
  productList: [],
  customer: "",
  operator: "",
  productType: "",
  createTimeRange: [],
})
const list = ref([])

const loading = ref(false)
function handleSearch() {
  loading.value = true
  fetch
    .get("/order/analysis/product", {
      params: {
        ...filter.value,
        createTimeRange: filter.value.createTimeRange?.map((i) => i.getTime()) || [],
      },
    })
    .then((res) => {
      list.value = res?.list || []
    })
    .catch((e) => {
      console.log(e)
    })
    .finally(()=>{
      loading.value = false
    })
}

function getSummary() {
  const count = `共 ${list.value.length} 条`
  const totalNum = list.value.reduce((acc, cur) => acc + cur.num, 0) + " 个"
  const totalWeight = list.value.reduce((acc, cur) => acc.plus(cur.totalWeight || 0), new Decimal(0)) + " Kg"
  const totalPrice = formatPrice(list.value.reduce((acc, cur) => acc.plus(cur.totalPrice), new Decimal(0)).toNumber())
  const totalDeliveryPrice = formatPrice(
    list.value.reduce((acc, cur) => acc.plus(cur.deliveryPrice || 0), new Decimal(0)).toNumber(),
  )
  const totalFloorPrice = formatPrice(
    list.value.reduce((acc, cur) => acc.plus(cur.floorPrice || 0), new Decimal(0)).toNumber(),
  )
  return [
    "合计",
    count,
    "",
    "",
    "",
    "",
    "",
    "",
    totalNum,
    "",
    totalWeight,
    totalPrice,
    totalDeliveryPrice,
    totalFloorPrice,
    "",
  ]
}

function handleReset() {
  filter.value.product = ""
  filter.value.customer = ""
  filter.value.createTimeRange = []
  handleSearch()
}

function handleExport() {
  ElMessageBox.confirm(`确定导出当前筛选条件下共 ${list.value.length} 条数据吗？`, "导出数据提示", {
    confirmButtonText: "确定导出",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    fetch
      .post(
        "/order/analysis/product",
        {},
        {
          params: {
            ...filter.value,
            createTimeRange: filter.value.createTimeRange?.map((i) => i.getTime()) || [],
          },
        },
      )
      .then((res) => {
        if (res) {
          window.open(res)
        }
      })
  })
}

// 获取操作人列表
const operatorList = ref([])
function getOperator(){
  fetch.get(
        "/order/analysis/operator",
      )
      .then((res) => {
        operatorList.value = res
      })
}

onMounted(() => {
  handleReset()
  getOperator()
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
