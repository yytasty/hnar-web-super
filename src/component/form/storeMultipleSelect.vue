<template lang="pug">
el-select(
  :modelValue="_modelValue",
  clearable,
  filterable,
  remote,
  multiple,
  :remote-method="searchList",
  placeholder="输入关键词后查找",
  :loading="isSearchLoading",
  style="width: var(--size-formItem-width)",
  @change="emits('update:modelValue', $event)"
)
  el-option(v-for="i in list", :key="i._id", :label="i.name", :value="i._id")
</template>

<script setup>
import { computed } from "vue"

const { fetch, message, router } = inject("global")

const props = defineProps({
  modelValue: {
    type: Array,
    default: [],
  },
  station: {
    type: String,
    default: "",
  },
})
const emits = defineEmits(["update:modelValue"])

const _modelValue = computed(() => {
  return props.modelValue?.map((i) => i?._id || i) || []
})
const list = ref([])
const isSearchLoading = ref(false)

function searchList(search) {
  isSearchLoading.value = true
  list.value = []
  const params = { search }
  if (props.station) {
    params.station = props.station
  }
  fetch
    .get("/store/all", { params })
    .then((res) => {
      list.value = res.list?.map((i) => ({ _id: i._id, name: `${i.name} (${i.code})` })) || []
    })
    .finally(() => {
      isSearchLoading.value = false
    })
}

watch(
  () => props.modelValue,
  () => {
    if (props.modelValue.length > 0) {
      searchList()
    }
  },
  { immediate: true },
)
</script>
