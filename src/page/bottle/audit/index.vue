<route lang="yaml">
meta:
  title: 钢瓶检测
  pageId: bottleAudit
  categoryList:
    - 生产中心/钢瓶管理
</route>

<template lang="pug">
.page
  el-card
    el-form
      el-form-item(label="")
        template(#label)
          el-select(v-model="indirectFilter.dateType", style="width: 150px")
            el-option(value="末检日期")
            el-option(value="下检日期")
            el-option(value="报废日期")
            el-option(value="生产日期")
        el-radio-group(v-model="indirectFilter.dateRangeType", style="margin: 0 10px")
          el-radio-button(value="全部") 全部
          el-radio-button(value="今日") 今日
          el-radio-button(value="本周") 本周
          el-radio-button(value="本月") 本月
          el-radio-button(value="本年") 本年
        yy-dateRange(v-model="indirectFilter.dateRange")
    el-form(inline)
      el-form-item(label="检测结果")
        el-select(v-model="filter.result", style="width: 200px")
          el-option(value="全部")
          el-option(value="合格")
          el-option(value="报废")
      el-form-item(label="钢瓶条码")
        el-input(v-model="filter.sn")
      el-form-item(label="产品编号")
        el-input(v-model="filter.productCode")
      el-form-item(label="生产厂家")
        el-input(v-model="filter.bottleFactory")
      el-form-item
        el-button(type="primary", @click="handleSearch") 查询
  el-card
    el-table(:data="list")
      el-table-column(label="ID", prop="_id")
      el-table-column(label="条码", prop="sn")
      el-table-column(label="归属气站", prop="station")
      el-table-column(label="使用门店", prop="store")
      el-table-column(label="电子标签", prop="rfid")
      el-table-column(label="钢瓶规格", prop="bottleSpecific")
      el-table-column(label="钢瓶厂家", prop="bottleFactory")
      el-table-column(label="创建时间", prop="createTime")
      el-table-column(label="更新时间", prop="updateTime")
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
import { useListPage } from "@/provider/listPage"
import { dayjs } from "element-plus"
const { fetch, message, router } = inject("global")

const indirectFilter = ref({
  dateType: "末检日期",
  dateRangeType: "今日",
  dateRange: [dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"), dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss")],
})
const extendFilter = computed(() => {
  if (
    indirectFilter.value.dateType === "末检日期" &&
    indirectFilter.value.dateRange?.[0] &&
    indirectFilter.value.dateRange?.[1]
  ) {
    return {
      auditTime: {
        $gte: indirectFilter.value.dateRange[0],
        $lte: indirectFilter.value.dateRange[1],
      },
    }
  }
  return {}
})
const { list, pagination, filter, getList, handleSearch, handleReset } = useListPage({
  url: "/bottle/audit",
  filter: {
    result: "全部",
    station: "",
    sn: "",
    productCode: "",
    bottleFactory: "",
  },
  extendFilter: () => extendFilter.value,
})

onMounted(() => {
  handleReset()
})
</script>

<style lang="less" scoped>
.el-table {
  height: calc(100vh - 250px);
}
</style>
