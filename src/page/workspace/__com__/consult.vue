<template lang="pug">
.containerCom
  el-form(label-width="6em")
    el-form-item(label="咨询类型", required)
      el-radio-group(v-model="formData.type")
        el-radio-button(v-for="i in consultTypeList", :value="i") {{ i }}
    el-form-item(label="咨询内容", required)
      el-input(
        v-model="formData.content",
        type="textarea",
        :autosize="{ minRows: 2, maxRows: 20 }",
        style="width: 500px"
      )
  .actionBar
    el-button(type="primary", @click="handleSubmit") 提交咨询登记
  el-table(:data="list", :pagination="pagination", @pagination="getList", style="margin-top: 20px")
    el-table-column(label="ID", prop="_id")
    el-table-column(label="咨询类型", prop="type")
    el-table-column(label="咨询内容", prop="content")
    el-table-column(label="来源", prop="source")
    el-table-column(label="登记时间", prop="createTime")
      template(#default="{ row }")
        span {{ formatTime(row.createTime) }}
</template>

<script setup>
import { consultTypeList, ensureCacheData } from "@/provider/cache"
import { useListPage } from "@/provider/listPage"

const { formatTime } = inject("format")
const { fetch, jumpPage } = inject("global")
const customerInfo = inject("customerInfo")

const formData = ref({
  type: "",
  content: "",
})

function handleSubmit() {
  fetch
    .post("/consult", {
      ...formData.value,
      customer: customerInfo.value?._id,
      source: "坐席",
    })
    .then(() => {
      formData.value = {}
      handleReset()
    })
}

const { list, pagination, filter, getList, handleSearch, handleReset } = useListPage({
  url: "/consult",
  filter: {
    search: "",
  },
  extendFilter: () => {
    return {
      customer: customerInfo.value?._id,
    }
  },
})

watch(
  () => customerInfo.value?._id,
  () => {
    if (customerInfo.value?._id) {
      handleReset()
    }
  },
)

onBeforeMount(() => {
  ensureCacheData("consultTypeList")
})
onMounted(() => {})
</script>

<style lang="less" scoped>
.actionBar {
  display: flex;
  justify-content: flex-end;
}
</style>
