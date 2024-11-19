<route lang="yaml">
meta:
  title: 押瓶配置
  pageId: guarantySetting
  categoryList:
    # - 客服中心/押瓶管理
</route>

<template lang="pug">
.page
  el-card
    el-form(label-width="6em")
      el-form-item(label="name")
        el-input(v-model="formData.name")
      el-form-item
        el-button(type="primary", @click="handleSubmit") 保存
</template>

<script setup>
const { fetch, message, router } = inject("global")

const formData = ref({
  _id: "",
})
function handleSubmit() {}
function getData() {}

onMounted(() => {
  getData()
})
</script>

<style lang="less" scoped>
.page {
  width: 100%;
}
</style>
