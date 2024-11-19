<template lang="pug">
el-select(
  :modelValue="modelValue?._id || modelValue",
  clearable,
  filterable,
  remote,
  :remote-method="searchList",
  placeholder="输入关键词后查找",
  :loading="isSearchLoading",
  style="width: var(--size-formItem-width)",
  :disabled="disabled",
  @change="emits('update:modelValue', $event)",
  @clear="emits('update:modelValue', '')"
)
  el-option(label="全部", value="")
  el-option(v-for="i in list", :key="i._id", :label="i.name", :value="i._id")
</template>

<script setup>
const { fetch, message, router } = inject("global")

const props = defineProps({
  modelValue: {
    type: [String, Object],
    default: "",
  },
  type: {
    type: String,
    default: "all",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits(["update:modelValue"])

const list = ref([])
const isSearchLoading = ref(false)

const typeQueryMap = {
  all: {},
}
function searchList(search) {
  isSearchLoading.value = true
  list.value = []
  fetch
    .get("/store/all", { params: { search, ...(typeQueryMap[props.type] || {}) } })
    .then((res) => {
      list.value = res.list?.map((i) => ({ _id: i._id, name: `${i.name} (${i.code})` })) || []
    })
    .finally(() => {
      isSearchLoading.value = false
    })
}

watch(
  () => props.modelValue,
  (val) => {
    if (props.modelValue?._id || props.modelValue) {
      if (!list.value.find((i) => i._id === val || i._id === val?._id)) {
        searchList(props.modelValue?._id || props.modelValue)
      }
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
