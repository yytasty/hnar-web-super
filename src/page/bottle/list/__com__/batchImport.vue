<template lang="pug">
yy-dialog(:modelValue="isShow", @close="handleClose", title="批量导入钢瓶档案")
  el-form(label-width="8em", v-if="!excelFile")
    el-form-item(label="导入模板")
      el-button(type="primary", plain, @click="handleDownloadTemplate") 下载 钢瓶档案导入模板.xlsx
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
import excelTemplateFile from "@/assets/excel/钢瓶档案导入模板.xlsx?url"
import { getExcelSheet, pickExcel } from "@/provider/file"
import { isDateTime } from "@/util/validate"
const { fetch, message, router, loading } = inject("global")
const { formatTime, formatSize } = inject("format")

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
    name: "钢瓶条码",
    value: "sn",
    require: true,
  },
  {
    name: "电子标签",
    value: "rfid",
    require: true,
  },
  {
    name: "单位内编号",
    value: "internalCode",
    require: true,
  },
  {
    name: "产品编号",
    value: "productCode",
    require: true,
  },
  {
    name: "使用单位",
    value: "station",
    require: false,
  },
  {
    name: "使用门店",
    value: "store",
    require: false,
  },
  {
    name: "制造单位",
    value: "bottleFactory",
    require: true,
  },
  {
    name: "钢瓶规格",
    value: "bottleSpecific",
    require: true,
  },
  {
    name: "产权类型",
    value: "property",
  },
  {
    name: "出厂日期",
    value: "productionDate",
  },
  {
    name: "末检日期",
    value: "auditDate",
  },
  {
    name: "下检日期",
    value: "nextAuditDate",
  },
  {
    name: "报废日期",
    value: "scrapDate",
  },
]
function getRowValueForSubmit(row) {
  const res = {}
  for (let v of excelHeaderList) {
    res[v.value] = row[v.name]
  }
  return res
}

const errorMessage = ref("请先执行数据检查")
async function validateRow(row) {
  if (row.产权类型 && !["自有", "托管"].includes(row.产权类型)) {
    errorMessage.value += `第${row.index}行：产权类型错误\n`
    return false
  }
  if (row.出厂日期 && !isDateTime(row.出厂日期)) {
    errorMessage.value += `第${row.index}行：出厂日期格式错误\n`
    return false
  }
  if (row.末检日期 && !isDateTime(row.末检日期)) {
    errorMessage.value += `第${row.index}行：末检日期格式错误\n`
    return false
  }
  if (row.下检日期 && !isDateTime(row.下检日期)) {
    errorMessage.value += `第${row.index}行：下检日期格式错误\n`
    return false
  }
  if (row.报废日期 && !isDateTime(row.报废日期)) {
    errorMessage.value += `第${row.index}行：报废日期格式错误\n`
    return false
  }
  return fetch
    .post("/bottle/import/row/check", getRowValueForSubmit(row))
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
      .post("/bottle/import/row", getRowValueForSubmit(row))
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
onBeforeMount(() => {})
</script>

<style lang="less" scoped></style>
