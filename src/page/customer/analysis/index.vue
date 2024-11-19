<route lang="yaml">
meta:
  title: 客户分析
  pageId: customerAnalysis
  order: 12
  categoryList:
    - 客服中心/客户管理
    - 报表中心
</route>

<template lang="pug">
.page
  el-card
    el-form(label-width="130px")
      el-form-item
        template(#label)
          el-radio(v-model="currentFilterType", value="contractStatus", border) 合同状态
        el-radio-group(
          v-model="filter.contractStatus",
          :disabled="currentFilterType !== 'contractStatus'",
          @change="handleSearch"
        )
          el-radio-button(value="") 全部
          el-radio-button(v-for="i in contractStatusList", :value="i") {{ i }}
      el-form-item
        template(#label)
          el-radio(v-model="currentFilterType", value="securityCount", border) 安检次数
        el-radio-group(
          v-model="filter.securityCount",
          :disabled="currentFilterType !== 'securityCount'",
          @change="handleSearch"
        )
          el-radio-button(value="") 全部
          el-radio-button(v-for="i in securityCountList", :value="i") {{ i }} 次
          el-radio-button(value="其它") 其它
        template(v-if="filter.securityCount == '其它'")
          el-input-number(
            v-model="filter.securityCountInput",
            min="1",
            max="365",
            controls-position="right",
            style="margin: 0 10px"
          )
          span 次
      el-form-item
        template(#label)
          el-radio(v-model="currentFilterType", value="unCheckDay", border) 未安检时间
        el-radio-group(
          v-model="filter.unCheckDay",
          :disabled="currentFilterType !== 'unCheckDay'",
          @change="handleSearch"
        )
          el-radio-button(value="") 全部
          el-radio-button(v-for="i in dayList", :value="i") {{ i }}
        template(v-if="filter.unCheckDay == '其它'")
          el-input-number(
            v-model="filter.unCheckDayInput",
            min="1",
            max="365",
            controls-position="right",
            style="margin: 0 10px"
          )
          span 天
      el-form-item
        template(#label)
          el-radio(v-model="currentFilterType", value="unOrderDay", border) 未下单时间
        el-radio-group(
          v-model="filter.unOrderDay",
          :disabled="currentFilterType !== 'unOrderDay'",
          @change="handleSearch"
        )
          el-radio-button(value="") 全部
          el-radio-button(v-for="i in dayList", :value="i") {{ i }}
        template(v-if="filter.unOrderDay == '其它'")
          el-input-number(
            v-model="filter.unOrderDayInput",
            min="1",
            max="365",
            controls-position="right",
            style="margin: 0 10px"
          )
          span 天
      el-form-item
        template(#label)
          el-radio(v-model="currentFilterType", value="type", border) 客户类型
        el-radio-group(v-model="filter.type", :disabled="currentFilterType !== 'type'", @change="handleSearch")
          el-radio-button(value="") 全部
          el-radio-button(v-for="i in customerTypeList", :value="i") {{ i }}
        template(v-if="filter.unOrderDay == '其它'")
          el-input-number(
            v-model="filter.unOrderDayInput",
            min="1",
            max="365",
            controls-position="right",
            style="margin: 0 10px"
          )
          span 天
      el-form-item
        div(style="width: calc(100% - 100px); text-align: right")
          el-button(type="primary", @click="handleSearch") 查询
          el-button(type="warning", plain, @click="handleReset") 重置
  el-card
    el-table(:data="list", stripe)
      el-table-column(type="expand", fixed="left")
        template(#default="{ row }")
          div(style="padding-left: 20px; background-color: #fff")
            el-descriptions(:column="2")
              el-descriptions-item(label="ID") {{ row._id }}
      el-table-column(label="编号", prop="code", fixed="left")
      el-table-column(label="姓名", prop="name", fixed="left")
      el-table-column(label="客户电话", prop="phone")
      el-table-column(label="所属门店", prop="store.name")
      el-table-column(label="所属配送员", prop="courier.name")
      el-table-column(label="客户类型", prop="type")
      el-table-column(label="客户性质", prop="quality")
      el-table-column(label="风险等级", prop="riskGrade")
      el-table-column(label="订单数", prop="orderCount")
      el-table-column(label="最后下单时间", prop="lastOrderTime")
        template(#default="{ row }")
          span {{ formatDate(row.lastOrderTime) }}
      el-table-column(label="安检次数", prop="securityCount")
      el-table-column(label="最后安检时间", prop="lastSecurityTime")
        template(#default="{ row }")
          span {{ formatDate(row.lastSecurityTime) }}
      el-table-column(label="合同编号", prop="contractInfo.code")
      el-table-column(label="合同到期时间", prop="contractInfo.endDate")
        template(#default="{ row }")
          span {{ formatDate(row.endDate) }}
      el-table-column(label="创建人")
        template(#default="{ row }")
          yy-accountChip(:detail="row.author")
      el-table-column(label="创建时间")
        template(#default="{ row }")
          span {{ formatTime(row.createTime) }}
      el-table-column(label="操作")
        template(#default="{ row }")
          el-button(type="warning", plain, size="small", @click="handleRefresh(row._id)") 更新数据
    el-pagination(
      style="margin-top: 20px; justify-content: center",
      background,
      size="small",
      v-model:current-page="pagination.page",
      v-model:page-size="pagination.size",
      :total="pagination.total",
      layout="total,sizes,prev, pager, next",
      @change="getList"
    )
</template>

<script setup>
import { useEditDialog, useListPage } from "@/provider/listPage"
import { customerTypeList, ensureCacheData } from "@/provider/cache"

const { fetch, message, router } = inject("global")
const { formatDate, formatTime } = inject("format")

const filter = ref({
  contractStatus: "",
  securityCount: "",
  unCheckDay: "",
  unOrderDay: "",
  type: "",
  securityCountInput: 1,
  unCheckDayInput: 1,
  unOrderDayInput: 1,
})
const { list, pagination, getList, handleSearch } = useListPage({
  url: "/customer/analysis",
  extendFilter: () => {
    const { securityCount, unCheckDay, unOrderDay } = filter.value
    return {
      contractStatus: filter.value.contractStatus,
      securityCount: securityCount === "其它" ? filter.value.securityCountInput : securityCount,
      unCheckDay: unCheckDay === "其它" ? filter.value.unCheckDayInput : unCheckDay,
      unOrderDay: unOrderDay === "其它" ? filter.value.unOrderDayInput : unOrderDay,
      type: filter.value.type,
    }
  },
})

const contractStatusList = ["已签订", "未签订", "已到期"]
const securityCountList = [1, 3, 5, 10]
const dayList = ["本周", "本月", "本季度", "本年", "其它"]

const currentFilterType = ref("contractStatus")

function handleReset() {
  filter.value = {
    contractStatus: "",
    securityCount: "",
    unCheckDay: "",
    unOrderDay: "",
    type: "",
    securityCountInput: 1,
    unCheckDayInput: 1,
    unOrderDayInput: 1,
  }
  currentFilterType.value = "contractStatus"
  pagination.value.page = 1
  getList()
}

function handleRefresh(id) {
  fetch.post(`/customer/${id}/refreshAnalysis`).then((res) => {
    message.success("操作成功")
    const n = list.value.findIndex((v) => v._id === id)
    list.value[n].lastOrderTime = res.lastOrderTime
    list.value[n].lastSecurityTime = res.lastSecurityTime
    list.value[n].orderCount = res.orderCount
    list.value[n].securityCount = res.securityCount
  })
}

watch(
  () => currentFilterType.value,
  (val) => {
    filter.value.contractStatus = ""
    filter.value.securityCount = ""
    filter.value.unCheckDay = ""
    filter.value.unOrderDay = ""
    filter.value.type = ""
  },
)

onBeforeMount(async () => {
  await ensureCacheData("customerTypeList")
})
onMounted(() => {
  handleReset()
})
</script>

<style lang="less" scoped>
.el-radio {
  width: 120px;
}
.el-table {
  height: calc(100vh - 300px);
}
</style>
