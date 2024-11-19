<template lang="pug">
el-select(
  :modelValue="modelValue",
  clearable,
  filterable,
  remote,
  :remote-method="searchList",
  placeholder="输入关键词后查找",
  :loading="isSearchLoading",
  style="width: var(--size-formItem-width)",
  :multiple="multiple"
  @change="emits('update:modelValue', $event)"
  @clear="emits('update:modelValue', '')"
)
  el-option(label="全部", value="" v-if="!multiple")
  el-option(v-for="i in list", :key="i._id", :label="i.isDelete?`${i.name}`:i.name", :value="i._id")
</template>

<script setup>
const { fetch, message, router } = inject("global")

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  multiple: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(["update:modelValue"])

const list = ref([])
const isSearchLoading = ref(false)

function searchList(search) {
  isSearchLoading.value = true
  list.value = []
  fetch
    .get("/productType", { params: { search, size:100000 } })
    .then((res) => {
      list.value = res.list?.map((i) => ({ _id: i._id, name: `${i.name}` })) || []
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
