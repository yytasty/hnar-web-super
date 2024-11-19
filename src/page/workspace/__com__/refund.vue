<template lang="pug">
.containerCom
  el-form(label-width="7em")
    el-form-item(label="退瓶数量", required)
      el-input-number(v-model="formData.count", controls-position="right", :min="0", :max="guarantyDetail.count")
      span(v-if="guarantyDetail?.count", style="margin-left: 10px") 押瓶数量 {{ guarantyDetail.count }}
    el-form-item(label="扣减金额", required)
      el-input-number(
        v-model="formData.deductionPrice",
        controls-position="right",
        :min="0",
        :max="guarantyDetail.guarantyPrice"
      )
      span(v-if="guarantyDetail?.guarantyPrice", style="margin-left: 10px") 退瓶总押金 {{ guarantyDetail.guarantyPrice * formData.count }}
    el-form-item(label="实际退款金额") {{ formatPrice(refundPrice) }}
    el-form-item(label="退瓶内容", required)
      el-input(
        v-model="formData.content",
        type="textarea",
        :autosize="{ minRows: 2, maxRows: 20 }",
        style="width: 500px"
      )
    el-form-item(label="预约时间")
      el-date-picker(v-model="formData.planTime", type="datetime")
    el-form-item(label="处理人")
      el-input(:modelValue="formData.courier?.name || formData.courier", disabled)
        template(#append)
          el-button(@click="handleAssign(null)") 选择处理人
  .actionBar
    el-button(type="primary", @click="handleSubmit") 提交退瓶登记
  el-table(:data="list", :pagination="pagination", @pagination="getList", style="margin-top: 20px")
    el-table-column(label="ID", prop="_id")
    el-table-column(label="退瓶数量", prop="count")
    el-table-column(label="退款金额", prop="refundPrice")
    el-table-column(label="来源", prop="source")
    el-table-column(label="处理人", prop="courier")
      template(#default="{ row }")
        yy-accountChip(:detail="row.courier")
    el-table-column(label="状态", prop="status")
    el-table-column(label="完成时间", prop="finishTime")
      template(#default="{ row }")
        span {{ formatTime(row.finishTime) }}
    el-table-column(label="登记时间", prop="createTime")
      template(#default="{ row }")
        span {{ formatTime(row.createTime) }}
    el-table-column(label="操作", width="200")
      template(#default="{ row }")
        template(v-if="row.status == '待处理'")
          el-button(v-if="row.courier", type="danger", plain, @click="handleCancelAssign(row)") 取消派工
          el-button(v-else, type="primary", plain, @click="handleAssign(row)") 派工

ComStaffPicker(v-model="isShowStaffPicker", @success="onStaffPick")
</template>

<script setup>
import ComStaffPicker from "@/component/picker/staff.vue"
import { useListPage } from "@/provider/listPage"
import Decimal from "decimal.js"

const { formatTime, formatPrice } = inject("format")
const { fetch, message } = inject("global")
const customerInfo = inject("customerInfo")

const formData = ref({
  content: "",
  count: 1,
  deductionPrice: 0,
  planTime: "",
  courier: "",
})

const isShowStaffPicker = ref(false)
function onStaffPick(val) {
  if (assignId.value) {
    fetch.put(`/refund/${assignId.value}`, { courier: val._id }).then(() => {
      getList()
    })
    return
  }
  formData.value.courier = { _id: val._id, name: val.name }
}
const assignId = ref("")
function handleAssign(row) {
  assignId.value = row?._id
  isShowStaffPicker.value = true
}
function handleCancelAssign(row) {
  fetch.put(`/refund/${row._id}`, { courier: "" }).then(() => {
    getList()
  })
}

const refundPrice = computed(() => {
  return new Decimal(guarantyDetail.value.guarantyPrice || 0)
    .times(formData.value.count || 0)
    .minus(formData.value?.deductionPrice || 0)
    .toNumber()
})

function validate() {
  if (!customerInfo.value?._id) {
    return Promise.reject("请选择客户")
  }
  if (!formData.value.content) {
    return Promise.reject("请填写内容")
  }
  return Promise.resolve()
}
function handleSubmit() {
  validate()
    .then(() => {
      return fetch.post("/refund", {
        ...formData.value,
        customer: customerInfo.value?._id,
        company: customerInfo.value?.company,
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

const guarantyDetail = ref({})
async function getData() {
  if (!customerInfo.value?._id) return
  guarantyDetail.value = await fetch.get(`/customer/${customerInfo.value?._id}/guaranty`)
}

const { list, pagination, filter, getList, handleSearch, handleReset } = useListPage({
  url: "/refund",
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
      getData()
    }
  },
  { immediate: true },
)
</script>

<style lang="less" scoped>
.actionBar {
  display: flex;
  justify-content: flex-end;
}
</style>
