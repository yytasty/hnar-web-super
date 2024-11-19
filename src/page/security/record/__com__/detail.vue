<template lang="pug">
yy-dialog(:modelValue="isShow", @close="handleClose", title="安检记录详情")
  el-form(label-width="6em")
    el-form-item(label="安检单号")
      .formItemContent {{ detail.code }}
    el-form-item(label="安检日期")
      .formItemContent {{ formatDate(detail.createTime) }}
    el-form-item(label="客户名称")
      .formItemContent {{ detail.customer?.name || detail.customer }}
    el-form-item(label="风险等级")
      el-tag(type="success", v-if="detail.riskLevel == 0") 绿码
      el-tag(type="warning", v-else-if="detail.riskLevel === 1") 黄码
      el-tag(type="danger", v-else-if="detail.riskLevel === 2") 红码
    el-form-item(label="安检状态")
      el-tag(type="success", v-if="detail.isPass") 通过
      el-tag(type="danger", v-else-if="detail.isPass === false") 不通过
    el-form-item(label="审核状态")
      el-tag(type="success", v-if="detail.isAudit") 通过
      el-tag(type="danger", v-else-if="detail.isAudit === false") 不通过
      el-tag(type="info", v-else) 未处理
    el-form-item(label="整改状态", v-if="!detail.isPass")
      el-tag(type="success", v-if="detail.isRectify") 已整改
      el-tag(type="info", v-else) 未整改
    el-form-item(label="签收状态")
      el-tag(type="success", v-if="detail.signature") 已签收
      el-tag(type="info", v-else) 未签收
    el-form-item(label="现场照片")
      yy-imageList(v-model="detail.imageList", readonly)
    el-form-item(label="备注")
      .formItemContent {{ detail.remark }}
    el-form-item(label="安检项")
      el-form.checkItemList(label-width="8em")
        template(v-for="i in checkItemList")
          el-form-item(:label="i.name")
            .tagList(v-if="i.type === '多选'")
              el-tag(v-for="j in i.pickList", :color="securityRiskColorMap[j.riskLevel]", effect="dark") {{ j.text }}
            .tagList(v-else-if="i.type === '单选'")
              el-tag(:color="securityRiskColorMap[i.riskLevel]", effect="dark") {{ i.text }}
            yy-imageList(v-else-if="i.type === '图片'", v-model="i.imageList", readonly)
            .text(v-else) {{ i.text }}
          .advice {{ i.advice }}
      template(#footer)
    el-button(type="primary", @click="handleClose") 确定
</template>

<script setup>
import { securityRiskColorMap } from "@/provider/dict"

const { fetch, message, router } = inject("global")
const { formatTime, formatDate } = inject("format")

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

const detail = ref({
  company: {},
})
const checkItemList = ref([])

function getData() {
  fetch.get(`/security/record/${props.currentId}`).then((res) => {
    detail.value = res
    checkItemList.value = res?.checkItemList || []
  })
}

function handleClose() {
  emits("update:isShow", false)
}

watch(
  () => props.isShow,
  (val) => {
    if (val) {
      if (props.currentId) {
        getData()
      }
    }
  },
  { immediate: true },
)
</script>

<style lang="less" scoped>
.el-form-item {
  margin-bottom: 0;
}
.checkItemList {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 10px;
  background-color: var(--color-background);
  width: 600px;
  max-height: 300px;
  overflow-y: auto;
}
.tagList {
  display: flex;
  flex-direction: column;
  margin-left: 30px;
  .el-tag {
    margin-bottom: 10px;
  }
}
.advice {
  font-size: 12px;
  border-top: 1px dashed #fff;
  margin-top: 5px;
  margin-bottom: 10px;
  text-align: right;
}
</style>
