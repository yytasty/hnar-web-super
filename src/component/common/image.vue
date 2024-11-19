<template lang="pug">
el-image(
  :src="displayUrl || src",
  :style="computedStyle",
  :fit="fit",
  :preview-src-list="[displayUrl]",
  :preview-teleported="true"
)
</template>

<script setup>
const props = defineProps({
  src: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "100px",
  },
  width: {
    type: String,
    default: "",
  },
  height: {
    type: String,
    default: "",
  },
  fit: {
    type: String,
    default: "cover",
  },
})

const emits = defineEmits(["update:src"])

const displayUrl = ref(props.src)

const computedStyle = computed(() => {
  if (!props.width && !props.height) {
    return {
      width: `${props.size}`,
      height: `${props.size}`,
    }
  }
  return {
    width: `${props.width}`,
    height: `${props.height}`,
  }
})

watch(
  () => props.src,
  (val) => {
    if (!props.src) return
    fetch.get("/upload/signedUrl", { params: { url: props.src } }).then((res) => {
      displayUrl.value = res
    })
  },
  { immediate: true },
)
</script>
