<template lang="pug">
el-drawer(title="选择商品", :model-value="modelValue", size="900px", center, @close="handleClose")
  el-form(label-width="5em", inline, size="small")
    el-form-item(label="名字")
      el-input(v-model.trim="filter.name", @keyup.enter="handleSearch", style="width: 150px")
    el-form-item(label="编号")
      el-input(v-model.trim="filter.code", @keyup.enter="handleSearch", style="width: 150px")
    el-form-item(label="类型")
      el-select(v-model="filter.productType", placeholder="请选择商品类型", style="width: 150px", @change="handleSearch")
        el-option(v-for="item in productTypeList", :key="item._id", :label="item.name", :value="item._id")
    el-form-item
      el-button(type="info", @click="handleReset") 重置
      el-button(type="primary", @click="handleSearch") 查询

  el-table(:data="list", border, highlight-current-row, ref="tableRef", @current-change="handlePickChange")
    el-table-column(label="编号", prop="code")
      template(#default="{ row }")
        span {{ row.code || row._id }}
    el-table-column(label="名称", prop="name")
    el-table-column(label="商品类型", prop="productType.name")
    el-table-column(label="钢瓶规格", prop="bottleSpecific.name")
    el-table-column(label="单价", prop="price")
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
  type: {
    type: String,
    default: "",
  },
})

const emits = defineEmits(["close", "success", "update:modelValue"])
const { list, pagination, filter, getList, handleSearch, handleReset } = useListPage({
  url: "/product",
  filter: {
    name: "",
    code: "",
    productType: "",
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

const productTypeList = ref([])
function getProductType() {
  fetch.get(`/productType?size=-1`).then((res) => {
    productTypeList.value = res?.list || []
  })
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      handleReset()
      getProductType()
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
