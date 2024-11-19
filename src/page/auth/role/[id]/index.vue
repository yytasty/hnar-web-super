<template lang="pug">
.page
  el-card(v-loading="loading", :header="isEditMode ? '编辑角色' : '新建角色'")
    el-form(label-width="6em")
      el-form-item(label="ID", v-if="detail?._id")
        el-input(v-model="detail._id", disabled)
      el-form-item(label="名称")
        el-input(v-model.trim="detail.name", placeholder="请输入名称")
      el-form-item(label="备注")
        el-input(v-model="detail.remark", placeholder="请输入内置")
      el-form-item(label="后台页面")
        comPageCategory(v-model="detail.authPageList" app="admin")
      el-form-item(label="手机端页面")
        comPageCategory(v-model="detail.authPageListForStaff" app="staff")
      el-form-item(label="")
        el-button(type="primary", @click="handleSubmit") 提交
        el-button(type="info", @click="router.push('/auth/role')") 取消
pagePicker(v-model="isShowPagePicker", @success="onPagePickSuccess")
</template>

<script setup>
import comPage from "./__com__/page.vue"
import comPageCategory from "./__com__/pageCategory.vue"

import pagePicker from "@/component/picker/authPage.vue"
import { useRouteParams } from "@vueuse/router"

const { fetch, message, router } = inject("global")

const id = useRouteParams("id", "", { transform: String })
const isEditMode = computed(() => !!id.value && id.value !== "new")
const loading = ref(false)
const detail = ref({
  _id: "",
  name: "",
  remark: "",
  authPageList: [],
})

const isShowPagePicker = ref(false)
function handleClosePage(n) {
  detail.value.authPageList.splice(n, 1)
}
function onPagePickSuccess(item) {
  if (detail.value.authPageList.find((item) => item._id === item._id)) {
    message.error("页面已存在")
  } else {
    detail.value.authPageList.push(item)
  }
}

function getData() {
  if (!isEditMode.value) {
    detail.value = {
      name: "",
      remark: "",
      authPageList: [],
    }
  } else {
    loading.value = true
    fetch
      .get(`/auth/role/${id.value}`)
      .then((res) => {
        detail.value = res
      })
      .finally(() => {
        loading.value = false
      })
  }
}
const payloadForSubmit = computed(() => {
  return {
    ...detail.value,
    authPageList: (detail.value.authPageList || [])?.map((item) => item?._id || item).filter((item) => item),
  }
})
function handleSubmit() {
  loading.value = true
  Promise.resolve()
    .then(() => {
      if (isEditMode.value) {
        return fetch.put(`/auth/role/${id.value}`, payloadForSubmit.value, { isLoadingLock: true })
      }
      return fetch.post(`/auth/role`, payloadForSubmit.value, { isLoadingLock: true })
    })
    .then((res) => {
      message.success("操作成功")
      router.push(`/auth/role`)
    })
    .finally(() => {
      loading.value = false
    })
}

watch(
  () => id.value,
  () => {
    getData()
  },
  { immediate: true },
)
</script>
