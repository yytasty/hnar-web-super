<template lang="pug">
el-select(
  :modelValue="modelValue",
  clearable,
  filterable,
  remote,
  :remote-method="searchList",
  placeholder="输入关键词后查找",
  :loading="isSearchLoading",
  style="width: 200px",
  @change="emits('update:modelValue', $event)"
  @clear="emits('update:modelValue', '')"
)
  el-option(label="全部", value="")
  el-option(v-for="i in list", :key="i._id", :label="i.name", :value="i._id")
</template>

<script setup>
import { computed, inject, onMounted, ref } from "vue"

const { fetch, message, router } = inject("global")

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "all",
  },
})
const emits = defineEmits(["update:modelValue"])

const list = ref([])
const isSearchLoading = ref(false)

function searchList(search) {
  if (!search) {
    return []
  }
  isSearchLoading.value = true
  list.value = []
  const params = { search }
  if (props.type !== "all") {
    params.type = props.type
  }
  fetch
    .get("/customer/all", { params })
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
