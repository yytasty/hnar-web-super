<route lang="yaml">
meta:
  title: 文章编辑
  pageId: articleEdit
</route>

<template lang="pug">
.page
  el-card(v-loading="loading", :header="cardHeader")
    el-form(label-width="6em")
      el-form-item(label="Key")
        el-input(v-model.trim="formData.article_key", placeholder="请输入Key", :disabled="route.query?.mode === 'edit'")
      el-form-item(label="标题")
        el-input(v-model="formData.title", placeholder="请输入标题")
      el-form-item(label="内容")
        TinyMceQ(v-model="formData.content", ref="editor")
      el-form-item(label="分类")
        el-input(v-model.trim="formData.category", placeholder="请输入分类")
      el-form-item(label="")
        el-button(type="primary", @click="handleSubmit") 提交
        el-button(type="info", @click="router.push('/article')") 取消
</template>

<script setup>
const { fetch, message, router } = inject("global")
const route = useRoute()

const editor = ref(null)

const cardHeader = computed(() => {
  if (route.query?.mode === "new") {
    return "新建文章"
  } else {
    return "编辑文章"
  }
})

const loading = ref(false)
const formData = ref({
  article_key: "",
  title: "",
  content: "",
  category: "",
})

const validateMessage = computed(() => {
  if (!formData.value.title) {
    return "请填写标题"
  }
  return ""
})
function handleSubmit() {
  if (validateMessage.value) {
    message.error(validateMessage.value)
    return
  }
  Promise.resolve()
    .then(() => {
      if (route.query?.mode === "new") {
        return fetch.post(`/article`, formData.value, { isLoadingLock: true })
      }
      return fetch.put(`/article/${route.query?.id}`, formData.value, {
        isLoadingLock: true,
      })
    })
    .then((res) => {
      message.success("提交成功")
      router.push("/article")
    })
}

function getData() {
  if (!route.query?.id) {
    formData.value = {
      article_key: "",
      title: "",
      content: "",
      category: "",
    }
    return
  }
  if (loading.value) return
  loading.value = true
  fetch
    .get(`/article/${route.query?.id}`)
    .then((res) => {
      if (res) {
        formData.value = { ...res }
        if (editor.value) {
          editor.value.setContent()
        }
      }
    })
    .finally(() => {
      loading.value = false
    })
}

watch(
  () => route.query?.id,
  () => {
    getData()
  },
  { immediate: true },
)
</script>

<style lang="less" scoped>
.page {
  width: 100%;
  .el-input {
    max-width: 500px;
  }
}
</style>
