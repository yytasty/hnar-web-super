<template lang="pug">
yy-dialog(:modelValue="isShow", @close="handleClose", :title="'回单'", :show-close="true")
  .body
    #statement
      .row
        .col.col6 客户编号：{{ customerDetail.code }}
        .col.col6 客户名称：{{ customerDetail.name }}
      .row
        .col.col6 回单时间：
          el-date-picker(v-model="formData.successTime", type="datetime")
        .col.col6 付款方式：{{ formData?.payType }}
      .row(style="border-bottom: 1px solid #ccc")
        .col.col6 客户类型：{{ customerDetail.type }}
        .col.col6 优惠金额：{{ orderDetail.discountAmount }}
      el-table(:data="productList")
        el-table-column(label="商品", prop="productName")
        el-table-column(label="净重", prop="weight", width="60px")
        el-table-column(label="数量", prop="num", width="60px")
        el-table-column(label="单价", prop="price", width="80px")
        el-table-column(label="送气费", prop="deliveryPrice", width="80px")
        el-table-column(label="楼层费", prop="floorPrice", width="80px")
        el-table-column(label="应收金额", prop="totalPrice", width="80px")
        el-table-column(label="实收金额", width="100px")
          template(#default="{ row }")
            el-input-number(v-model="row.actualAmount", :controls="false", style="width: 70px")
      div(style="padding: 10px")
        el-button(type="primary", size="small", @click="handleSubmit", :loading="successLoading") 保存
        el-button(type="success", size="small", @click="handlePrint", :loading="successLoading") 打印
        el-button(type="primary", size="small", @click="handleSubmitAndPrint", :loading="successLoading") 保存并打印

//- yy-dialog(:modelValue="isShowPrint", width="90%", :title="''", top="0", :show-close="false")
//-   .body(style="margin: -16px; font-size: 10px")
//-     #statement
//-       .row
//-         .col.col12 客户编号：{{ customerDetail.code }}
//-       .row
//-         .col.col12 客户名称：{{ customerDetail.name }}
//-       .row
//-         .col.col12 回单时间：{{ formatTime(formData.successTime) }}
//-       table(border="1", style="width: 100%; text-align: center")
//-         tr
//-           th 商品
//-           th 净重
//-           th 单价
//-           th 数量
//-           th 金额
//-         tr(v-for="item in productList")
//-           td {{ item.productName }}
//-           td {{ item.weight }}
//-           td {{ item.price }}
//-           td {{ item.num }}
//-           td {{ item.totalPrice }}
//-         tr
//-           td(colspan="3") 合计
//-           td {{ Math.floor(productList.reduce((a, b) => a + b.num, 0)) }}
//-           td {{ productList.reduce((a, b) => a + b.totalPrice, 0).toFixed(1) }}
//-       .row
//-         .col.col12 实收金额：{{ productList.reduce((a, b) => a + b.actualAmount, 0).toFixed(1) }}
//-       .row
//-         .col.col12 开票员：{{ accountInfo?.name }}
//-       .row
//-         .col.col12 款到开票 &nbsp;&nbsp;&nbsp;&nbsp; 当日有效
</template>

<script setup>
import { accountInfo, companyInfo } from "@/provider/account"
import { courierList, ensureCacheData } from "@/provider/cache"
import Decimal from "decimal.js"

const { fetch, message, router } = inject("global")
const { formatTime } = inject("format")

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
  orderId: {
    type: String,
    default: "",
  },
})
const emits = defineEmits(["update:isShow", "success"])

function handleClose() {
  emits("update:isShow", false)
}

const formData = ref({
  successTime: new Date(),
  payType: "",
})
const productList = ref([])
const orderDetail = ref({})
const customerDetail = ref({})

const isShowPrint = ref(false)
const successLoading = ref(false)

function handlePrint() {
  localStorage.setItem(
    "printOrderInfo",
    JSON.stringify({
      accountInfo: accountInfo.value,
      formData: formData.value,
      productList: productList.value,
      customerDetail: customerDetail.value,
      orderDetail: orderDetail.value,
    }),
  )
  window.open("/print")
}

function handleSubmitAndPrint() {
  successLoading.value = true
  fetch
    .put(`/order/${props.orderId}/success`, { ...formData.value, productActualAmountList: productList.value })
    .then(() => {
      handlePrint()
    })
    .catch((e) => {
      message.error(e.message || e.msg || e || "操作失败")
    })
    .finally(() => {
      successLoading.value = false
    })
}
function handleSubmit() {
  successLoading.value = true
  fetch
    .put(`/order/${props.orderId}/success`, { ...formData.value, productActualAmountList: productList.value })
    .then(() => {
      message.success("操作成功")
      emits("success")
      handleClose()
    })
    .catch((e) => {
      message.error(e.message || e.msg || e || "操作失败")
    })
    .finally(() => {
      successLoading.value = false
    })
}

function getData() {
  fetch.get(`/order/${props.orderId}`).then(async (res) => {
    productList.value = res.productList.map((v) => {
      return {
        ...v,
        actualAmount: v.totalPrice,
      }
    })
    orderDetail.value = res
    customerDetail.value = await fetch.get(`/customer/${res.customer?._id || res.customer}`)
    formData.value.payType = res.customerInfo?.payType || "线下付款"
  })
}

watch(
  () => props.orderId,
  (val) => {
    if (val && props.isShow) {
      getData()
    }
  },
)

watch(
  () => props.isShow,
  (val) => {
    if (val) {
      isShowPrint.value = false
    }
  },
)

onBeforeMount(() => {
  ensureCacheData("courierList")
})
onMounted(() => {})
</script>

<style lang="less" scoped>
#statement {
  --borderColor: #ccc;
  border: 1px dashed var(--borderColor);
  .title {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    flex-grow: 1;
    padding: 10px;
  }
  .row {
    display: flex;
    align-items: center;
    width: 100%;
    border-top: 1px solid var(--borderColor);
    border-left: 1px solid var(--borderColor);
    box-sizing: content-box;
  }
  .col {
    padding: 6px 10px;
    border-right: 1px solid var(--borderColor);
    box-sizing: content-box;
    &.col1 {
      flex-basis: calc(1 / 12 * 100%);
    }
    &.col2 {
      flex-basis: calc(2 / 12 * 100%);
    }
    &.col4 {
      flex-basis: calc(4 / 12 * 100%);
    }
    &.col5 {
      flex-basis: calc(5 / 12 * 100%);
    }
    &.col6 {
      flex-basis: calc(6 / 12 * 100%);
    }
    &.col12 {
      flex-basis: calc(12 / 12 * 100%);
    }
  }
  .table {
    margin: 10px 0;
    padding: 10px;
    background-color: #eee;
  }
  .tableSummary {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
