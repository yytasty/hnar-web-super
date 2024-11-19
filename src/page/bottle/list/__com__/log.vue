<template lang="pug">
yy-dialog(:modelValue="isShow", @close="emits('update:isShow', false)", title="钢瓶流转记录")
  .logList
    .logItem(v-for="(i, n) in logList")
      .row
        .index {{ n + 1 }}
        .type {{ i.type }}
      .row.row2
        .from {{ i.fromInfo?.name || i.fromInfo?.plateNumber || "-" }}
        el-icon.icon(size="20", color="#3742fa")
          DArrowRight
        .to {{ i.toInfo?.name || i.toInfo?.plateNumber || "-" }}
      .row.row3
        .time {{ formatTime(i.createTime) }}
        .account
          yy-accountChip(:detail="i.account")
</template>

<script setup>
const { fetch, message, router } = inject("global")
const { formatTime } = inject("format")

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
  currentId: {
    type: String,
    default: "",
  },
})
const emits = defineEmits(["update:isShow", "success"])

const logList = ref([])

watch(
  () => props.isShow,
  (val) => {
    if (val) {
      if (props.currentId) {
        fetch
          .get(`/bottle/log/all`, {
            params: {
              bottle: props.currentId,
            },
          })
          .then((res) => {
            logList.value = res || []
          })
      }
    }
  },
  { immediate: true },
)
onBeforeMount(() => {})
</script>

<style lang="less" scoped>
.logList {
  .logItem {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border: 1px solid #ebeef5;
    border-radius: 15px;
    position: relative;
    padding: 10px;
    overflow: hidden;
    transition: all 0.3s;
    &:hover {
      border-color: var(--color-primary);
      .index {
        background-color: var(--color-primary);
        color: white;
      }
    }
    .row {
      display: flex;
      align-items: center;
      width: 100%;
      .type {
        margin-left: 50px;
      }
    }
    .row2 {
      display: flex;
      justify-content: center;
      .from,
      .to {
        background-color: #1e90ff;
        color: white;
        border: 1px solid #1e90ff;
        padding: 5px;
        border-radius: 30px;
        text-align: center;
        width: 150px;
      }
      .to {
        background-color: #70a1ff;
        border: 1px solid #70a1ff;
      }
      .icon {
        width: 50px;
      }
    }
    .row3 {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .index {
      --size: 30px;
      width: var(--size);
      height: var(--size);
      color: var(--color-primary);
      border: 1px solid var(--color-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 13px 0 0 0;
      position: absolute;
      top: 0;
      left: 0;
      font-size: 12px;
      transition: all 0.3s;
    }
  }
}
</style>
