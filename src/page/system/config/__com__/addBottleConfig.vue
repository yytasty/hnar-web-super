<template lang="pug">
.componentContainer
  el-form
    el-form-item(label="必填项", v-if="currentConfigValue.requireForm")
      el-form(label-width="8em")
        el-form-item(label="使用门店")
          el-checkbox(v-model="currentConfigValue.requireForm.store")
        el-form-item(label="检验气站")
          el-checkbox(v-model="currentConfigValue.requireForm.auditStation")
        el-form-item(label="产权类型")
          el-checkbox(v-model="currentConfigValue.requireForm.property")
        el-form-item(label="产权编号")
          el-checkbox(v-model="currentConfigValue.requireForm.propertyCode")
        el-form-item(label="电子标签")
          el-checkbox(v-model="currentConfigValue.requireForm.rfid")
        el-form-item(label="产品编号")
          el-checkbox(v-model="currentConfigValue.requireForm.productCode")
        el-form-item(label="内部编号")
          el-checkbox(v-model="currentConfigValue.requireForm.internalCode")
        el-form-item(label="钢瓶规格")
          el-checkbox(v-model="currentConfigValue.requireForm.bottleSpecific")
        el-form-item(label="钢瓶厂家")
          el-checkbox(v-model="currentConfigValue.requireForm.bottleFactory")
        el-form-item(label="归属公司")
          el-checkbox(v-model="currentConfigValue.requireForm.company")
        el-form-item(label="使用气站")
          el-checkbox(v-model="currentConfigValue.requireForm.station")
        el-form-item(label="使用门店")
          el-checkbox(v-model="currentConfigValue.requireForm.store")
        el-form-item(label="生产日期")
          el-checkbox(v-model="currentConfigValue.requireForm.productionDate")
        el-form-item(label="末检日期")
          el-checkbox(v-model="currentConfigValue.requireForm.auditDate")
        el-form-item(label="下次检验日期")
          el-checkbox(v-model="currentConfigValue.requireForm.nextAuditDate")
        el-form-item(label="报废日期")
          el-checkbox(v-model="currentConfigValue.requireForm.scrapDate")
        el-form-item(label="设计使用截止日期")
          el-checkbox(v-model="currentConfigValue.requireForm.designEndDate")
        el-form-item(label="终止使用日期")
          el-checkbox(v-model="currentConfigValue.requireForm.endDate")
        el-form-item(label="公称压力")
          el-checkbox(v-model="currentConfigValue.requireForm.generalPressure")
        el-form-item(label="水实验压力")
          el-checkbox(v-model="currentConfigValue.requireForm.waterPressure")
        el-form-item(label="容积")
          el-checkbox(v-model="currentConfigValue.requireForm.volume")
        el-form-item(label="检验报告")
          el-checkbox(v-model="currentConfigValue.requireForm.auditReportList")
        el-form-item(label="钢瓶交付文件")
          el-checkbox(v-model="currentConfigValue.requireForm.deliveryFileList")
        el-form-item(label="检验质量说明书")
          el-checkbox(v-model="currentConfigValue.requireForm.auditQualityFileList")
        el-form-item(label="制造监督验证书")
          el-checkbox(v-model="currentConfigValue.requireForm.manufactureFileList")
        el-form-item(label="钢瓶图片")
          el-checkbox(v-model="currentConfigValue.requireForm.bottleImageList")
        el-form-item(label="阀门图片")
          el-checkbox(v-model="currentConfigValue.requireForm.valveImageList")
        el-form-item(label="备注")
          el-checkbox(v-model="currentConfigValue.requireForm.remark")
    el-form-item(label="最小数量", v-if="currentConfigValue.minForm")
      el-form(label-width="8em")
        el-form-item(label="检验报告")
          el-input-number(v-model="currentConfigValue.minForm.auditReportList", :min="0")
        el-form-item(label="钢瓶交付文件")
          el-input-number(v-model="currentConfigValue.minForm.deliveryFileList", :min="0")
        el-form-item(label="检验质量说明书")
          el-input-number(v-model="currentConfigValue.minForm.auditQualityFileList", :min="0")
        el-form-item(label="制造监督验证书")
          el-input-number(v-model="currentConfigValue.minForm.manufactureFileList", :min="0")
        el-form-item(label="钢瓶图片")
          el-input-number(v-model="currentConfigValue.minForm.bottleImageList", :min="0")
        el-form-item(label="阀门图片")
          el-input-number(v-model="currentConfigValue.minForm.valveImageList", :min="0")
</template>

<script setup>
import { computed, inject, onMounted, ref } from "vue"

const { fetch, message, router } = inject("global")

const currentConfigValue = inject("currentConfigValue", {
  requireForm: {
    company: false,
    station: true,
    store: false,
    auditStation: false,
    property: false,
    propertyCode: false,
    rfid: false,
    productCode: false,
    internalCode: false,
    bottleSpecific: true,
    bottleFactory: true,
    productionDate: false,
    auditDate: false,
    nextAuditDate: false,
    scrapDate: false,
    designEndDate: false,
    endDate: false,
    generalPressure: false,
    waterPressure: false,
    volume: false,
    auditReportList: false,
    deliveryFileList: false,
    auditQualityFileList: false,
    manufactureFileList: false,
    bottleImageList: false,
    valveImageList: false,
    remark: false,
  },
  minForm: {
    auditReportList: 0,
    deliveryFileList: 0,
    auditQualityFileList: 0,
    manufactureFileList: 0,
    bottleImageList: 3,
    valveImageList: 0,
  },
})

watch(
  () => currentConfigValue.value,
  (val) => {
    if (!currentConfigValue.value?.requireForm) {
      currentConfigValue.value.requireForm = {
        company: false,
        station: true,
        store: false,
        auditStation: false,
        property: false,
        propertyCode: false,
        rfid: false,
        productCode: false,
        internalCode: false,
        bottleSpecific: true,
        bottleFactory: true,
        productionDate: false,
        auditDate: false,
        nextAuditDate: false,
        scrapDate: false,
        designEndDate: false,
        endDate: false,
        generalPressure: false,
        waterPressure: false,
        volume: false,
        auditReportList: false,
        deliveryFileList: false,
        auditQualityFileList: false,
        manufactureFileList: false,
        bottleImageList: false,
        valveImageList: false,
        remark: false,
      }
    }
    if (!currentConfigValue.value?.minForm) {
      currentConfigValue.value.minForm = {
        auditReportList: 0,
        deliveryFileList: 0,
        auditQualityFileList: 0,
        manufactureFileList: 0,
        bottleImageList: 3,
        valveImageList: 0,
      }
    }
  },
  { immediate: true },
)
</script>

<style lang="less" scoped>
.componentContainer {
  width: 100%;
}
</style>
