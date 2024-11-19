<template>
  <el-dialog :close-on-click-modal="false" title="选择地址" v-model="isShow" class="mapPickerContainer" draggable>
    <div class="contentContainer">
      <!-- 我的高德key -->
      <iframe
        ref="iframe"
        frameborder="0"
        width="100%"
        height="600px"
        border
        @load="load"
        :src="`https://m.amap.com/picker/?keywords=${keyword}&key=413fb376f2ef865cc71efd12a626a06d&jscode=f494df94c22472a090e225a12c6107bf&total=50`"
      ></iframe>

      <div class="info" v-if="_location.name">
        <div class="name">
          {{ _location.name }}
        </div>
        <div class="address">
          {{ _location.address }}
        </div>
      </div>
    </div>
    <template #footer>
      <div class="flex" style="justify-content: center">
        <el-button v-if="!_location.name" type="info" style="width: 200px">确定</el-button>
        <el-button v-else type="primary" style="width: 200px" @click="handleSubmit">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  location: {
    type: Object,
    default: () => ({
      name: "",
      lat: 0,
      lng: 0,
      address: "",
    }),
  },
})
const emits = defineEmits(["update:modelValue", "success"])
const keyword = ref("")
const iframe = ref()
const _location = ref({
  name: "",
  lat: 0,
  lng: 0,
  address: "",
})
const isShow = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emits("update:modelValue", val)
  },
})

const load = () => {
  iframe.value.contentWindow.postMessage("hello", "https://m.amap.com/picker/")
}

const init = () => {
  _location.value = {
    name: "",
    lat: 0,
    lon: 0,
    address: "",
  }
  window.addEventListener("message", handleMessage, false)
}

const clear = () => {
  window.removeEventListener("message", handleMessage)
}

const handleMessage = ({ data, ...res }) => {
  if (data) {
    _location.value.name = data.name
    _location.value.address = data.address

    _location.value.lat = Number(data.location.split(",")[0])
    _location.value.lon = Number(data.location.split(",")[1])
  }
}

const handleSubmit = () => {
  emits("success", {
    ..._location.value,
  })
  emits("update:modelValue", false)
}
watch(
  () => props.modelValue,
  (val) => {
    val ? init() : clear()
  },
)
</script>
<style lang="less" scoped>
.contentContainer {
  margin: -10px;
  iframe {
    border-bottom: 1px solid #ebeef5;
  }
  .info {
    background: var(--color-primary);
    color: white;
    display: flex;
    justify-content: space-between;
    padding: 20px;
  }
}
</style>
