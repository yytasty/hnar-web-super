<template lang="pug">
yy-dialog(:modelValue="isShow", @close="onClose", :title="title", width="1000px")
  el-form(label-width="8em")
    el-form-item(label="名称", required)
      el-input(v-model="formData.name")
    el-form-item(label="分组", required)
      el-input(v-model="formData.category")
    el-form-item(label="应用", required)
      el-input(v-model="formData.app")
    el-form-item(label="页面ID", required)
      el-input(v-model="formData.pageId")
    el-form-item(label="页面路径", required)
      el-input(v-model="formData.pagePath")
    el-form-item(label="备注")
      el-input(v-model="formData.remark")

  template(#footer)
    el-button(type="primary", @click="handleSubmit") 确定
    el-button(type="default", @click="onClose") 取消
</template>

<script setup>
const { fetch, message, router } = inject("global")

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
  currentId: {
    type: String,
    default: "",
  },
})
const emits = defineEmits(["update:isShow", "success"])

const baseName = "权限页面"
const basePath = `/auth/page`
const title = computed(() =>
  props.isViewMode ? `${baseName}详情` : props.currentId ? `修改${baseName}` : `添加${baseName}`,
)

function onClose() {
  emits("update:isShow", false)
}

const formData = ref({
  name: "",
  category: "",
  pageId: "",
  pagePath: "",
  remark: "",
})

function validate() {
  if (!formData.value.name) {
    return Promise.reject("请填写名字")
  } else {
    return Promise.resolve()
  }
}
function handleSubmit() {
  validate()
    .then(() => {
      if (formData.value._id) {
        return fetch.put(`${basePath}/${formData.value._id}`, formData.value)
      } else {
        return fetch.post(`${basePath}`, formData.value)
      }
    })
    .then(() => {
      message.success(formData.value._id ? `修改${baseName}成功` : `添加${baseName}成功`)
      emits("success")
      onClose()
    })
    .catch((err) => {
      message.error(err?.msg || err)
    })
}

function getData(id) {
  if (!id) {
    formData.value = {}
  } else {
    fetch.get(`${basePath}/${props.currentId}`).then((res) => {
      formData.value = res || {}
    })
  }
}

watch(
  () => props.isShow,
  async (val) => {
    if (val) {
      getData(props.currentId)
    }
  },
  { immediate: true },
)
</script>
