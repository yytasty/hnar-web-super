<template lang="pug">
el-popover(v-if="customerInfo?._id")
  template(#reference)
    .accountChip(:class="computedClass")
      .avatar(v-if="displayAvatarUrl", v-bg.cover="displayAvatarUrl")
      .name {{ customerInfo.name || customerInfo._id }}
  template(#default)
    el-descriptions(:column="1")
      el-descriptions-item(label="ID") {{ customerInfo._id }}
      el-descriptions-item(label="手机") {{ customerInfo.phone }}
      el-descriptions-item(label="类型") {{ customerInfo.type }}
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
const customerInfo = computed(() => _detail.value || props.detail || {})

function getData() {
  if (!props.isAutoSync) return
  if (!props.detail) return
  fetch.get(`/customer/${props.detail?._id || props.detail}`).then((res) => {
    _detail.value = { ...res }
    syncAvatar()
  })
}

const displayAvatarUrl = ref("")
function syncAvatar() {
  if (!customerInfo.value?.avatar) return
  if (!customerInfo.value?.avatar.includes("hnar")) {
    displayAvatarUrl.value = customerInfo.value?.avatar
    return
  }
  fetch.get("/upload/signedUrl", { params: { url: customerInfo.value?.avatar } }).then((res) => {
    displayAvatarUrl.value = res
  })
}

watch(
  () => props.detail,
  (val) => {
    if (props.detail && !props.detail?._id) {
      getData()
    } else {
      syncAvatar()
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
  }
}
</style>
