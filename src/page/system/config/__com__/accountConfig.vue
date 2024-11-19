<template lang="pug">
.componentContainer
  el-form
    el-form-item(label="初始密码")
      el-form(label-width="12em")
        el-form-item(label="员工账号初始密码")
          el-input(v-model="currentConfigValue.defaultStaffPassword", type="password", show-password)
        //- el-form-item(label="客户账号初始密码")
          el-input(v-model="currentConfigValue.defaultCustomerPassword", type="password", show-password)
</template>

<script setup>
import { computed, inject, onMounted, ref } from "vue"

const { fetch, message, router } = inject("global")

const currentConfigValue = inject("currentConfigValue", {
  defaultStaffPassword: "",
  defaultCustomerPassword: "",
})

watch(
  () => currentConfigValue.value,
  (val) => {
    if (!currentConfigValue.value?.defaultStaffPassword) {
      currentConfigValue.value.defaultStaffPassword = ""
    }
    if (!currentConfigValue.value?.defaultCustomerPassword) {
      currentConfigValue.value.defaultCustomerPassword = ""
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
