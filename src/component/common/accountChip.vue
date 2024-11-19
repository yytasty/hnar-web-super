<template lang="pug">
el-popover(v-if="accountInfo?._id", width="240px")
  template(#reference)
    .accountChip(:class="computedClass")
      yy-image.avatar(v-if="accountInfo.avatar", :src="accountInfo.avatar", size="30px")
      .name {{ accountInfo.name || accountInfo._id }}
  template(#default)
    el-descriptions(:column="1")
      el-descriptions-item(label="ID") 
        .idContent {{ accountInfo._id }}
      el-descriptions-item(label="编号") {{ accountInfo.code }}
      el-descriptions-item(label="账号类型", v-if="accountInfo.type") {{ accountInfo.type }}
      el-descriptions-item(label="员工类型", v-if="roleList") {{ roleList }}
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
const accountInfo = computed(() => _detail.value || props.detail || {})

const roleList = computed(() => accountInfo.value?.roleList?.map((i) => i?.name)?.join(", "))

function getData() {
  if (!props.isAutoSync) return
  if (!props.detail) return
  fetch.get(`/customer/${props.detail?._id || props.detail}`).then((res) => {
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
  border-radius: var(--size);
  border: 1px solid var(--color-border);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  min-width: 80px;
  .avatar {
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    background-color: var(--color-background);
  }
  .name {
    padding: 0 10px;
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
