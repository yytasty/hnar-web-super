<route lang="yaml">
meta:
  title: 系统字典
  pageId: systemDict
  order: 3
  categoryList:
    - 系统管理/基础配置
</route>

<template lang="pug">
.page
  el-card(style="margin-right: 20px; width: 300px")
    .configTypeList
      .item(
        v-for="i in systemDictList",
        :key="i.configId",
        @click="handleChange(i)",
        :class="{ active: currentConfigId === i.configId }"
      ) {{ i.name }}
  el-card(style="flex-grow: 1")
    .tagList
      el-tag(v-for="i in currentConfigValue", size="large", closable, @close="onClose(i)") {{ i }}
      div
        el-input(v-if="isShowAdd", v-model="addValue", @keyup.enter="handleSubmitAdd(), (isShowAdd = true)")
          template(#append)
            span(@click="handleSubmitAdd") 添加
      el-tag(v-if="!isShowAdd", type="success", size="large", @click="isShowAdd = true") 添加一条内容
    template(#footer)
      el-button(type="primary", @click="handleSave") 保存配置
</template>

<script setup>
import { clearCache } from "@/provider/cache"
import { systemDictList } from "@/provider/dict"

const { fetch, message, router } = inject("global")

const currentConfigId = ref("repairTypeList")
const currentConfigValue = ref([])
const isShowAdd = ref(false)
const addValue = ref("")

function handleChange(item) {
  currentConfigId.value = item.configId
  isShowAdd.value = false
  addValue.value = ""
  fetch.get(`/config/${item.configId}`).then((res) => {
    if (res instanceof Array) {
      currentConfigValue.value = res
    } else {
      currentConfigValue.value = []
    }
  })
}

function onClose(item) {
  currentConfigValue.value = currentConfigValue.value.filter((i) => i !== item)
}

function handleSubmitAdd() {
  if (!addValue.value) {
    message.error("请输入内容")
    return
  }
  if (currentConfigValue.value.includes(addValue.value)) {
    message.error("已存在")
    addValue.value = ""
    return
  }
  currentConfigValue.value.push(addValue.value)
  addValue.value = ""
  isShowAdd.value = false
}

function handleSave() {
  if (addValue.value) {
    handleSubmitAdd()
  }
  fetch.put(`/config/${currentConfigId.value}`, { configValue: currentConfigValue.value }).then(() => {
    message.success("保存成功")
    clearCache(currentConfigId.value)
  })
}

onMounted(() => {})
</script>

<style lang="less" scoped>
.page {
  width: 100%;
  display: flex;
  align-items: flex-start;
}
.configTypeList {
  height: calc(100vh - 200px);
  overflow-y: auto;
  .item {
    padding: 10px;
    cursor: pointer;
    &:hover {
      background-color: #f5f7fa;
    }
    &.active {
      background-color: var(--color-primary);
      color: white;
    }
  }
}
.tagList {
  .el-tag {
    margin-bottom: 10px;
    margin-right: 20px;
  }
  .el-input {
    margin-right: 10px;
    width: 250px;
  }
}
</style>
