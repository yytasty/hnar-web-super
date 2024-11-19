<template lang="pug">
.imageList
  .item(v-for="i in displayList")
    el-image(:src="i.displayUrl || i.url", :style="computedStyle", fit="cover")
    .wrapper
      el-icon(size="20", @click="handlePreview(i)")
        zoom-in
      el-icon(size="20", @click="handleDelete(i)")
        delete
  .item.add(@click="handleAdd", v-if="isShowAdd")
    el-icon(size="30")
      plus
el-image-viewer(
  v-if="isShowPreview",
  append-to-body,
  hide-on-click-modal,
  :url-list="previewList",
  :initial-index="previewIndex",
  @close="isShowPreview = false"
)
</template>

<script setup>
import { pickAndUploadFile, pickAndUploadFileList } from "@/provider/file"
import { computed } from "vue"

const props = defineProps({
  modelValue: {
    type: [Array, String],
    default: [],
  },
  size: {
    type: Number,
    default: 100,
  },
  limit: {
    type: Number,
    default: 9,
  },
  multiple: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(["update:modelValue", "change", "add", "delete"])

const isMultiple = computed(() => props.multiple || (props.limit > 1 && props.modelValue instanceof Array))
const isShowAdd = computed(() => {
  if (isMultiple.value) {
    return displayList.value.length < props.limit
  } else {
    return displayList.value.length === 0
  }
})
const computedStyle = computed(() => {
  return {
    width: `${props.size || 100}px`,
    height: `${props.size || 100}px`,
  }
})

const displayList = ref([])
const previewList = computed(() => displayList.value.map((v) => v.displayUrl || v.url))
function syncDisplayUrl() {
  displayList.value.forEach(async (item) => {
    if (!item.displayUrl && item.url) {
      item.displayUrl = await fetch.get("/upload/signedUrl", { params: { url: item.url } })
    } else {
      item.displayUrl = ""
    }
  })
}

const isShowPreview = ref(false)
const previewIndex = ref(0)
function handlePreview(item) {
  if (isMultiple.value) {
    previewIndex.value = displayList.value.findIndex((v) => v.url === item.url)
  } else {
    previewIndex.value = 0
  }
  isShowPreview.value = true
}

function handleDelete(item) {
  if (isMultiple.value) {
    emit(
      "update:modelValue",
      props.modelValue.filter((v) => v !== item.url),
    )
  } else {
    emit("update:modelValue", "")
  }
}

function handleAdd() {
  if (isMultiple.value) {
    pickAndUploadFileList().then((res) => {
      emit("update:modelValue", [...props.modelValue, ...res])
    })
  } else {
    pickAndUploadFile().then((res) => {
      emit("update:modelValue", res)
    })
  }
}

watch(
  () => props.modelValue,
  (val) => {
    displayList.value = []
    if (isMultiple.value) {
      for (let i = 0; i < val.length; i++) {
        if (!displayList.value[i] || displayList.value[i].url !== val[i]) {
          displayList.value[i] = { url: val[i] }
        }
      }
    } else {
      if (displayList.value?.[0] !== val) {
        displayList.value = val ? [{ url: val }] : []
      }
    }
    syncDisplayUrl()
  },
  { immediate: true },
)
</script>

<style lang="less" scoped>
.imageList {
  display: flex;
  flex-wrap: wrap;
  .item {
    position: relative;
    width: 100px;
    height: 100px;
    margin-right: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all ease 0.3s;
    &:hover {
      .wrapper {
        display: flex;
      }
    }
    .wrapper {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: none;
      justify-content: space-around;
      align-items: center;
      background: rgba(0, 0, 0, 0.5);
      color: #fff;
    }
    .el-icon {
      cursor: pointer;
      transition: all ease 0.3s;
    }
    &.add {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #ccc;
      cursor: pointer;
      &:hover {
        color: var(--color-green);
        border: 1px solid var(--color-green);
        border-radius: 10px;
        .el-icon {
          transform: scale(1.2);
        }
      }
    }
  }
}
</style>
