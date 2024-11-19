<template lang="pug">
el-tag(v-if="status" :type="tagType") {{ status }}
</template>

<script setup>
const props = defineProps({
  status: {
    type: String,
    default: "",
  },
})
const emits = defineEmits(["update:isShow"])

const tagType = computed(() => {
  if (props.status === "待处理") {
    return "primary"
  } else if (props.status === "已完成") {
    return "success"
  } else if (props.status === "已作废") {
    return "danger"
  } else {
    return "info"
  }
})
</script>
