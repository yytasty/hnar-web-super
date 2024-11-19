<route lang="yaml">
meta:
  title: 坐席工作台
  pageId: workspace
  order: -1
  categoryList:
    - 客服中心
</route>

<template lang="pug">
.page
  .left
    ComCustomerPanel
    el-card
      el-tabs(v-model="currentTab", type="card")
        el-tab-pane(v-for="i in tabList", :label="i.name", :name="i.name")
          component(v-if="customerInfo?._id", :is="i.com")
          span(v-else) 请先选择客户再继续操作
  .right(v-if="customerInfo?._id")
    ComCustomerInfo
    ComOrderLog
    ComGuarantyInfo
</template>

<script setup>
import ComComplaint from "./__com__/complaint.vue"
import ComConsult from "./__com__/consult.vue"
import ComCustomerInfo from "./__com__/customerInfo.vue"
import ComGuarantyInfo from "./__com__/guarantyInfo.vue"
import ComCustomerPanel from "./__com__/customerPanel.vue"
import ComGuaranty from "./__com__/guaranty.vue"
import ComOrder from "./__com__/order.vue"
import ComOrderLog from "./__com__/orderLog.vue"
import ComRefund from "./__com__/refund.vue"
import ComRepair from "./__com__/repair.vue"

import { useRouteQuery } from "@vueuse/router"

const { fetch, message, router } = inject("global")

const queryTab = useRouteQuery("tab", "下单", { transform: String })

const customerInfo = ref({})

provide("customerInfo", customerInfo)

const currentTab = ref("下单")
const tabList = shallowRef([
  { name: "下单", com: ComOrder },
  { name: "报修", com: ComRepair },
  { name: "投诉", com: ComComplaint },
  { name: "退瓶", com: ComRefund },
  { name: "咨询", com: ComConsult },
  { name: "押瓶", com: ComGuaranty },
])
const currentCom = computed(() => tabList.value?.find((i) => i.tab == currentTab.value)?.com)

watch(
  () => queryTab.value,
  () => {
    currentTab.value = queryTab.value
  },
  { immediate: true },
)
</script>

<style lang="less" scoped>
.page {
  display: flex;
  align-items: flex-start;
  --right-width: 400px;
  .left {
    flex-shrink: 0;
    width: calc(100% - var(--right-width) - 45px);
    flex-grow: 1;
    max-width: 1600px;
    margin-right: 15px;
  }
  .right {
    flex-shrink: 0;
    width: var(--right-width);
    margin-right: 30px;
    display: flex;
    flex-direction: column;
    overflow: auto;
  }
}
</style>
