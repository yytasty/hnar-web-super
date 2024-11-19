<template lang="pug">
.containerCom
  el-form(label-width="6em")
    el-form-item(label="报修类型", required)
      el-radio-group(v-model="formData.type")
        el-radio-button(v-for="i in repairTypeList", :value="i") {{ i }}
    el-form-item(label="报修内容", required)
      el-input(
        v-model="formData.detail",
        type="textarea",
        :autosize="{ minRows: 2, maxRows: 20 }",
        style="width: 500px"
      )
  el-form(label-width="6em", inline)
    el-form-item(label="预约时间")
      el-date-picker(v-model="formData.planTime", type="datetime")
    el-form-item(label="处理人")
      el-input(:modelValue="formData.handleStaff?.name || formData.handleStaff", disabled)
        template(#append)
          el-button(@click="handleAssign(null)") 选择处理人
  .actionBar
    el-button(type="primary", @click="handleSubmit") 提交报修登记
  el-table(:data="list", :pagination="pagination", @pagination="getList", style="margin-top: 20px")
    el-table-column(label="报修类型", prop="type")
    el-table-column(label="报修内容", prop="detail")
    el-table-column(label="预约时间", prop="planTime")
      template(#default="{ row }")
        span {{ formatTime(row.planTime) }}
    el-table-column(label="来源", prop="source")
    el-table-column(label="处理人", prop="handleStaff")
      template(#default="{ row }")
        span {{ row.handleStaff?.name || row.handleStaff }}
    el-table-column(label="处理状态", prop="status")
    el-table-column(label="处理结果", prop="handleResult")
    el-table-column(label="登记时间", prop="createTime")
      template(#default="{ row }")
        span {{ formatTime(row.createTime) }}
    el-table-column(label="操作", width="200")
      template(#default="{ row }")
        el-button(v-if="row.handleStaff", type="danger", plain, @click="handleCancelAssign(row)") 取消派工
        el-button(v-else, type="primary", plain, @click="handleAssign(row)") 派工

ComStaffPicker(v-model="isShowStaffPicker", @success="onStaffPick")
</template>

<script setup>
import ComStaffPicker from "@/component/picker/staff.vue"
import { ensureCacheData, repairTypeList } from "@/provider/cache"
import { useListPage } from "@/provider/listPage"

const { formatTime } = inject("format")
const { fetch, message } = inject("global")
const customerInfo = inject("customerInfo")

const formData = ref({
  type: "",
  detail: "",
  planTime: "",
  handleStaff: "",
  imageList: [],
})

const isShowStaffPicker = ref(false)
function onStaffPick(val) {
  if (assignId.value) {
    fetch.put(`/repair/${assignId.value}`, { handleStaff: val._id }).then(() => {
      getList()
    })
    return
  }
  formData.value.handleStaff = { _id: val._id, name: val.name }
}
const assignId = ref("")
function handleAssign(row) {
  assignId.value = row?._id
  isShowStaffPicker.value = true
}
function handleCancelAssign(row) {
  fetch.put(`/repair/${row._id}`, { handleStaff: "" }).then(() => {
    getList()
  })
}

function validate() {
  if (!customerInfo.value?._id) {
    return Promise.reject("请选择客户")
  }
  if (!formData.value.type) {
    return Promise.reject("请选择报修类型")
  }
  if (!formData.value.detail) {
    return Promise.reject("请填写报修内容")
  }
  return Promise.resolve()
}
function handleSubmit() {
  validate()
    .then(() => {
      return fetch.post("/repair", {
        ...formData.value,
        customer: customerInfo.value?._id,
        source: "坐席",
      })
    })
    .then(() => {
      formData.value = {}
      handleReset()
    })
    .catch((err) => {
      message.error(err?.msg || err)
    })
}

const { list, pagination, filter, getList, handleSearch, handleReset } = useListPage({
  url: "/repair",
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
  ensureCacheData("repairTypeList")
})
</script>

<style lang="less" scoped>
.actionBar {
  display: flex;
  justify-content: flex-end;
}
</style>
