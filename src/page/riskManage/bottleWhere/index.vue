<route lang="yaml">
meta:
  title: 钢瓶在哪
  pageId: bottleWhere
  categoryList:
    - 安全监管/风险管控
</route>

<template lang="pug">
.page
  el-card(header="气瓶分布")
    .cardList
      .cardItem
        .title 气站
        .value {{ summaryData.station.all }}
        .sub 重瓶数：{{ summaryData.station.heavy }}
        .sub 轻瓶数：{{ summaryData.station.light }}
        .sub 气站数： {{ summaryData.station.count }}
      .cardItem
        .title 门店
        .value {{ summaryData.store.all }}
        .sub 重瓶数：{{ summaryData.store.heavy }}
        .sub 轻瓶数：{{ summaryData.store.light }}
        .sub 门店数：{{ summaryData.store.count }}
      .cardItem
        .title 车辆
        .value {{ summaryData.car.all }}
        .sub 车辆数：{{ summaryData.car.count }}
      .cardItem
        .title 客户
        .value {{ summaryData.customer.all }}
        .sub 客户数：{{ summaryData.customer.count }}
      .cardItem
        .title 检测站
        .value {{ summaryData.audit.all }}
        .sub 检测站数：{{ summaryData.audit.count }}
      .cardItem
        .title 充气站
        .value {{ summaryData.fill.all }}
        .sub 充气站数：{{ summaryData.fill.count }}
      .cardItem
        .title 未入库
        .sub 作废：{{ summaryData.other.作废 }}
        .sub 过期：{{ summaryData.other.过期 }}
        .sub 归档：{{ summaryData.other.归档 }}
        .sub 其它：{{ summaryData.other.其它 }}

  el-card(header="气瓶分布统计")
    el-tabs(v-model="tableType")
      el-tab-pane(label="总览", name="summary")
        el-table(:data="list")
          el-table-column(label="类型", prop="type")
          el-table-column(label="重瓶", prop="heavy")
          el-table-column(label="轻瓶", prop="light")
          el-table-column(label="库存 (重瓶+轻瓶)", prop="total")
            template(#default="{ row }")
              span {{ row.heavy + row.light }}
          el-table-column(label="查看明细")
            template(#default="{ row }")
              el-button(v-if="row.list?.length", type="primary", link, @click="handleViewDetail(row)") 查看
      el-tab-pane(label="气站", name="station")
        el-table(:data="list")
          el-table-column(label="气站名称", prop="station.name")
          el-table-column(label="气站编号", prop="station.code")
          el-table-column(label="重瓶", prop="heavy")
          el-table-column(label="轻瓶", prop="light")
          el-table-column(label="库存 (重瓶+轻瓶)", prop="total")
            template(#default="{ row }")
              span {{ row.heavy + row.light }}
          el-table-column(label="查看明细")
            template(#default="{ row }")
              el-button(v-if="row.list?.length", type="primary", link, @click="handleViewDetail(row)") 查看
      el-tab-pane(label="门店", name="store")
        el-table(:data="list")
          el-table-column(label="门店名称", prop="store.name")
          el-table-column(label="门店编号", prop="store.code")
          el-table-column(label="重瓶", prop="heavy")
          el-table-column(label="轻瓶", prop="light")
          el-table-column(label="库存 (重瓶+轻瓶)", prop="sum")
            template(#default="{ row }")
              span {{ row.heavy + row.light }}
          el-table-column(label="查看明细")
            template(#default="{ row }")
              el-button(v-if="row.list?.length", type="primary", link, @click="handleViewDetail(row)") 查看
      el-tab-pane(label="车辆", name="car")
        el-table(:data="list")
          el-table-column(label="司机")
            template(#default="{ row }")
              yy-accountChip(:detail="row.car?.currentDriver")
          el-table-column(label="车牌号", prop="car.plateNumber")
          el-table-column(label="库存", prop="all")
          el-table-column(label="查看明细")
            template(#default="{ row }")
              el-button(v-if="row.list?.length", type="primary", link, @click="handleViewDetail(row)") 查看
      el-tab-pane(label="客户", name="customer")
        el-table(:data="list")
          el-table-column(label="客户类型", prop="customer.type")
          el-table-column(label="客户名称", prop="customer.name")
          el-table-column(label="库存", prop="all")
          el-table-column(label="查看明细")
            template(#default="{ row }")
              el-button(v-if="row.list?.length", type="primary", link, @click="handleViewDetail(row)") 查看

yy-dialog(v-model="isShowDetail", title="气瓶明细", width="80%", @submit="isShowDetail = false")
  el-table(:data="detailList")
    el-table-column(label="气瓶编号", prop="code")
    el-table-column(label="条码", prop="sn", fixed="left")
    el-table-column(label="产品编号", prop="productCode")
    el-table-column(label="内部编号", prop="internalCode")
    el-table-column(label="电子标签", prop="rfid")
    el-table-column(label="钢瓶规格", prop="bottleSpecific")
      template(#default="{ row }")
        span {{ row.bottleSpecific?.name || row.bottleSpecific }}
    el-table-column(label="钢瓶厂家", prop="bottleFactory")
      template(#default="{ row }")
        span {{ row.bottleFactory?.name || row.bottleFactory }}
    el-table-column(label="出厂日期", prop="productionDate")
      template(#default="{ row }")
        span {{ formatDate(row.productionDate) }}
    el-table-column(label="末检日期", prop="auditDate")
      template(#default="{ row }")
        span {{ formatDate(row.auditDate) }}
    el-table-column(label="产权", prop="property")
    el-table-column(label="状态", prop="status")
</template>

<script setup>
const { fetch, message, router } = inject("global")
const { formatDate } = inject("format")

const tableType = ref("summary")
const tableTypeList = ref(["summary", "station", "store", "car", "customer"])

const summaryData = ref({
  all: 0,
  station: {
    all: 0,
    heavy: 0,
    light: 0,
    count: 0,
  },
  store: {
    all: 0,
    heavy: 0,
    light: 0,
    count: 0,
  },
  car: {
    all: 0,
    count: 0,
  },
  customer: {
    all: 0,
    count: 0,
  },
  audit: {
    all: 0,
    count: 0,
  },
  fill: {
    all: 0,
    count: 0,
  },
  other: {
    作废: 1,
    过期: 1,
    归档: 1,
    其它: 1,
  },
})
function getSummary() {
  fetch.get("/bottle/analysis/summary").then((res) => {
    summaryData.value = res
  })
}

const list = ref([])
function getList() {
  fetch.get(`/bottle/analysis/detail/${tableType.value}`).then((res) => {
    list.value = res
  })
}

const isShowDetail = ref(false)
const detailList = ref([])
function handleViewDetail(row) {
  if (!row.list) {
    message.error("暂无明细")
    return
  }
  detailList.value = row.list
  isShowDetail.value = true
}

watch(
  () => tableType.value,
  () => {
    getList()
  },
  { immediate: true },
)
onMounted(() => {
  getSummary()
})
</script>

<style lang="less" scoped>
.cardList {
  display: flex;
}
.cardItem {
  background-color: #ebf6fe;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 10px;
  padding: 10px;
  flex-grow: 1;
  .title {
    font-size: 18px;
    color: #333;
    margin-bottom: 10px;
  }
  .value {
    font-size: 24px;
    color: #333;
    margin-bottom: 10px;
  }
  .desc {
    font-size: 12px;
    color: #666;
  }
}
</style>
