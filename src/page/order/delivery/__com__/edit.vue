<template lang="pug">
yy-dialog(:modelValue="isShow", @close="handleClose", title="编辑配送单信息")
  .body
    el-form(label-width="6em", inline)
      el-form-item(label="联系人")
        el-input(v-model="formData.contactName")
      el-form-item(label="联系电话")
        el-input(v-model="formData.contactPhone")
    el-form(label-width="6em", inline)
      el-form-item(label="地址")
        el-input(v-model="formData.address")
      el-form-item(label="楼层")
        el-input-number(v-model="formData.floor")
    el-form(label-width="6em", inline)
      el-form-item(label="预约时间")
        el-date-picker(v-model="formData.planTime", type="datetime")
      el-form-item(label="是否加急")
        el-switch(v-model="formData.isUrgent")
    el-form(label-width="6em", inline)
      el-form-item(label="空瓶")
        el-input(
          v-model="formData.emptyBottleList",
          placeholder="多个钢瓶编号请用逗号分隔或换行",
          type="textarea",
          :autosize="{ minRows: 2, maxRows: 20 }",
          style="width: 300px"
        )
      el-form-item(label="重瓶")
        el-input(
          v-model="formData.filledBottleList",
          placeholder="多个钢瓶编号请用逗号分隔或换行",
          type="textarea",
          :autosize="{ minRows: 2, maxRows: 20 }",
          style="width: 300px"
        )
    el-form(label-width="6em")
      el-form-item(label="状态")
        el-radio-group(v-model="formData.status")
          el-radio(v-for="i in ['未派工', '已派工', '已完成', '已作废']", :value="i") {{ i }}
      el-form-item(label="备注")
        el-input(
          v-model="formData.remark",
          type="textarea",
          :autosize="{ minRows: 2, maxRows: 20 }",
          style="width: 300px"
        )
  template(#footer) 
    el-button(type="info", @click="handleClose") 取消
    el-button(type="primary", @click="handleSubmit") 确定
</template>

<script setup>
const { fetch, message, router } = inject("global")

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
  deliveryId: {
    type: String,
    default: "",
  },
})
const emits = defineEmits(["update:isShow", "success"])

function handleClose() {
  emits("update:isShow", false)
}

const formData = ref({
  planTime: "",
  contactName: "",
  contactPhone: "",
  address: "",
  floor: 0,
  isUrgent: false,
  remark: "",
  emptyBottleList: "",
  filledBottleList: "",
})
const orderDetail = ref({})
const deliveryDetail = ref({})
const customerDetail = ref({})
function getData() {
  fetch.get(`/delivery/${props.deliveryId}`).then((res) => {
    orderDetail.value = res.order
    formData.value = res.delivery
    customerDetail.value = res.customer
    formData.value.emptyBottleList = res.delivery.emptyBottleList.map((i) => i.sn).join("\n")
    formData.value.filledBottleList = res.delivery.filledBottleList.map((i) => i.sn).join("\n")
  })
}

function handleSubmit() {
  if (formData.value.contactPhone) {
    const telReg = /^(\d{3,4}-)?\d{7,8}$|^1[3-9]\d{9}$/
    if (!telReg.test(formData.value.contactPhone)) {
      message.error("请填写正确的联系电话（手机号码/座机号码）")
      return
    }
  }
  const payload = {
    ...formData.value,
    emptyBottleList: formData.value.emptyBottleList.split(/\n|\.|\,|，|\ /).filter((i) => i),
    filledBottleList: formData.value.filledBottleList.split(/\n|\.|\,|，|\ /).filter((i) => i),
  }
  fetch.put(`/delivery/${props.deliveryId}`, payload).then(() => {
    message.success("操作成功")
    emits("success")
    handleClose()
  })
}

watch(
  () => props.isShow,
  (val) => {
    if (val) {
      getData()
    }
  },
)
</script>

<style lang="less" scoped>
.componentContainer {
  width: 100%;
}
</style>
