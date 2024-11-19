<template lang="pug">
el-drawer(title="选择客户", :model-value="modelValue", size="600px", center, @close="handleClose")
  el-table(:data="list", border, highlight-current-row, ref="tableRef", @current-change="handlePickChange")
    el-table-column(label="名称", prop="name")
    el-table-column(label="规格", prop="bottleType")
  el-pagination(
    style="margin-top: 20px; justify-content: center",
    background,
    size="small",
    v-model:current-page="pagination.page",
    v-model:page-size="pagination.size",
    :total="pagination.total",
    layout="total,sizes,prev, pager, next",
    @change="getList"
  )
  template(#footer)
    el-button(type="info", @click="handleClose") 取消
    el-button(type="primary", @click="handleSubmit") 确定
</template>

<script setup>
import { useListPage } from "@/provider/listPage"

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(["close", "success", "update:modelValue"])
const { list, pagination, filter, getList, handleSearch, handleReset } = useListPage({
  url: "/bottle/specific",
  filter: {},
})
const tableRef = ref(null)
const picked = ref(null)
function handlePickChange(val) {
  picked.value = val
}
function handleClose() {
  emits("update:modelValue", false)
  emits("close")
}
function handleSubmit() {
  if (!picked.value) return
  emits("success", picked.value)
  handleClose()
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      handleReset()
    }
  },
)
</script>

<style lang="less" scoped>
.el-table {
  &:deep(.current-row) {
    .el-table__cell {
      background-color: #70a1ff;
      color: white;
    }
    &:hover {
      .el-table__cell {
        background-color: #1e90ff;
      }
    }
  }
}
</style>
