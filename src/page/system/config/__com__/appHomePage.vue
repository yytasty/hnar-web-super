<template lang="pug">
.componentContainer
  .bannerList
    el-form.item(v-for="(i, n) in currentConfigValue.bannerList")
      el-form-item(label="轮播图")
        yy-image(v-if="i.image", :src="i.image", width="300px", height="200px", @click="handlePickImage(n)")
        el-icon.addImage(v-else, @click="handlePickImage(n)")
          Plus
      el-form-item(label="类型")
        el-radio-group(v-model="i.type")
          el-radio(value="url") 链接
      el-form-item(label="链接")
        el-input(
          v-if="i.type === 'article'",
          :modelValue="i.article?.title || i.article",
          style="width: 300px",
          disabled
        )
          template(#append)
            el-button(type="primary") 选择文章
        el-input(v-else, v-model="i.url", style="width: 400px")
      .extendsAction
        el-button(type="danger", @click="handleDelete(i)") 删除
  .addAction
    el-button(type="success", @click="handleAdd") 添加一条
</template>

<script setup>
import { pickAndUploadFile } from "@/provider/file"

const { fetch, message, router } = inject("global")

const currentConfigValue = inject("currentConfigValue", {
  bannerList: [],
})

function handleAdd() {
  currentConfigValue.value.bannerList.push({
    image: "",
    type: "url",
    url: "",
  })
}

function handleDelete(n) {
  currentConfigValue.value.bannerList.splice(n, 1)
}

function handlePickImage(n) {
  pickAndUploadFile().then((res) => {
    currentConfigValue.value.bannerList[n].image = res
  })
}

watch(
  () => currentConfigValue.value,
  (val) => {
    if (!currentConfigValue.value?.bannerList) {
      currentConfigValue.value.bannerList = []
    }
  },
  { immediate: true },
)
</script>

<style lang="less" scoped>
.item {
  border: 1px solid var(--color-border);
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  width: 400px;
  position: relative;
  padding: 10px;
  border-radius: 10px;
  .addImage {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 50px;
    color: var(--color-text-light);
    width: 300px;
    height: 200px;
    border: 1px solid var(--color-border);
    cursor: pointer;
    &:hover {
      background-color: var(--color-border);
    }
  }
  .extendsAction {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: 20px;
    position: absolute;
    width: 90px;
    background-color: aqua;
    right: -100px;
  }
}
</style>
