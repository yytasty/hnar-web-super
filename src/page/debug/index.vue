<route lang="yaml">
meta:
  title: 开发调试页
  isPass: true
</route>

<template lang="pug">
.page
  .section
    .title ajax
    .content
      el-button(type="primary", @click="handleAjax") ajax
      .debug(v-if="ajaxData") {{ ajaxData }}
</template>

<script setup>
const { fetch, message, router } = inject("global")

const ajaxData = ref("")
function handleAjax() {
  fetch
    .get("http://jsonplaceholder.typicode.com/posts/2")
    .then((res) => {
      ajaxData.value = res
    })
    .catch((err) => {
      ajaxData.value = err
    })
}

onMounted(() => {})
</script>

<style lang="less" scoped>
.section {
  margin: 10px;
  border: 1px solid var(--color-primary);
  border-radius: 10px;
  overflow: hidden;
  .title {
    font-size: 20px;
    text-align: center;
    padding: 5px 10px;
    background-color: var(--color-primary);
    color: #fff;
  }
  .content {
    padding: 5px;
    white-space: pre-wrap;
    .item {
      padding: 5px;
      border-bottom: 1px solid transparent;

      &:hover {
        border-bottom: 1px solid var(--color-primary);
      }
    }
  }
}
.text {
  color: var(--color);
}
</style>
