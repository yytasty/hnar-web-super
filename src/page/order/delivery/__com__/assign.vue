<template lang="pug">
yy-dialog(:modelValue="isShow", @close="handleClose", :title="showPrint ? '' : '派工'", :show-close="!showPrint")
  .body
    #statement
      .title {{ deliveryDetail.company?.name || companyInfo.name }}配送单
      .row
        .col 订单编号：{{ orderDetail.code }}
      .row
        .col.col6 客户编号：{{ customerDetail._id }}
        .col.col6 订气时间：{{ formatTime(deliveryDetail.createTime) }}
      .row
        .col.col2 客户：{{ customerDetail.name }}
        .col.col5 电话：{{ customerDetail.phone }}
        .col.col5 配送员：{{ deliveryDetail.courier }}
      .row
        .col.col6 付款方式：{{ orderDetail.payType }}
        .col.col6 支付状态：{{ orderDetail.payStatus }}
      .row
        .col 客户地址：{{ customerDetail.addressInfo?.address }}
      .table
        el-table(:data="orderDetail.productList")
          el-table-column(label="商品名称", prop="productName")
          el-table-column(label="数量", prop="num")
          el-table-column(label="价格", prop="price")
          el-table-column(label="楼层价", prop="floorPrice")
      .tableSummary
        .col 总金额：{{ orderDetail.totalPrice }}
      .row
        .col 重瓶号：
      .row
        .col 轻瓶号：
      .row
        .col 备注：尊敬的用户请注意安全用气
      .row
        .col.col2 购买燃气险：
        .col
          el-radio-group(v-model="formData.isInsurance")
            el-radio(value="是") 是
            el-radio(value="否") 否
      .row
        .col.col2 钢瓶试漏情况：
        .col
          el-radio-group(v-model="formData.isDetect")
            el-radio(value="已试漏合格") 已试漏合格
            el-radio(value="不要求试漏") 不要求试漏
      .row
        .col.col2 开票员：{{ accountInfo.name }}
        .col.col5 门店：{{ accountInfo.name }}
        .col.col5 客户签收：____________
    el-form(style="margin-top: 20px")
      el-form-item(label="客户性质") {{ customerDetail.quality }}
      el-form-item(label="配送员") 
        span(v-if="showPrint") {{ courierList?.find?.((v) => v._id == formData.courier)?.name }}
        el-select(v-model="formData.courier", v-else, style="width: 300px")
          el-option(v-for="item in courierList", :label="item.name", :value="item._id")
      el-form-item(label="")
        el-button(type="primary", @click="handleSubmit", v-if="!showPrint") 保存
        el-button(type="primary", @click="handleSubmitAndPrint", v-if="!showPrint") 保存并打印
</template>

<script setup>
import { accountInfo, companyInfo } from "@/provider/account"
import { courierList, ensureCacheData } from "@/provider/cache"

const { fetch, message, router } = inject("global")
const { formatTime } = inject("format")

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
  deliveryId: {
    type: String,
    default: "",
  },
})
const emits = defineEmits(["update:isShow", "success"])

function handleClose() {
  emits("update:isShow", false)
}

const formData = ref({
  courier: "",
})
const orderDetail = ref({})
const deliveryDetail = ref({})
const customerDetail = ref({})
const showPrint = ref(false)
function handleSubmitAndPrint() {
  fetch.post(`/delivery/${props.deliveryId}/assign`, formData.value).then(() => {
    message.success("操作成功")
    // const printHtml = document.getElementById("statement").innerHTML
    // const newWindow = window.open()
    // newWindow.document.body.innerHTML = printHtml
    showPrint.value = true
    setTimeout(() => {
      window.print()
      emits("success")
      handleClose()
    }, 100)
  })
}
function handleSubmit() {
  fetch.post(`/delivery/${props.deliveryId}/assign`, formData.value).then(() => {
    message.success("操作成功")
    emits("success")
    handleClose()
  })
}

function getData() {
  fetch.get(`/delivery/${props.deliveryId}`).then((res) => {
    orderDetail.value = res.order
    deliveryDetail.value = res.delivery
    customerDetail.value = res.customer
  })
}

watch(
  () => props.isShow,
  (val) => {
    if (val) {
      getData()
      showPrint.value = false
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
    padding: 3px 10px;
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
