<template lang="pug">
yy-dialog(:modelValue="isShow", @close="handleClose", title="查看原始数据")
  .body
    .debug {{ currentConfigValue }}
  template(#footer) 
    el-button(type="primary", @click="handleClose") 确定
</template>

<script setup>
const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits(["update:isShow"])

function handleClose() {
  emits("update:isShow", false)
}

const currentConfigValue = inject("currentConfigValue")
</script>

<style lang="less" scoped>
.componentContainer {
  width: 100%;
}
</style>
