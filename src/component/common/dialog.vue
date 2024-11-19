<template lang="pug">
el-dialog(:modelValue="modelValue", @close="handleClose", :title="title" draggable :width="width" :show-close="showClose")
  template(#header)
    slot(name="header" v-if="$slots.header")
    .defaultHeader(v-else)
      .title {{ title }}
      el-button-group(size="small")
        el-button(type="success" plain @click="zoomLevel+=0.1")
          el-icon
            ZoomIn
        el-button(type="info" plain @click="zoomLevel=1")
          el-icon
            Remove
        el-button(type="warning" plain @click="zoomLevel-=0.1")
          el-icon
            ZoomOut
  .defaultContent(:style="{zoom: zoomLevel}")
    slot(name="default")
  template(#footer)
    slot(name="footer" v-if="$slots.footer")
    .defaultFooter(v-else)
      el-button(type="primary", @click="handleSubmit") 确定
      el-button(type="default", @click="handleClose") 取消

</template>

<script setup>
const { fetch, message, router } = inject('global')

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '50%'
  },
  showClose: {
    type: Boolean,
    default: true
  }
})
const emits = defineEmits(['update:modelValue','submit','close'])

function handleClose() {
  emits('close')
  emits('update:modelValue', false)
}
function handleSubmit() {
  emits('submit')
}

const zoomLevel=ref(1)

onMounted(() => {})
</script>

<style lang="less" scoped>
.defaultHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.defaultContent{
  overflow: auto;
  max-height: 70vh;
  max-width: 70vw;
}
</style>
