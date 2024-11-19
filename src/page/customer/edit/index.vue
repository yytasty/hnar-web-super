<template lang="pug">
.page
  el-card(header="编辑客户档案")
    el-tabs(v-model="activeTab", tabPosition="left")
      el-tab-pane(label="基本信息", name="基本信息")
        el-form(label-width="8em", inline)
        el-form(label-width="8em", inline v-if="formData.code")
          el-form-item(label="客户编号") 
            el-input(v-model="formData.code", style="width: 240px" disabled)
        el-form(label-width="8em", inline)
          el-form-item(label="客户名称", required) 
            el-input.dialogItem(v-model="formData.name")
          el-form-item(label="客户电话", required)
            el-input.dialogItem(v-model="formData.phone")
        el-form(label-width="8em")
          el-form-item(label="客户类型", required)
            el-radio-group(v-model="formData.type", size="small")
              el-radio-button(v-for="i in customerTypeList", :value="i") {{ i }}
          el-form-item(label="客户性质") 
            el-radio-group(v-model="formData.quality", size="small")
              el-radio-button(v-for="item in customerNatureList", :label="item", :value="item")
          el-form-item(label="付款方式")
            el-radio-group(v-model="formData.payType", size="small")
              el-radio-button(v-for="i in customerPayTypeList", :value="i") {{ i }}
          el-form-item(label="客户简称")
            el-input.dialogItem(v-model="formData.shortName")
          el-form-item(label="所属门店", required)
            yy-storeChip(:detail="formData.store")
            el-button(type="primary", size="small", @click="isShowStorePicker = true", style="margin-left: 20px") 选择门店
          el-form-item(label="所属配送员")
            yy-accountChip(:detail="formData.courier")
            el-button(type="primary", size="small", @click="isShowStaffPicker = true", style="margin-left: 20px") 选择配送员
          el-form-item(label="客户来源")
            el-radio-group(v-model="formData.source", size="small")
              el-radio-button(v-for="i in customerSourceList", :value="i") {{ i }}

          el-form-item(label="备注")
            el-input.dialogItem(v-model="formData.remark", type="textarea")

        el-form(label-width="6em", inline)
      el-tab-pane(label="地址信息", name="地址信息")
        ComAddressInfo(v-model="formData.addressInfo")
      el-tab-pane(label="用气信息", name="用气信息")
        el-form(label-width="8em")
          el-form-item(label="在用瓶数")
            el-input.dialogItem(v-model="formData.useBottleNum", type="number")
          el-form-item(label="备用瓶数")
            el-input.dialogItem(v-model="formData.standbyBottleNum", type="number")
          el-form-item(label="用气人数")
            el-input.dialogItem(v-model="formData.memberNum", type="number")
          el-form-item(label="允许赊销额度")
            el-input.dialogItem(v-model="formData.creditLimit", type="number")
          el-form-item(label="用气设备") 
            el-select.select(v-model="formData.deviceList", multiple, style="width: 200px")
              el-option(v-for="item in ['燃气炉', '热水器', '喷火枪']", :label="item", :value="item")
      el-tab-pane(label="合同信息", name="合同信息")
        el-form(label-width="8em")
          el-form-item(label="合同编号", required)
            el-input.dialogItem(v-model="formData.contractInfo.code")
        el-form(label-width="8em", inline)
          el-form-item(label="合同开始时间", required)
            el-date-picker(
              v-model="formData.contractInfo.startDate",
              type="date",
              style="width: 200px",
              :shortcuts="shortcutStart"
            )
          el-form-item(label="合同结束时间", required)
            el-date-picker(
              v-model="formData.contractInfo.endDate",
              type="date",
              style="width: 200px",
              clearable,
              :shortcuts="shortcutEnd"
            )
        el-form(label-width="8em")
          el-form-item(label="超期限制下单", required)
            el-switch(
              v-model="formData.contractInfo.isDisabledOrderForDeadline",
              style="--el-switch-off-color: #13ce66; --el-switch-on-color: #ff4949",
              active-text="超过合同截止日期不允许下单",
              inactive-text="超过合同截止日期允许下单"
            )
        el-form(label-width="8em")
          el-form-item(label="纸质合同附件") 
            yy-imageListUpload(v-model="formData.contractInfo.fileList")
          el-form-item(label="电子合同附件")
            el-button(
              v-if="!formData.contractInfo?.contractUrl",
              type="success",
              size="small",
              plain,
              @click="isShowContract = true"
            ) 生成电子合同
            yy-image(v-else, :src="formData.contractInfo.contractUrl")
      el-tab-pane(label="证照信息", name="证照信息")
        el-form(label-width="8em")
          el-form-item(label="证照类型") 
            el-radio-group.dialogItem(v-model="formData.licenseType", style="width: 300px")
              el-radio(value="身份证") 身份证
              el-radio(value="户口本") 户口本
              el-radio(value="营业执照") 营业执照
          ComIdCardInfo(v-if="formData.licenseType === '身份证'", v-model="formData.idCardInfo")
          ComHouseholdInfo(v-if="formData.licenseType === '户口本'", v-model="formData.householdInfo")
          ComBusinessLicenseInfo(v-else-if="formData.licenseType === '营业执照'", v-model="formData.businessLicenseInfo")

    .actionBar
      el-button(type="primary", @click="handleSubmit") 确定
      el-button(type="default", @click="router.push('/customer/list')") 取消

comStaffPick(v-model="isShowStaffPicker", @success="onStaffPick")
ComStorePick(v-model="isShowStorePicker", @success="onStorePick")
ComContract(v-model:isShow="isShowContract", :currentId="queryId", @success="getData")
</template>

<script setup>
import {
  courierList,
  customerNatureList,
  customerSourceList,
  customerTypeList,
  ensureCacheData,
} from "@/provider/cache"
import { customerPayTypeList } from "@/provider/dict"

import ComBusinessLicenseInfo from "@/component/mixin/businessLicenseInfo.vue"
import ComIdCardInfo from "@/component/mixin/idCardInfo.vue"
import ComHouseholdInfo from "@/component/mixin/householdInfo.vue"
import ComAddressInfo from "@/component/mixin/addressInfo.vue"
import ComStaffPick from "@/component/picker/staff.vue"
import ComStorePick from "@/component/picker/store.vue"
import ComContract from "../list/__com__/contract.vue"

import { dayjs } from "element-plus"
import { isContactNumber } from "@/util/validate"
import { useRouteQuery } from "@vueuse/router"

const { formatDate } = inject("format")
const { fetch, message, router } = inject("global")
const { companyInfo } = inject("account")

const queryId = useRouteQuery("id", "", { transform: String })

const activeTab = ref("基本信息")

const shortcutStart = [{ text: "今天", value: dayjs() }]
const shortcutEnd = [
  { text: "下个月", value: dayjs().add(1, "month").toDate() },
  { text: "三个月后", value: dayjs().add(3, "month").toDate() },
  { text: "六个月后", value: dayjs().add(6, "month").toDate() },
  { text: "一年后", value: dayjs().add(1, "year").toDate() },
  { text: "两年后", value: dayjs().add(2, "year").toDate() },
]

const formData = ref({
  addressInfo: {},
  idCardInfo: {},
  businessLicenseInfo: {},
  contractInfo: {},
})

function validate() {
  if (!formData.value.store) {
    return Promise.reject("请先选择所属门店")
  }
  // if (!formData.value.code) {
  //   return Promise.reject("请先填写客户编号")
  // }
  if (!formData.value.name) {
    return Promise.reject("请先填写客户名称")
  }
  if (!formData.value.phone) {
    return Promise.reject("请先填写客户电话")
  }
  if (!isContactNumber(formData.value.phone)) {
    return Promise.reject("请填写正确的客户电话（手机号码/座机号码）")
  }
  if (!formData.value.type) {
    return Promise.reject("请先选择客户类型")
  }
  if (formData.value.contractInfo.code) {
    if (!formData.value.contractInfo.startDate) {
      return Promise.reject("请先填写合同开始时间")
    }
    if (!formData.value.contractInfo.endDate) {
      return Promise.reject("请先填写合同结束时间")
    }
  }
  return Promise.resolve()
}

// 点击保存
function handleSubmit() {
  validate()
    .then(() => {
      if (formData.value._id) {
        return fetch.put(`/customer/${formData.value._id}`, formData.value)
      } else {
        return fetch.post(`/customer`, { ...formData.value, source: "后台录入" })
      }
    })
    .then(() => {
      message.success(formData.value._id ? `修改客户档案成功` : `添加客户档案成功`)
      router.push("/customer/list")
    })
    .catch((err) => {
      message.error(err?.msg || err)
    })
}

function getData() {
  if (!queryId.value) {
    formData.value = {
      addressInfo: {},
      idCardInfo: {},
      businessLicenseInfo: {},
      contractInfo: {
        contractUrl: "",
      },
      licenseType: "身份证",
    }
  } else {
    fetch.get(`/customer/${queryId.value}`).then((res) => {
      formData.value = {
        addressInfo: {},
        idCardInfo: {},
        businessLicenseInfo: {},
        contractInfo: {
          contractUrl: "",
        },
        licenseType: "身份证",
        ...res,
      }
    })
  }
}

const isShowStaffPicker = ref(false)
function onStaffPick(val) {
  if (!val?._id) return
  formData.value.courier = val
  isShowStaffPicker.value = false
}

const isShowStorePicker = ref(false)
function onStorePick(val) {
  if (!val?._id) return
  formData.value.store = val
  isShowStorePicker.value = false
}

const isShowContract = ref(false)

onMounted(async () => {
  await ensureCacheData("customerTypeList")
  await ensureCacheData("customerNatureList")
  await ensureCacheData("customerSourceList")
  getData()
})
</script>

<style lang="less" scoped>
.dialogItem {
  width: 300px;
}
.actionBar {
  display: flex;
  justify-content: center;
  padding-top: 20px;
  border-top: 1px solid var(--color-border);
}
</style>
