<template lang="pug">
el-date-picker(
  :type="type",
  range-separator="至",
  start-placeholder="开始日期",
  end-placeholder="结束日期",
  :modelValue="modelValue",
  :shortcuts="shortcuts",
  :default-time="defaultTime",
  clearable,
  @clear="onChange([])",
  @update:modelValue="onChange"
)
</template>

<script setup>
import { datePickShortcutBefore } from "@/util/time"

const { fetch, message, router } = inject("global")

const props = defineProps({
  modelValue: {
    type: Array,
    default: [],
  },
  type: {
    type: String,
    default: "daterange",
  },
  isShowShortcut: {
    type: Boolean,
    default: true,
  },
})
const emits = defineEmits(["update:modelValue", "change"])

const defaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])
const shortcuts = computed(() => {
  if (!props.isShowShortcut) {
    return []
  }
  if (props.type === "monthrange") {
    return []
  }
  return datePickShortcutBefore
})

function onChange(val) {
  emits("update:modelValue", val)
  emits("change")
}
</script>
