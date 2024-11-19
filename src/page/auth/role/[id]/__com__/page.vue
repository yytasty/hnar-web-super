<template lang="pug">
el-transfer(
  v-model="_modelValue",
  :data="data",
  :props="{ key: '_id', label: 'name' }",
  @change="onChange",
  :titles="['无访问权限', '可访问页面']"
)
</template>

<script setup>
const { fetch, message, router } = inject("global")

const props = defineProps({
  modelValue: {
    type: Array,
    default: [],
  },
})
const emits = defineEmits(["update:modelValue"])

const _modelValue = ref([])
const data = ref([])
function getData() {
  fetch.get("/auth/page?size=-1").then((res) => {
    data.value = res.list
  })
}

function onChange(val) {
  emits("update:modelValue", val)
}

watch(
  () => props.modelValue,
  (val) => {
    _modelValue.value = val
  },
)

onMounted(() => {
  getData()
})
</script>

<style lang="less" scoped>
.el-transfer {
  width: 100%;
  &:deep(.el-transfer-panel) {
    width: 300px;
  }
}
</style>
