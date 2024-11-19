<template lang="pug">
template(label-width="6em", v-if="detail?.certificateList")
  .certificateItem(v-for="(i, n) in detail.certificateList", inline, label-width="6em")
    .itemAction
      el-button(type="danger", plain, size="small", @click="detail.certificateList.splice(n, 1)") 删除
    el-form(label-width="6em")
      el-form-item(label="证书类别")
        el-select(v-model="i.type")
          el-option(label="营业执照", value="营业执照")
          el-option(v-for="item in companyCertificateTypeList", :label="item", :value="item")
      el-form-item(label="证书图片")
        yy-imageListUpload(v-model="i.imageList")
    el-form(label-width="6em", inline)
      el-form-item(label="证书名称")
        el-input(v-model="i.name")
      el-form-item(label="证书编号")
        el-input(v-model="i.sn")
      el-form-item(label="发证机关")
        el-input(v-model="i.authority")
      el-form-item(label="有效期开始")
        el-date-picker(v-model="i.startDate", type="date", style="width: 200px")
      el-form-item(label="有效期结束")
        el-date-picker(v-model="i.endDate", type="date", style="width: 200px")
      el-form-item(label="证书详情")
        el-input(v-model="i.detail", type="textarea", style="width: 300px")
  .actionBar
    el-button(type="success", plain, v-if="!isBusinessLicenseExist", @click="handleImportBusinessLicense") 导入营业执照
    el-button(type="success", plain, v-else, @click="handleAddItem") 添加证书
</template>

<script setup>
import { pickAndUploadFileList } from "@/provider/file"
const { formatTime, formatDate } = inject("format")

const { fetch, message, router } = inject("global")

const detail = inject("detail")

const isBusinessLicenseExist = computed(() =>
  detail.value?.certificateList?.some((i) => i?.type == "营业执照" && i.imageList?.length),
)

function handleImportBusinessLicense() {
  pickAndUploadFileList({ count: 1, type: "image" })
    .then(async (imageList) => {
      detail.value.certificateList.push({
        type: "营业执照",
        imageList: imageList,
        authority: "",
      })
      return fetch.post(`/ocr/businessLicense`, {
        image: imageList[0],
      })
    })
    .then((result) => {
      if (!detail.value.extendInfo.address) {
        detail.value.extendInfo.address = result.businessAddress
      }
      if (!detail.value.extendInfo.legalPerson) {
        detail.value.extendInfo.legalPerson = result.legalPerson
      }
      if (!detail.value.extendInfo.creditCode) {
        detail.value.extendInfo.creditCode = result.creditCode
      }
      const item = detail.value.certificateList.find((i) => i.type == "营业执照")
      console.log(item, result, 1111111)
      item.name = result.data.companyName
      item.sn = result.data.creditCode
      item.startDate = formatDate(result.data.validFromDate)
      item.endDate = formatDate(result.data.validToDate)
      item.detail = `经营范围：${result.data.businessScope}`
    })
}

function handleAddItem() {
  const nextType =
    companyCertificateTypeList.value.find((i) => !detail.value.certificateList.some((j) => j.type == i)) || "其它"
  detail.value.certificateList.push({
    type: nextType,
    imageList: [],
    name: "",
    sn: "",
    authority: "",
    startDate: "",
    endDate: "",
    detail: "",
  })
}

const companyCertificateTypeList = ref([])
function getCompanyCertificateTypeList() {
  fetch.get("/config/companyCertificateTypeList").then((res) => {
    companyCertificateTypeList.value = res.data
  })
}

onMounted(() => {
  getCompanyCertificateTypeList()
})
</script>

<style lang="less" scoped>
.certificateItem {
  border: 1px solid var(--color-border);
  margin-bottom: 20px;
  padding-top: 10px;
  position: relative;
  .itemAction {
    position: absolute;
    right: 10px;
    top: 10px;
  }
}
</style>
