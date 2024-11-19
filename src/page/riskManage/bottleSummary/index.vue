<route lang="yaml">
meta:
  title: 钢瓶档案统计
  pageId: bottleSummary
  categoryList:
    - 报表中心
    - 安全监管/风险管控
</route>

<template lang="pug">
.page
  el-card(header="气瓶档案统计")
    .cardList
      .cardItem
        .title 气瓶档案总数
        .value {{ formData.totalNum }}
        .desc 气瓶总数，不包含注销瓶
      .cardItem
        .title 在用瓶
        .value {{ formData.useNum }}
        .desc 合格瓶总数
      .cardItem
        .title 过期瓶
        .value {{ formData.pastNum }}
        .desc 超期未检测瓶总数
      .cardItem
        .title 报废瓶
        .value {{ formData.scrapNum }}
        .desc 超过使用年限

  el-card(header="气瓶档案报表")
    el-table(:data="list", @sort-change="onSortChange")
      el-table-column(label="充装单位", prop="stationName")
      el-table-column(label="档案数量", prop="totalNum")
      el-table-column(label="合格数量", prop="useNum")
      el-table-column(label="过期数量", prop="pastNum")
      el-table-column(label="报废数量", prop="scrapNum")
</template>

<script setup>
import { useListPage } from "@/provider/listPage"
import Decimal from "decimal.js"
const { fetch, message, router } = inject("global")
const { formatTime } = inject("format")
const statusNumMap = {
  正常: "useNum",
  检测中: "useNum",
  充气中: "useNum",
  作废: "scrapNum",
  过期: "pastNum",
  归档: "scrapNum",
  其它: "useNum",
}

const formData = ref({ totalNum: 0, useNum: 0, pastNum: 0, scrapNum: 0 })
const list = ref([])

function getData() {
  fetch.get(`/bottle/summary/statistics`).then((res) => {
    let oFormData = { totalNum: 0, useNum: 0, pastNum: 0, scrapNum: 0 }
    let oList = []
    for (const info of res) {
      let listInfo = oList.find((v) => v.stationName ==  info.stationName)
      if (!listInfo) {
        listInfo = {
          stationName:  info.stationName,
          totalNum: 0,
          useNum: 0,
          pastNum: 0,
          scrapNum: 0,
        }
        oList.push(listInfo)
      }
      if (statusNumMap[info._id.status] in listInfo) {
        listInfo[statusNumMap[info._id.status]] += info.count
        listInfo.totalNum += info.count
      }
      if (statusNumMap[info._id.status] in oFormData) {
        oFormData[statusNumMap[info._id.status]] += info.count
        oFormData.totalNum += info.count
      }
    }
    formData.value = oFormData
    list.value = oList
  })
}

onMounted(() => {
  getData()
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
