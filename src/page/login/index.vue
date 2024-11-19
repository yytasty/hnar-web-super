<route lang="yaml">
meta:
  layout: blank
  title: 登录
  isPass: true
</route>

<template lang="pug">
.login-bg
  .login-container
    .login-header
      img.logo.mr10(alt="", src="@/assets/img/logo.svg")
      .login-title 华诺安燃超管系统
    el-form(size="large")
      el-form-item
        el-input(placeholder="用户名", v-model="formData.loginName", style="width: 100%")
          template(#prepend="")
            el-icon
              User
      el-form-item
        el-input(
          @keyup.enter="handleSubmit",
          v-model="formData.password",
          placeholder="密码",
          type="password",
          show-password,
          style="width: 100%"
        )
          template(#prepend="")
            el-icon
              Lock
      .pwd-tips
        el-checkbox.pwd-checkbox(label="记住密码", v-model="formData.isPersist")
        el-link(@click="forgetPassword", type="primary") 忘记密码
      el-button(block, style="width: 100%", @click="handleSubmit", size="large", type="primary") 登录
</template>

<script setup>
import { loginByPassword } from "@/provider/account"

const { router, message } = inject("global")

const formData = ref({
  isPersist: false,
  company: "",
  loginName: "",
  password: "",
})

function validate() {
  if (!formData.value.company) {
    return Promise.reject("请输入公司")
  }
  if (!formData.value.phone) {
    return Promise.reject("请输入手机号")
  }
  if (!formData.value.password) {
    return Promise.reject("请输入密码")
  }
  return Promise.resolve()
}
function handleSubmit() {
  loginByPassword(formData.value).then((res) => {
    if (formData.value.isPersist) {
      localStorage.setItem("loginInfo", JSON.stringify(formData.value))
    } else {
      localStorage.removeItem("loginInfo")
    }
    router.push("/")
  })
}

function forgetPassword() {
  message.info("请联系开发人员重置密码")
}

onMounted(() => {
  const loginInfo = localStorage.getItem("loginInfo")
  if (loginInfo) {
    try {
      formData.value = JSON.parse(loginInfo)
    } catch (e) {}
  }
})
</script>

<style lang="less" scoped>
.login-bg {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background: url(@/assets/img/login-bg.jpg) center/cover no-repeat;
}

.login-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
}

.logo {
  width: 35px;
}

.login-title {
  font-size: 22px;
  color: #333;
  font-weight: bold;
}

.login-container {
  width: 450px;
  border-radius: 5px;
  background: #fff;
  padding: 40px 50px 50px;
  box-sizing: border-box;
}

.pwd-tips {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  margin: -10px 0 10px;
  color: #787878;
}

.pwd-checkbox {
  height: auto;
}

.login-tips {
  font-size: 12px;
  color: #999;
}

.login-text {
  display: flex;
  align-items: center;
  margin-top: 20px;
  font-size: 14px;
  color: #787878;
}
</style>
