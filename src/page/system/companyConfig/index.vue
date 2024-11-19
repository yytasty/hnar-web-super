<route lang="yaml">
meta:
  title: 公司配置
  pageId: companyConfig
  order: 10
  categoryList:
    - 系统管理/其它配置
</route>

<template lang="pug">
.page
  el-card(header="公司配置")
    el-tabs
      el-tab-pane(label="基础资料")
        ComProfile
      el-tab-pane(label="微信公众号")
        ComWeixin
      el-tab-pane(label="企业微信")
        ComWeixinWork
</template>

<script setup>
import ComProfile from "./__com__/profile.vue"
import ComWeixin from "./__com__/weixin.vue"
import ComWeixinWork from "./__com__/weixinWork.vue"

const { fetch, message, router } = inject("global")

const companyInfo = ref("bar")
function handleClick() {}

onMounted(() => {})
</script>

<style lang="less" scoped>
.page {
  width: 100%;
}
</style>
