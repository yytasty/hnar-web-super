<template lang="pug">
el-form(label-width="10em")
  el-form-item(label="appId", required) 
    el-input(v-model="formData.appId")
  el-form-item(label="appSecret", required) 
    el-input(v-model="formData.appSecret")
  el-divider
  el-form-item(label="contact secret", required) 
    el-input(v-model="formData.appSecret")
</template>

<script setup>
const { fetch, message, router } = inject("global")

const formData = ref({
  appId: "",
  appSecret: "",
})

onMounted(() => {})
</script>

<style lang="less" scoped>
.componentContainer {
  width: 100%;
}
</style>
