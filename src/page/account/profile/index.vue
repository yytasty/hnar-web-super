<route lang="yaml">
meta:
  title: 账号资料
  pageId: accountProfile
</route>

<template lang="pug">
.page
  el-card
    el-tabs(v-model="activeTab")
      el-tab-pane(label="基本信息", name="基本信息")
        el-form(label-width="6em")
          el-form-item(label="登录名", required) 
            el-input(v-model="editProfileData.loginName")
          el-form-item(label="头像", required) 
            yy-imageListUpload(v-model="editProfileData.avatar", :multiple="false")
          el-form-item(label="")
            el-button(type="primary", @click="handleEditPassword") 修改资料
      el-tab-pane(label="账号安全", name="账号安全")
        el-form(label-width="8em")
          el-form-item(label="新密码", required) 
            el-input(v-model="editPasswordData.password")
          el-form-item(label="重复新密码", required) 
            el-input(v-model="editPasswordData.password")
          el-form-item(label="")
            el-button(type="primary", @click="handleEditPassword") 修改密码
</template>

<script setup>
const { fetch, message, router } = inject("global")

const activeTab = ref("基本信息")

const editProfileData = ref({
  password: "",
  password2: "",
})
const editPasswordData = ref({
  password: "",
  password2: "",
})

onMounted(() => {})
</script>

<style lang="less" scoped>
.page {
  width: 100%;
}
</style>
