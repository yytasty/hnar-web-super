<template lang="pug">
el-form-item(label-width="135px")
  template(#label)
    el-dropdown(type="primary", split-button, @command="onFilterTypeChange")
      span {{ filterTypeName }}
      template(#dropdown)
        el-dropdown-menu
          el-dropdown-item(v-for="item in filterTypeList", :command="item.value") {{ item.label }}
  el-input(
    v-model="filterValue",
    @change="onValueChange",
    clearable,
    :placeholder="`请输入搜索内容（${filterTypeName}）`",
    @clear="emits('search')",
    style="width: 280px"
  )
    template(#append)
      el-button(@click="emits('search')") 查询
</template>

<script setup>
import { computed, inject, onMounted, ref } from "vue"

const { fetch, message, router } = inject("global")

const props = defineProps({
  filterTypeList: {
    type: Array,
    default: () => [],
  },
  filter: {
    type: Object,
    default: {},
  },
})
const emits = defineEmits(["update:filter", "search"])

const filterType = ref("")
const filterValue = ref("")
const filterTypeName = computed(() => {
  return props.filterTypeList?.find((item) => item.value == filterType.value)?.label || "搜索项"
})

function onFilterTypeChange(command) {
  filterType.value = command
  filterTypeName.value = ""
}
function onValueChange() {
  console.log(">>>>>>> 1", 1)
  emits("update:filter", {
    ...props.filter,
    [filterType.value]: filterValue.value,
  })
}

watch(
  () => props.filterTypeList,
  () => {
    filterType.value = props.filterTypeList[0]?.value
  },
  {
    immediate: true,
  },
)
</script>

<style lang="less" scoped>
.componentContainer {
  width: 100%;
}
</style>
