<route lang="yaml">
meta:
  title: 微信端配置
  pageId: customerClientConfig
  order: 2
  categoryList:
    - 系统管理/基础配置
</route>

<template lang="pug">
.page
  el-card(style="margin-right: 20px; width: 300px")
    .configTypeList
      .item(
        v-for="i in systemConfigList",
        :key="i.configId",
        @click="handleChange(i)",
        :class="{ active: currentConfigId === i.configId }"
      ) {{ i.name }}
  el-card(style="flex-grow: 1")
    template(#header)
      div(style="display: flex; justify-content: space-between")
        span {{ currentConfigName }}
        el-button(size="small", type="warning", plain, @click="isShowPreviewRaw = true") 查看原始数据
    component(v-if="currentConfigCom", :is="currentConfigCom")
    span(v-else) 未定义配置项
    template(#footer)
      el-button(type="primary", @click="handleSave") 保存配置

ComPreviewRaw(v-model:isShow="isShowPreviewRaw")
</template>

<script setup>
import ComAppHomePage from "./__com__/appHomePage.vue"
import ComAppHomePageNavigate from "./__com__/appHomePageNavigate.vue"
import ComPreviewRaw from "./__com__/rawPreview.vue"

const { fetch, message, router } = inject("global")

const systemConfigList = [
  { name: "APP首页Banner", configId: "appHomePageBanner", com: ComAppHomePage },
  { name: "APP首页导航区", configId: "appHomePageNavigate", com: ComAppHomePageNavigate },
]

const currentConfigId = ref("addCustomerConfig")
const currentConfigName = computed(
  () => systemConfigList.find((i) => i.configId === currentConfigId.value)?.name || currentConfigId.value,
)
const currentConfigCom = computed(() => systemConfigList.find((i) => i.configId === currentConfigId.value)?.com)

const currentConfigValue = ref({})
provide("currentConfigValue", currentConfigValue)

function handleChange(item) {
  currentConfigId.value = item.configId
  fetch.get(`/config/${item.configId}`).then((res) => {
    currentConfigValue.value = res || {}
  })
}

function handleSave() {
  fetch.put(`/config/${currentConfigId.value}`, { configValue: currentConfigValue.value }).then(() => {
    message.success("保存成功")
  })
}

const isShowPreviewRaw = ref(false)

onMounted(() => {
  handleChange(systemConfigList[0])
})
</script>

<style lang="less" scoped>
.page {
  width: 100%;
  display: flex;
  align-items: flex-start;
}
.configTypeList {
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
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-wrap: wrap;
  .el-tag {
    margin-bottom: 10px;
  }
  .el-input {
    margin-right: 10px;
    width: 250px;
  }
}
</style>
