<template lang="pug">
el-select(
  :modelValue="_modelValue",
  clearable,
  filterable,
  remote,
  :disabled="disabled",
  :remote-method="searchList",
  placeholder="输入关键词后查找",
  :loading="isSearchLoading",
  style="width: var(--size-formItem-width)",
  @change="emits('update:modelValue', $event)"
  @clear="emits('update:modelValue', '')"
)
  el-option(v-if="isShowAll", label="全部", value="")
  el-option(v-if="isShowNone", label="无", value="")
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
  isShowAll: {
    type: Boolean,
    default: true,
  },
  isShowNone: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits(["update:modelValue"])

const _modelValue = computed(() => {
  return props.modelValue?._id || props.modelValue
})

const list = ref([])
const isSearchLoading = ref(false)

const typeQueryMap = {
  all: {},
}
function searchList(search) {
  isSearchLoading.value = true
  list.value = []
  fetch
    .get("/station/all", { params: { search, ...(typeQueryMap[props.type] || {}) } })
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
    if (val) {
      searchList(val?._id || val)
    }
  },
)
</script>

<style lang="less" scoped>
.componentContainer {
  width: 100%;
}
</style>
