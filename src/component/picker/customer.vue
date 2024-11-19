<template lang="pug">
el-drawer(title="选择客户", :model-value="modelValue", size="600px", center, @close="handleClose")
  el-form(label-width="5em", inline)
    el-form-item(label="名称")
      el-input(v-model.trim="filter.name", style="width: 160px")
    el-form-item(label="编号")
      el-input(v-model.trim="filter.code", style="width: 160px")
    el-form-item(label="门店")
      yy-storeSelect(v-model="filter.store", @change="handleSearch", style="width: 160px")
    .actionBar(style="display: flex; justify-content: flex-end; width: 100%; margin-bottom: 10px")
      el-button(type="primary", style="width: 100px", @click="handleSearch") 查询
      el-button(type="warning", plain, @click="handleReset") 重置

  el-table(:data="list", border, highlight-current-row, ref="tableRef", @current-change="handlePickChange")
    el-table-column(label="编号", prop="code")
    el-table-column(label="姓名", prop="name")
    el-table-column(label="客户电话", prop="phone")
    el-table-column(label="所属门店", prop="store")
      template(#default="{ row }")
        span {{ row.store?.name || row.store }}
    el-table-column(label="客户类型", prop="type")
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

const { fetch, router, message } = inject("global")
const { formatTime } = inject("format")

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(["close", "success", "update:modelValue"])
const { list, pagination, filter, getList, handleSearch, handleReset } = useListPage({
  url: "/customer",
  filter: {
    name: "",
    code: "",
    store: "",
  },
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
      if (props.store) {
        filter.value.storeList = props.store
      }
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
