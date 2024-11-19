<template lang="pug">
el-form(label-width="6em")
  el-form-item(label="单位名称", required) 
    el-input(v-model="formData.name")
  el-form-item(label="单位编号", required) 
    el-input(v-model="formData.code")
  el-form-item(label="单位简称", required)
    el-input(v-model="formData.shortName")
</template>

<script setup>
const { fetch, message, router } = inject("global")

const formData = ref({
  name: "",
  code: "",
  shortName: "",
})

onMounted(() => {})
</script>

<style lang="less" scoped>
.componentContainer {
  width: 100%;
}
</style>
