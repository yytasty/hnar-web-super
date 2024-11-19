<template lang="pug">
.list
  el-card(shadow="hover", body-class="card1")
    el-icon
      ShoppingCartFull
    .cardContent
      yy-countUp.num(:end="summaryData.orderCount || 0")
      span 今日订单量
  el-card(shadow="hover", body-class="card2")
    el-icon
      ShoppingCartFull
    .cardContent
      yy-countUp.num(:end="summaryData.customerCount || 0")
      span 今日新增客户
  el-card(shadow="hover", body-class="card3")
    el-icon
      ShoppingCartFull
    .cardContent
      yy-countUp.num(:end="summaryData.bottleCount || 0")
      span 今日新增气瓶
  el-card(shadow="hover", body-class="card4")
    el-icon
      ShoppingCartFull
    .cardContent
      yy-countUp.num(:end="summaryData.guarantyCount || 0")
      span 今日押瓶数
</template>

<script setup>
const { fetch, message, router } = inject("global")

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits(["update:isShow"])

const summaryData = ref({
  orderCount: 0,
  customerCount: 0,
  bottleCount: 0,
  guarantyCount: 0,
})

async function getData() {
  summaryData.value = await fetch.get("/statistics/todayStatistics")
}

onMounted(() => {
  getData()
})
</script>

<style lang="less" scoped>
.list {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.el-card {
  --color: #2d8cf0;
  min-width: 300px;
  &:deep(.card1),
  &:deep(.card2),
  &:deep(.card3),
  &:deep(.card4) {
    display: flex;
    align-items: center;
    height: 100px;
    padding: 0;
    .cardContent {
      flex: 1;
      text-align: center;
      font-size: 14px;
      color: #999;
      padding: 0 20px;
      display: flex;
      flex-direction: column;
      .num {
        font-size: 30px;
        color: var(--color);
      }
    }
    .el-icon {
      font-size: 50px;
      width: 100px;
      height: 100px;
      text-align: center;
      line-height: 100px;
      color: #fff;
      background: var(--color);
    }
  }
  &:deep(.card1) {
    --color: #2d8cf0;
  }
  &:deep(.card2) {
    --color: #64d572;
  }
  &:deep(.card3) {
    --color: #f25e43;
  }
  &:deep(.card4) {
    --color: #e9a745;
  }
}
</style>
