<template lang="pug">
el-card(v-if="customerInfo._id", header="客户信息")
  el-descriptions(:column="2")
    el-descriptions-item(label="ID") {{ customerInfo._id }}
    el-descriptions-item(label="客户名称") {{ customerInfo.name }}
    el-descriptions-item(label="客户电话") {{ customerInfo.phone }}
  el-descriptions(:column="2")
    el-descriptions-item(label="所属单位") {{ customerInfo.company?.name || customerInfo.company }}
    el-descriptions-item(label="所属配送员") {{ customerInfo.courier?.name || customerInfo.courier }}
    el-descriptions-item(label="客户类型") {{ customerInfo.type }}
    el-descriptions-item(label="客户性质") {{ customerInfo.quality }}
    el-descriptions-item(label="客户来源") {{ customerInfo.source }}
    el-descriptions-item(label="风险等级") {{ customerInfo.riskGrade }}
    //- el-descriptions-item(label="推荐人") {{ customerInfo.referrer?.name || customerInfo.referrer }}
    el-descriptions-item(label="备注") {{ customerInfo.remark }}

  el-descriptions(title="客户地址", :column="1", v-if="customerInfo.addressInfo")
    el-descriptions-item(label="地区") {{ customerInfo.addressInfo.areaList?.map?.((v) => v.name)?.join?.(" / ") }}
    el-descriptions-item(label="详细地址") {{ customerInfo.addressInfo.address }}
    el-descriptions-item(label="楼层") {{ customerInfo.addressInfo.floor }}
    el-descriptions-item(label="地址名") {{ customerInfo.addressInfo.name }}
    el-descriptions-item(label="地图坐标", v-if="customerInfo.addressInfo.lat")
      el-button(type="primary") 查看地图

  el-descriptions(title="合同详情", :column="1", v-if="customerInfo.contractInfo")
    el-descriptions-item(label="合同编号") {{ customerInfo.contractInfo.code }}
    el-descriptions-item(label="合同开始日期") {{ formatDate(customerInfo.contractInfo.startDate) }}
    el-descriptions-item(label="合同截止日期") {{ formatDate(customerInfo.contractInfo.endDate) }}
    el-descriptions-item(label="超期下单") {{ customerInfo.contractInfo.isDisabledOrderForDeadline ? "不允许" : "允许" }}

  el-descriptions(title="用气信息", :column="1", v-if="customerInfo.bottleInfo")
    el-descriptions-item(label="在用瓶数") {{ customerInfo.bottleInfo.useBottleNum }}
    el-descriptions-item(label="备用瓶数") {{ customerInfo.bottleInfo.standbyBottleNum }}
    el-descriptions-item(label="用气人数") {{ customerInfo.bottleInfo.memberNum }}
    el-descriptions-item(label="用气设备") {{ customerInfo.bottleInfo.deviceList }}
</template>

<script setup>

const { formatDate } = inject("format")
const { fetch, message, router } = inject("global")


const customerInfo = inject("customerInfo")


</script>

<style lang="less" scoped></style>
