<template lang="pug">
.page
  .container
    .title 钢瓶二维码制作说明
    p 钢瓶二维码内容为一个网页地址，通过手机扫描后，可直接打开网页；
    p 显示钢瓶流转相关信息等 ，规则如下：
    .section
      .left
        img(src="https://lpg.117915.com/lpg/SaasHTML5/images/Gascylinderbarcode.png")
        .desc 样本
      .right
        p
          .result https://homebrew.hnar.com/h/公司ID/钢瓶条码
          .btn 复制
        p 二维码规则说明：
        p 钢瓶条码：钢瓶条码流水号，每个条码具有唯一性
        p 当前登录公司ID：101926572037001000（从平台获取公司ID）
</template>

<script setup>
const { fetch, message, router } = inject("global")

const foo = ref("bar")
function handleClick() {}

onMounted(() => {})
</script>

<style lang="less" scoped>
.page {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.container {
  width: 800px;
  padding: 10px;
}
.section {
  display: flex;
  margin-top: 60px;
  .left {
    flex-basis: 50%;
  }
}
</style>
