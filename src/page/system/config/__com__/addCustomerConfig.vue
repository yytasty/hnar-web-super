<template lang="pug">
.componentContainer
  el-form
    el-form-item(label="必填项", v-if="currentConfigValue.requireForm")
      el-form(label-width="8em")
        el-form-item(label="客户类型")
          el-checkbox(v-model="currentConfigValue.requireForm.type")
        el-form-item(label="姓名")
          el-checkbox(v-model="currentConfigValue.requireForm.name")
        el-form-item(label="电话")
          el-checkbox(v-model="currentConfigValue.requireForm.phone")
        el-form-item(label="优惠等级")
          el-checkbox(v-model="currentConfigValue.requireForm.discount")
        el-form-item(label="身份证号")
          el-checkbox(v-model="currentConfigValue.requireForm.idCard")
        el-form-item(label="详细地址")
          el-checkbox(v-model="currentConfigValue.requireForm.address")
        el-form-item(label="楼层")
          el-checkbox(v-model="currentConfigValue.requireForm.floor")
        el-form-item(label="客户来源")
          el-checkbox(v-model="currentConfigValue.requireForm.source")
        el-form-item(label="用气人数")
          el-checkbox(v-model="currentConfigValue.requireForm.memberNum")
        el-form-item(label="在用瓶数")
          el-checkbox(v-model="currentConfigValue.requireForm.useBottleNum")
        el-form-item(label="备用瓶数")
          el-checkbox(v-model="currentConfigValue.requireForm.standbyBottleNum")
        el-form-item(label="备注")
          el-checkbox(v-model="currentConfigValue.requireForm.remark")
</template>

<script setup>
import { computed, inject, onMounted, ref } from "vue"

const { fetch, message, router } = inject("global")

const currentConfigValue = inject("currentConfigValue", {
  requireForm: {
    type: true,
    name: true,
    phone: true,
    discount: false,
    idCard: false,
    address: false,
    floor: false,
    courier: false,
    source: false,
    memberNum: false,
    useBottleNum: false,
    standbyBottleNum: false,
    remark: false,
  },
})

watch(
  () => currentConfigValue.value,
  (val) => {
    if (!currentConfigValue.value?.requireForm) {
      currentConfigValue.value.requireForm = {
        type: true,
        name: true,
        phone: true,
        discount: false,
        idCard: false,
        address: false,
        floor: false,
        courier: false,
        source: false,
        memberNum: false,
        useBottleNum: false,
        standbyBottleNum: false,
        remark: false,
      }
    }
    if (!currentConfigValue.value?.requireList) {
      currentConfigValue.value.requireList = []
    }
  },
  { immediate: true },
)
</script>

<style lang="less" scoped>
.componentContainer {
  width: 100%;
}
</style>
