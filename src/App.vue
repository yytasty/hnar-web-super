<template lang="pug">
el-config-provider(:locale="zhCn")
  router-view
</template>

<script setup>
import { ElConfigProvider, ElMessage, ElNotification, dayjs } from "element-plus"
import zhCn from "element-plus/es/locale/lang/zh-cn"

import { accountInfo, companyInfo } from "@/provider/account"
import { refreshCacheFromStorage } from "@/provider/cache"
import { loadingProvider } from "@/provider/loading"
import { ensureMenuData } from "@/provider/menu"

const router = useRouter()

provide("global", {
  router,
  message: ElMessage,
  notify: ElNotification,
  fetch,
  loading: loadingProvider,
})
provide("account", { accountInfo, companyInfo })

refreshCacheFromStorage()
</script>

<style>
@import "./assets/css/main.css";
</style>
