<template lang="pug">
.componentContainer
  el-form
    el-form-item(label="公司签章")
      yy-imageListUpload(v-model="currentConfigValue.signatureImage", :limit="1" :multiple="false")
</template>

<script setup>
import { computed, inject, onMounted, ref } from "vue"

const { fetch, message, router } = inject("global")

const currentConfigValue = inject("currentConfigValue", {
  signatureImage: "",
})

watch(
  () => currentConfigValue.value,
  (val) => {
    if (!currentConfigValue.value?.signatureImage) {
      currentConfigValue.value.signatureImage = ""
    }
  },
  { immediate: true },
)
</script>

<style lang="less" scoped>
.componentContainer {
  width: 100%;
}
</style>
