<template lang="pug">
yy-dialog(:modelValue="isShow", @close="emits('update:isShow', false)", :title="title")
  el-form(label-width="12em")
    el-form-item(label="来源订单")
      el-input(v-model="formData.fromOrder")
    el-form-item(label="客户", required)
      yy-customerSelect(v-model="formData.customer")
      //- yy-customerChip(:detail="formData.customer")
      //- el-tag(type="success", style="margin-left: 10px", @click="isShowCustomerPick = true") 选择客户
    el-form-item(label="押金单号", required)
      el-input(v-model="formData.code")
    el-form-item(label="押瓶规格")
      el-tag(v-if="formData.bottleSpecific", type="info") {{ formData.bottleSpecific?.name || formData.bottleSpecific }}
      el-tag(type="success", style="margin-left: 10px", @click="isShowSpecificPick = true") 选择押瓶规格
    el-form-item(label="押金")
      el-input-number(v-model="formData.guarantyPrice", :min="0", :step="1")
    el-form-item(label="押瓶数量")
      el-input-number(v-model="formData.count", :min="0", :step="1")
    el-form-item(label="押瓶开始时间")
      el-date-picker(v-model="formData.startDate", type="date", placeholder="选择日期", style="width: 300px")
    el-form-item(label="收租方式")
      el-radio-group(v-model="formData.rentType")
        el-radio(v-for="i in rentTypeList", :value="i") {{ i }}
    el-form-item(label="租金")
      el-input-number(v-model="formData.rentPrice", :min="0", :step="1")
    el-form-item(label="附件")
      yy-imageListUpload(v-model="formData.imageList")
    el-form-item(label="状态")
      el-radio-group(v-model="formData.status")
        el-radio(v-for="i in ['待处理', '生效中', '已结束', '已取消']", :value="i") {{ i }}
    el-form-item(label="备注")
      el-input(v-model="formData.remark", type="textarea", style="width: 300px")
  template(#footer)
    el-button(type="primary", @click="handleSubmit") 确定
    el-button(type="default", @click="emits('update:isShow', false)") 取消

ComCustomerPick(v-model="isShowCustomerPick", @success="onCustomerPickSuccess")
ComSpecificPick(v-model="isShowSpecificPick", @success="onSpecificPickSuccess")
</template>

<script setup>
import ComCustomerPick from "@/component/picker/customer.vue"
import ComSpecificPick from "@/component/picker/specific.vue"
import { ensureCacheData, rentTypeList } from "@/provider/cache"

const { fetch, message, router } = inject("global")

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

const baseName = "押瓶单"
const basePath = `/guaranty`
const title = computed(() =>
  props.isViewMode ? `${baseName}详情` : props.currentId ? `修改${baseName}` : `添加${baseName}`,
)

const formData = ref({
  fromOrder: "",
  customer: "",
  code: "",
  bottleSpecific: "",
  guarantyPrice: 0,
  count: 0,
  startDate: 0,
  rentType: 0,
  rentPrice: 0,
  source: "后台",
  remark: "",
})

function validate() {
  if (!formData.value.customer) {
    return Promise.reject("请选择客户")
  }
  if (!formData.value.code) {
    return Promise.reject("请输入押金单号")
  }
  return Promise.resolve()
}

function handleSubmit() {
  validate()
    .then(() => {
      if (formData.value._id) {
        return fetch.put(`${basePath}/${formData.value._id}`, formData.value)
      } else {
        return fetch.post(`${basePath}`, formData.value)
      }
    })
    .then(() => {
      message.success(formData.value._id ? `修改${baseName}成功` : `添加${baseName}成功`)
      emits("update:isShow", false)
      emits("success")
    })
    .catch((err) => {
      message.error(err?.msg || err)
    })
}

const isShowCustomerPick = ref(false)
function onCustomerPickSuccess(val) {
  if (!val._id) return
  formData.value.customer = val
}
const isShowSpecificPick = ref(false)
function onSpecificPickSuccess(val) {
  if (!val._id) return
  formData.value.bottleSpecific = val
}

onBeforeMount(() => {
  ensureCacheData("rentTypeList")
})

watch(
  () => props.isShow,
  (val) => {
    if (val) {
      if (props.currentId) {
        fetch.get(`${basePath}/${props.currentId}`).then((res) => {
          formData.value = { ...res }
        })
      } else {
        formData.value = {
          fromOrder: "",
          customer: "",
          code: "",
          bottleSpecific: "",
          guarantyPrice: 0,
          count: 0,
          startDate: 0,
          rentType: 0,
          rentPrice: 0,
          source: "后台",
          remark: "",
        }
      }
    }
  },
  { immediate: true },
)
</script>

<style lang="less" scoped></style>
