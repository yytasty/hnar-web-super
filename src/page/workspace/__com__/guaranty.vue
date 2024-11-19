<template lang="pug">
.containerCom
  el-form(label-width="6em", inline)
    el-form-item(label="钢瓶规格", required)
      el-select(v-model="formData.bottleSpecific", style="width: 200px")
        el-option(v-for="i in bottleSpecificList", :label="i.name", :value="i._id")
    el-form-item(label="押金单号", required)
      el-input(v-model="formData.code")
    el-form-item(label="押瓶日期", required)
      el-date-picker(v-model="formData.startDate", type="datetime")
  el-form(label-width="6em", inline)
    el-form-item(label="单瓶押金", required)
      el-input-number(v-model="formData.guarantyPrice", controls-position="right", :min="0")
    el-form-item(label="押瓶数量", required)
      el-input-number(v-model="formData.count", controls-position="right", :min="0")
    el-form-item(label="总押金")
      span {{ formatPrice(formData.guarantyPrice * formData.count) }}
  el-form(label-width="6em")
    el-form-item(label="收租方式")
      el-radio-group(v-model="formData.rentType")
        el-radio-button(:label="i", v-for="i in rentTypeList") {{ i }}
    el-form-item(label="租金")
      el-input-number(v-model="formData.rentPrice", controls-position="right", :min="0")
  el-form(label-width="6em", inline)
    el-form-item(label="钢瓶编号")
      el-input(
        v-model="formData.bottleList",
        placeholder="多个钢瓶编号请用逗号分隔或换行",
        type="textarea",
        :autosize="{ minRows: 2, maxRows: 20 }",
        style="width: 300px"
      )
    el-form-item(label="备注")
      el-input(
        v-model="formData.remark",
        type="textarea",
        :autosize="{ minRows: 2, maxRows: 20 }",
        style="width: 300px"
      )
  .actionBar
    el-button(type="primary", @click="handleSubmit") 提交押瓶记录
  el-table(:data="list", :pagination="pagination", @pagination="getList", style="margin-top: 20px")
    el-table-column(label="押金单号", prop="code")
    el-table-column(label="钢瓶规格", prop="bottleSpecific")
      template(#default="{ row }")
        span {{ row.bottleSpecific?.name || row.bottleSpecific }}
    el-table-column(label="单瓶押金", prop="guarantyPrice")
    el-table-column(label="押瓶数量", prop="count")
    el-table-column(label="来源", prop="source")
    el-table-column(label="处理人", prop="handleStaff")
      template(#default="{ row }")
        yy-accountChip(:detail="row.handleStaff")
    el-table-column(label="押瓶日期", prop="startDate")
      template(#default="{ row }")
        span {{ formatTime(row.startDate) }}
    el-table-column(label="操作", width="200")
      template(#default="{ row }")
        el-button(v-if="row.handleStaff", type="danger", plain, @click="handleCancelAssign(row)") 取消派工
        el-button(v-else, type="primary", plain, @click="handleAssign(row)") 派工

ComStaffPicker(v-model="isShowStaffPicker", @success="onStaffPick")
</template>

<script setup>
import ComStaffPicker from "@/component/picker/staff.vue"
import { bottleSpecificList, ensureCacheData, rentTypeList } from "@/provider/cache"
import { useListPage } from "@/provider/listPage"

const { formatTime, formatPrice } = inject("format")
const { fetch } = inject("global")
const customerInfo = inject("customerInfo")

const formData = ref({
  type: "",
  detail: "",
  handleStaff: "",
  imageList: [],
})

const isShowStaffPicker = ref(false)
function onStaffPick(val) {
  if (assignId.value) {
    fetch.put(`/guaranty/${assignId.value}`, { handleStaff: val._id }).then(() => {
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
  fetch.put(`/guaranty/${row._id}`, { handleStaff: "" }).then(() => {
    getList()
  })
}

function handleSubmit() {
  fetch
    .post("/guaranty", {
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
  url: "/guaranty",
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
  { immediate: true },
)
onBeforeMount(() => {
  ensureCacheData("bottleSpecificList")
  ensureCacheData("rentTypeList")
})
</script>

<style lang="less" scoped>
.actionBar {
  display: flex;
  justify-content: flex-end;
}
</style>
