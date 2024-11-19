<template lang="pug">
.componentContainer
  .navigateList
    .item(v-for="(item, index) in currentConfigValue.navigateList", @click="handleEdit(index)")
      yy-image.icon(:src="item.icon", size="50px")
      .title {{ item.title || "请补充信息" }}
    .item.add(@click="handleAdd")
      el-icon(size="30")
        Plus

yy-dialog(v-model="isShowEditDialog")
  el-form(label-width="6em")
    el-form-item(label="图标")
      yy-imageListUpload(v-model="editFom.icon", :multiple="false")
    el-form-item(label="标题")
      el-input(v-model="editFom.title")
    el-form-item(label="链接")
      el-input(v-model="editFom.url")
  template(#footer)
    el-button(type="primary", @click="isShowEditDialog = false") 确定
</template>

<script setup>
import { pickAndUploadFile } from "@/provider/file"

const { fetch, message, router } = inject("global")

const currentConfigValue = inject("currentConfigValue", {
  bannerList: [],
})

const isShowEditDialog = ref(false)
const editFom = ref({})

function handleAdd() {
  currentConfigValue.value.navigateList.push({
    icon: "",
    title: "",
    type: "url",
    url: "",
  })
  editFom.value = currentConfigValue.value.navigateList[currentConfigValue.value.navigateList.length - 1]
  isShowEditDialog.value = true
}

function handleEdit(n) {
  editFom.value = currentConfigValue.value.navigateList[n]
  isShowEditDialog.value = true
}

function handleDelete(n) {
  currentConfigValue.value.navigateList.splice(n, 1)
}

function handlePickImage(n) {
  pickAndUploadFile().then((res) => {
    currentConfigValue.value.navigateList[n].image = res
  })
}

watch(
  () => currentConfigValue.value,
  (val) => {
    if (!currentConfigValue.value?.navigateList) {
      currentConfigValue.value.navigateList = []
    }
  },
  { immediate: true },
)
</script>

<style lang="less" scoped>
.navigateList {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  .item {
    border: 1px dashed var(--color-border);
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s;
    border-radius: 0;
    flex-direction: column;
    .title {
      text-align: center;
      font-size: 12px;
      margin-top: 10px;
    }
    &:hover {
      cursor: pointer;
      border-color: var(--color-primary);
      border-radius: 10px;
    }
  }
}
</style>
