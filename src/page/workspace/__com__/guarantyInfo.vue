<template lang="pug">
el-card(header="客户押瓶信息", v-if="guarantyDetail?._id")
  el-descriptions(:column="2")
    el-descriptions-item(label="押金单号") {{ guarantyDetail.code }}
    el-descriptions-item(label="钢瓶规格") {{ guarantyDetail.bottleSpecific?.name || guarantyDetail.bottleSpecific }}
    el-descriptions-item(label="押瓶日期") {{ formatTime(guarantyDetail.startDate) }}
    el-descriptions-item(label="单瓶押金") {{ guarantyDetail.guarantyPrice }}
    el-descriptions-item(label="押瓶数量") {{ guarantyDetail.count }}
    el-descriptions-item(label="收租方式") {{ guarantyDetail.rentType }}
    el-descriptions-item(label="租金") {{ guarantyDetail.rentPrice }}
    el-descriptions-item(label="押瓶备注") {{ guarantyDetail.remark }}
    el-descriptions-item(label="状态") {{ guarantyDetail.status }}
</template>

<script setup>
const { fetch, message, router } = inject("global")
const { formatTime } = inject("format")
const customerInfo = inject("customerInfo")

const guarantyDetail = ref({})
async function getData() {
  if (!customerInfo.value?._id) return
  guarantyDetail.value = await fetch.get(`/customer/${customerInfo.value?._id}/guaranty`)
}

watch(
  () => customerInfo.value?._id,
  (val) => {
    if (val) {
      getData()
    }
  },
  { immediate: true },
)
</script>

<style lang="less" scoped></style>
