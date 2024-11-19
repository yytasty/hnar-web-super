<route lang="yaml">
meta:
  title: 订单
  pageId: orderList
  order: 2
  categoryList:
    - 客服中心/订单管理
    - 销售管理/订单管理
</route>

<template lang="pug">
.page
  el-card
    el-form(inline, label-width="6em")
      yy-multipleTypeFilter(v-model:filter="filter", :filterTypeList="filterTypeList", @search="handleSearch")
      el-form-item(label="客户")
        yy-customerSelect(v-model="filter.customer", @change="handleSearch")
      el-form-item(label="门店")
        yy-storeSelect(v-model="filter.store", @change="handleSearch")
      el-form-item(label="付款方式")
        el-select.value(v-model="filter.payType", clearable, @change="handleSearch", @clear="handleSearch")
          el-option(label="全部", value="")
          el-option(v-for="item in customerPayTypeList", :label="item", :value="item")
      el-form-item(label="创建时间")
        yy-dateRange(v-model="filter.createTimeRange", @change="handleSearch")
      el-form-item(label="配送方式")
        el-select.value(v-model="filter.isTakeTheir", clearable, @change="handleSearch", @clear="handleSearch")
          el-option(label="全部", value="")
          el-option(label="配送", :value="false")
          el-option(label="自提", :value="true")
      el-form-item(label="订单状态")
        el-select.value(v-model="filter.status", clearable, @change="handleSearch", @clear="handleSearch")
          el-option(label="全部", value="")
          el-option(v-for="i in orderStatusList", :label="i", :value="i")
      el-form-item(label="订单来源")
        el-select.value(v-model="filter.source", clearable, @change="handleSearch", @clear="handleSearch")
          el-option(label="全部", value="")
          el-option(v-for="i in orderSourceList", :label="i", :value="i")
      el-form-item
        el-button(type="primary", @click="handleSearch") 查询
        el-button(type="warning", plain, @click="handleReset") 重置
  el-card
    el-table(:data="list")
      el-table-column(type="expand", fixed="left")
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
              el-table-column(label="净重", prop="weight")
              el-table-column(label="配送费", prop="deliveryPrice")
              el-table-column(label="楼层费", prop="floorPrice")
      el-table-column(label="订单编号", prop="code", fixed="left")
      el-table-column(label="客户", prop="customer", fixed="left")
        template(#default="{ row }")
          yy-customerChip(:detail="row.customer")
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
      el-table-column(label="付款方式", prop="payType")
      el-table-column(label="支付状态", prop="payStatus")
      el-table-column(label="创建时间", prop="createTime")
        template(#default="{ row }")
          span {{ formatTime(row.createTime) }}
      el-table-column(label="操作", width="150px", fixed="right")
        template(#default="{ row }")
          el-button(v-if="row.payStatus != '支付成功'", type="success", plain, size="small", @click="handleSuccess(row)") 回单
          el-dropdown(@command="onCommand($event, row)")
            el-button(type="primary", size="small", style="margin-left: 20px") 更多
            template(#dropdown)
              el-dropdown-menu
                el-dropdown-item(command="编辑", :disabled="['已完成', '已配送', '已作废'].includes(row.status)") 编辑
                el-dropdown-item(command="作废", v-if="row.status !== '已作废'") 作废
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

ComEdit(v-model:isShow="isShowEdit", :orderId="currentEditId", @success="getList")
ComSuccess(v-model:isShow="isShowSuccess", :orderId="currentEditId", @success="getList")
</template>

<script setup>
import { customerPayTypeList, orderSourceList, orderStatusList } from "@/provider/dict"
import { useRoute } from "vue-router"
import { useListPage } from "@/provider/listPage"
import ComEdit from "./__com__/edit.vue"
import ComSuccess from "./__com__/success.vue"
import { dayjs } from "element-plus"

const { fetch, message, router } = inject("global")
const { formatTime, formatPrice } = inject("format")

const { list, pagination, filter, getList, handleSearch, handleReset } = useListPage({
  url: "/order",
  filter: {
    _id: "",
    code: "",
    customer: "",
    store: "",
    payType: "",
    createTimeRange: [dayjs().startOf("day").toDate(), dayjs().endOf("day").toDate()],
    isTakeTheir: "",
    status: "",
  },
})

const filterTypeList = ref([
  { label: "编号", value: "code" },
  { label: "ID", value: "_id" },
])

const isShowSuccess = ref(false)
const isShowEdit = ref(false)
const currentEditId = ref("")
// 点击回单
function handleSuccess(row) {
  isShowSuccess.value = true
  currentEditId.value = row._id
}

function onCommand(command, row) {
  currentEditId.value = row._id
  switch (command) {
    case "编辑":
      isShowEdit.value = true
      break
    case "作废":
      fetch.put(`/order/${row._id}/cancel`).then(() => {
        message.success("操作成功")
        getList()
      })
      break
  }
}

onMounted(() => {
  const route = useRoute()
  if(route.query.customer){
    filter.value.customer = route.query.customer
    filter.value.createTimeRange = []
    if(route.query.startTime && route.query.endTime){
      filter.value.createTimeRange = [route.query.startTime,route.query.endTime]
    }
  }
  handleSearch()
})
</script>

<style lang="less" scoped>
.el-table {
  height: calc(100vh - 250px);
}
</style>
