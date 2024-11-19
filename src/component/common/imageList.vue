<template lang="pug">
.imageList
  ComImage(v-for="i in modelValue", :src="i", :size="size", :fit="fit")
</template>

<script setup>
import ComImage from "./image.vue"
const props = defineProps({
  modelValue: {
    type: Array,
    default: [],
  },
  size: {
    type: String,
    default: '100px',
  },
  fit: {
    type: String,
    default: "cover",
  },
})
</script>

<style lang="less" scoped>
.imageList {
  display: inline-flex;
  flex-wrap: wrap;
}
</style>
