<route lang="yaml">
meta:
  layout: blank
  title: 登录
  isPass: true
</route>

<template lang="pug">
.printOrder(style="font-size: 10px")
  #statement
    .row
      .col.col12 客户编号：{{ info.customerDetail.code }}
    .row
      .col.col12 客户名称：{{ info.customerDetail.name }}
    .row
      .col.col12 回单时间：{{ formatTime(info.formData.successTime) }}
    table(border="1", style="width: 100%; text-align: center")
      tr
        th 商品
        th 净重
        th 单价
        th 数量
        th 金额
      tr(v-for="item in info.productList")
        td {{ item.productName }}
        td {{ item.weight }}
        td {{ item.price }}
        td {{ item.num }}
        td {{ item.totalPrice }}
      tr
        td(colspan="3") 合计
        td {{ Math.floor(info.productList.reduce((a, b) => a + b.num, 0)) }}
        td {{ info.productList.reduce((a, b) => a + b.totalPrice, 0).toFixed(1) }}
    .row
      .col.col12 优惠金额：{{ info.orderDetail.discountAmount }}
      .col.col12 实收金额：{{ (info.productList.reduce((a, b) => a + b.actualAmount, 0) - info.orderDetail.discountAmount).toFixed(1) }}
    .row
      .col.col12 开票员：{{ info.accountInfo?.name }}
    .row
      .col.col12 款到开票 &nbsp;&nbsp;&nbsp;&nbsp; 当日有效
</template>

<script setup>
const { router, message } = inject("global")
const { formatTime } = inject("format")

let info = ref({ customerDetail: {}, formData: {}, productList: [], accountInfo: {}, orderDetail: {discountAmount:0} })

onMounted(() => {
  info.value = JSON.parse(localStorage.getItem("printOrderInfo"))
  document.querySelector('html').style = 'height: auto; width:60mm'
  document.querySelector('body').style = 'height: auto; width:60mm'
  document.querySelector('#app').style = 'height: auto; width:60mm'
  nextTick(() => {
    const style = document.createElement('style');
    const contentHeight = document.querySelector('body').offsetHeight;
    // size: 60mm ${60 + info.value.productList.length * 4}mm; /* 自定义的宽高 */
    style.innerHTML = `
        @page {
            size: 60mm ${contentHeight}px; /* 自定义的宽高 */
            margin: 0; /* 可根据需求调整边距 */
            padding: 0;  /* 可根据需求调整边距 */
            font-size: 10px;
        }
    `;
    document.head.appendChild(style);
    window.addEventListener('afterprint', function() {
      window.close();
    });
    window.print()
  })
})
</script>

<style lang="less" scoped>
#statement {
  --borderColor: #ccc;
  border: 1px solid black;
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
    border-top: 1px solid black;
    border-left: 1px solid black;
    box-sizing: content-box;
  }
  .col {
    padding: 6px 10px;
    border-right: 1px solid black;
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
