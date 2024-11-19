<template lang="pug">
yy-dialog(:modelValue="isShow", @close="handleClose", title="批量导入客户资料")
  el-form(label-width="8em", v-if="!excelFile")
    el-form-item(label="导入模板")
      el-button(type="primary", plain, @click="handleDownloadTemplate") 下载 客户资料导入模板.xlsx
    el-form-item(label="说明")
      span 请不要修改模板中的表头，直接填写数据即可
    el-form-item(label="选择导入文件")
      el-button(type="primary", @click="handlePickFile") 选择导入文件
  div(style="padding: 0 40px", v-else)
    el-descriptions(:column="1")
      el-descriptions-item(label="文件名") {{ excelFile.name }}
      el-descriptions-item(label="最后修改") {{ formatTime(excelFile.lastModified) }}
      el-descriptions-item(label="大小") {{ formatSize(excelFile.size) }}
    el-table(:data="excelData", stripe)
      el-table-column(label="序号", type="index", fixed="left", width="60", align="center")
      el-table-column(v-for="i in excelHeader", :label="i", :prop="i", align="center")
      el-table-column(label="导入", align="center", fixed="right", width="60")
        template(#default="{ row }")
          el-icon.is-loading(v-if="row.loading", color="var(--color-primary)")
            Loading
          el-icon(
            v-else-if="row.isError",
            color="var(--color-red)",
            @click="(row.isPick = false), (row.isError = false)"
          )
            Warning
          el-icon(v-else-if="row.isSuccess", color="var(--color-green)")
            CircleCheck
          el-checkbox(v-else, v-model="row.isPick")
    el-alert(v-if="errorMessage", type="error", :closable="false", style="white-space: pre-wrap") {{ errorMessage }}
  template(#footer)
    template(v-if="excelFile")
      el-button(v-if="errorMessage", type="primary", @click="validateExcel") 检查数据
      el-button(v-else-if="isImportFinish", type="primary", @click="handleSuccess") 完成
      el-button(v-else, type="primary", @click="handleSubmit") 确定导入
    el-button(type="default", @click="handleClose") 取消
</template>

<script setup>
import excelTemplateFile from "@/assets/excel/客户资料导入模板.xlsx?url"
import { customerNatureList, customerSourceList, customerTypeList, ensureCacheData } from "@/provider/cache"
import { customerPayTypeList, customerRiskGradeList } from "@/provider/dict"
import { getExcelSheet, pickExcel } from "@/provider/file"
import { isDateTime } from "@/util/validate"

const { fetch, message, router, loading } = inject("global")
const { formatDate, formatTime, formatSize } = inject("format")

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits(["update:isShow", "success"])

function handleClose() {
  emits("update:isShow", false)
}
function handleDownloadTemplate() {
  window.open(excelTemplateFile)
}

function handleSuccess() {
  handleClose()
  emits("success")
}

const excelFile = ref(null)
const excelHeader = ref([])
const excelData = ref([])
const isImportFinish = computed(() => excelData.value.every((i) => i.isSuccess || i.isError || !i.isPick))
function handlePickFile() {
  loading.lock()
  pickExcel()
    .then((file) => {
      excelFile.value = file
      return getExcelSheet(file)
    })
    .then((res) => {
      excelHeader.value = res?.header || []
      excelData.value = (res?.data || []).map((i, n) => {
        return {
          ...i,
          index: n + 1,
          isPick: true,
        }
      })
    })
    .finally(() => {
      loading.hide()
    })
}

const excelHeaderList = [
  {
    name: "客户编号",
    value: "code",
    require: true,
  },
  {
    name: "客户名称",
    value: "name",
    require: true,
  },
  {
    name: "客户电话",
    value: "phone",
  },
  {
    name: "所属公司",
    value: "company",
  },
  {
    name: "所属部门",
    value: "station",
  },
  {
    name: "所属门店",
    value: "store",
  },
  {
    name: "配送员",
    value: "courier",
  },
  {
    name: "客户类型",
    value: "type",
  },
  {
    name: "客户性质",
    value: "quality",
  },
  {
    name: "付款方式",
    value: "payType",
  },
  {
    name: "身份证号",
    value: "idCardNo",
  },
  {
    name: "地址",
    value: "address",
  },
  {
    name: "合同编号",
    value: "contractCode",
  },
  {
    name: "合同开始日期",
    value: "contractStartDate",
  },
  {
    name: "风险等级",
    value: "riskGrade",
  },
]
function getRowValueForSubmit(row) {
  const res = {}
  for (let v of excelHeaderList) {
    res[v.value] = row[v.name]
  }
  if (res.address.richText) {
    res.address = res.address.richText.map((i) => i.text).join("")
  }
  return res
}

const errorMessage = ref("请先执行数据检查")
async function validateRow(row) {
  if (row.客户类型 && !customerTypeList.value.includes(String(row.客户类型))) {
    errorMessage.value += `第${row.index}行：客户类型错误\n`
    return false
  }
  if (row.客户性质 && !customerNatureList.value.includes(String(row.客户性质))) {
    errorMessage.value += `第${row.index}行：客户性质错误\n`
    return false
  }
  if (row.付款方式 && !customerPayTypeList.includes(row.付款方式)) {
    errorMessage.value += `第${row.index}行：付款方式错误\n`
    return false
  }
  if (row.风险等级 && !customerRiskGradeList.includes(row.风险等级)) {
    errorMessage.value += `第${row.index}行：风险等级错误\n`
    return false
  }
  if (row.合同开始日期 && !isDateTime(row.合同开始日期)) {
    errorMessage.value += `第${row.index}行：出厂日期格式错误\n`
    return false
  }
  return fetch
    .post("/customer/import/row/check", getRowValueForSubmit(row))
    .then(() => {
      return true
    })
    .catch((err) => {
      errorMessage.value += `第${row.index}行：${err.msg}\n`
      return false
    })
}
async function validateExcel() {
  errorMessage.value = ""
  const lackHeader = excelHeaderList.filter((i) => i.require && !excelHeader.value.includes(i.name)).map((i) => i.name)
  if (lackHeader.length) {
    errorMessage.value += `缺少必要字段：${lackHeader.join("、")}\n`
  }
  for (let row of excelData.value) {
    if (!row.isPick) continue
    row.loading = true
    row.isCheck = await validateRow(row)
    row.loading = false
    if (!row.isCheck) {
      row.isError = true
      break
    }
  }
  if (!errorMessage.value) {
    message.success("数据检查通过")
  }
}
async function handleSubmit() {
  if (loading.isLock()) return
  loading.lock()
  for (let row of excelData.value) {
    if (!row.isPick) continue
    row.loading = true
    await fetch
      .post("/customer/import/row", getRowValueForSubmit(row))
      .then(() => {
        row.isSuccess = true
      })
      .catch(() => {
        row.isError = true
      })
      .finally(() => {
        row.loading = false
      })
  }
  message.success("导入队列完成")
  loading.hide()
}

watch(
  () => props.isShow,
  (val) => {
    if (val) {
      excelFile.value = null
      errorMessage.value = "请先执行数据检查"
    }
  },
  { immediate: true },
)

onBeforeMount(async () => {
  ensureCacheData("customerTypeList")
  ensureCacheData("customerSourceList")
  ensureCacheData("customerNatureList")
})
</script>

<style lang="less" scoped></style>
