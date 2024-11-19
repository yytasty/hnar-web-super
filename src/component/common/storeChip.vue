<template lang="pug">
el-popover(v-if="storeInfo?._id", width="240px")
  template(#reference)
    .accountChip(:class="computedClass")
      .name {{ storeInfo.name || storeInfo._id }}
  template(#default)
    el-descriptions(:column="1")
      el-descriptions-item(label="ID") 
        .idContent {{ storeInfo._id }}
      el-descriptions-item(label="编号") {{ storeInfo.code }}
      el-descriptions-item(label="类型", v-if="storeInfo.storeType") {{ storeInfo.storeType }}
</template>

<script setup>
const props = defineProps({
  detail: {
    type: [Object, String],
    default: null,
  },
  size: {
    type: String,
    default: "small",
  },
  isAutoSync: {
    type: Boolean,
    default: true,
  },
})
const computedClass = computed(() => {
  return {
    sizeSmall: props.size === "small",
    sizeLarge: props.size === "large",
  }
})
const _detail = ref(null)
const storeInfo = computed(() => _detail.value || props.detail || {})

function getData() {
  if (!props.isAutoSync) return
  const id = props.detail?._id || props.detail
  if (!id) return
  fetch.get(`/store/${id}`).then((res) => {
    _detail.value = { ...res }
  })
}

watch(
  () => props.detail,
  (val) => {
    if (props.detail && !props.detail?._id) {
      getData()
    }
  },
  { immediate: true },
)
</script>

<style lang="less" scoped>
.accountChip {
  --size: 30px;
  display: inline-flex;
  align-items: center;
  background-color: white;
  border-radius: 5px;
  border: 1px solid var(--color-border);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  min-width: 80px;
  .name {
    padding: 0 5px;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    white-space: nowrap;
    text-align: center;
    flex-grow: 1;
    color: #777;
  }
}
.idContent {
  font-size: 12px;
  word-break: keep-all;
  display: inline-block;
  color: #999;
}
</style>
