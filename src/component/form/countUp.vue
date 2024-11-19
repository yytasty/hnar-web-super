<template>
  <span ref="countRef"></span>
</template>

<script setup>
import { CountUp } from "countup.js"

const props = defineProps({
  end: {
    type: Number,
    required: true,
  },
  options: {
    type: Object,
    default: () => ({}),
    required: false,
  },
})

const countRef = ref(null)
let countUpInstance
onMounted(() => {
  countUpInstance = new CountUp(countRef.value, props.end, props.options)
  if (countUpInstance.error) {
    console.error(countUpInstance.error)
    return
  }
  countUpInstance.start()
})

watch(
  () => props.end,
  (newVal) => {
    if (countUpInstance) {
      countUpInstance.update(newVal)
    }
  },
)
</script>
