<template lang="pug">
yy-dialog(:modelValue="isShow", @close="emits('update:isShow', false)", width="800px")
  .pageContent
    .contractPreview(ref="contractPreviewDom", v-html="previewContract")
  template(#footer)
    el-button(type="primary", @click="handleSubmit") 确定
    el-button(@click="emits('update:isShow', false)") 取消
</template>

<script setup>
import html2canvas from "html2canvas"
import { ensureCacheData } from "@/provider/cache"
import { dayjs } from "element-plus"
import { isContactNumber } from "@/util/validate"

const { formatDate, formatPrice, formatPriceChinese } = inject("format")
const { fetch, message, router, loading } = inject("global")
const { companyInfo } = inject("account")

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

const articleData = ref({})
const contractConfig = ref({
  signatureImage: "",
})
function getArticleData() {
  fetch.get(`/article/key/customerContract`).then((res) => {
    if (res) {
      articleData.value = res
    } else {
      message.error("获取合同模板失败")
    }
  })
  fetch.get("/config/contractConfig").then((res) => {
    if (res?.signatureImage) {
      contractConfig.value = res
      if (contractConfig.value?.signatureImage) {
        fetch.get("/upload/signedUrl", { params: { url: contractConfig.value?.signatureImage } }).then((url) => {
          articleData.value.content = articleData.value.content.replace(
            "{{公司签章图片}}",
            `<img src="${url}" style="width:100px;height:100px" />`,
          )
        })
      }
    }
  })
}

const previewContract = computed(() => {
  if (!articleData.value?.content) {
    return ""
  }
  if (!customerData.value?.contractInfo) {
    return articleData.value.content
  }
  const contractInfo = customerData.value.contractInfo
  if (customerData.value.contractInfo?.signatureImage) {
    fetch.get("/upload/signedUrl", { params: { url: customerData.value.contractInfo?.signatureImage } }).then((res) => {
      articleData.value.content = articleData.value.content.replace(
        "{{用户签章图片}}",
        `<img src="${res?.url || res}" style="width:100px;height:100px" />`,
      )
    })
  }
  let result = articleData.value.content
    .replace("{{合同编号}}", contractInfo?.code)
    .replace("{{用户姓名}}", customerData.value.name)
    .replaceAll("{{公司全称}}", customerData.value.company?.name)
    .replaceAll("{{公司简称}}", customerData.value.company?.shortName || customerData.value.company?.name)
    .replace("{{用户电话}}", customerData.value.phone)
    .replace("{{用户地址}}", customerData.value.addressInfo?.address)
    .replaceAll("{{配送员姓名}}", customerData.value.courier?.name || "配送员")
    .replace(
      "{{用户证件号}}",
      customerData.value.idCardInfo?.idNumber ||
        customerData.value.businessLicenseInfo?.creditCode ||
        customerData.value.householdInfo?.householdNumber,
    )
    .replaceAll("{{日期}}", formatDate(contractInfo?.startDate))
  result = result
    .replace("{{钢瓶规格}}", guarantyInfo.value?.bottleSpecific?.name)
    .replace("{{押瓶数量}}", guarantyInfo.value?.count)
  result = result
    .replace("{{押金}}", formatPrice(guarantyInfo.value?.guarantyPrice))
    .replace("{{押金大写}}", formatPriceChinese(guarantyInfo.value?.guarantyPrice))
  return result
})

const customerData = ref({
  addressInfo: {},
  idCardInfo: {},
  businessLicenseInfo: {},
  contractInfo: {},
})
const guarantyInfo = ref({})
function getCustomerData() {
  fetch.get(`/customer/${props.currentId}`).then((res) => {
    customerData.value = {
      addressInfo: {},
      idCardInfo: {},
      businessLicenseInfo: {},
      contractInfo: {},
      ...res,
    }
  })
  fetch.get(`/customer/${props.currentId}/guaranty`).then((res) => {
    if (res) {
      guarantyInfo.value = res
    }
  })
}

const contractPreviewDom = ref(null)
function handleSubmit() {
  loading.lock()
  html2canvas(contractPreviewDom.value, { useCORS: true })
    .then((canvas) => {
      const base64 = canvas.toDataURL("image/png")
      return fetch.post(`/customer/${props.currentId}/contract`, {
        base64: base64.split(",")[1],
      })
    })
    .then((url) => {
      emits("success")
      emits("update:isShow", false)
      return fetch.get("/upload/signedUrl", { params: { url: url } })
    })
    .then((signUrl) => {
      window.open(signUrl)
    })
    .catch((err) => {
      message.error(err?.msg || err?.message || err)
    })
    .finally(() => {
      loading.hide()
    })
}

watch(
  () => props.isShow,
  async (val) => {
    if (val) {
      getCustomerData()
    }
  },
  { immediate: true },
)

onMounted(() => {
  getArticleData()
})
</script>

<style lang="less" scoped>
.contractPreview {
  padding: 20px;
  line-height: 1.8;
}
</style>
