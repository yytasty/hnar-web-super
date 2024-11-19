<template lang="pug">
.category(v-for="category in listWithCategory")
  .categoryName {{ category.name }}
  .pageList(v-for="page in category.list")
    el-checkbox(:modelValue="isPicked(page)", :label="page._id", @click="handleSwitch(page)") {{ page.name }}
</template>

<script setup>
const { fetch, message, router } = inject("global")

const props = defineProps({
  modelValue: {
    type: Array,
    default: [],
  },
  app: {
    type: String,
    default: "admin",
  },
})
const emits = defineEmits(["update:modelValue"])

const data = ref([])
const listWithCategory = computed(() => {
  const categoryList = []
  data.value.forEach((item) => {
    const category = categoryList.find((category) => category.name === item.category)
    if (category) {
      category.list.push(item)
    } else {
      categoryList.push({
        name: item.category,
        list: [item],
      })
    }
  })
  return categoryList
})

function isPicked(page) {
  return props.modelValue.some((item) => item === page._id)
}
function handleSwitch(page) {
  if (isPicked(page)) {
    emits(
      "update:modelValue",
      props.modelValue.filter((item) => item !== page._id),
    )
  } else {
    emits("update:modelValue", [...props.modelValue, page._id])
  }
}

function getData() {
  fetch.get(`/auth/page?size=-1&app=${props.app}`).then((res) => {
    data.value = res.list
  })
}

onMounted(() => {
  getData()
})
</script>

<style lang="less" scoped>
.category {
  margin-bottom: 10px;
  border: 1px solid var(--color-primary);
  width: 100%;
  .categoryName {
    background-color: var(--color-primary);
    color: white;
    padding: 0 10px;
  }
  .pageList {
    display: inline-flex;
    flex-wrap: wrap;
    padding: 10px;
    .el-checkbox {
      margin-right: 10px;
      width: 100px;
    }
  }
}
</style>
