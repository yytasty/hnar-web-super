<route lang="yaml">
meta:
  title: 系统首页
  pageId: dashboard
  order: -100
  categoryList:
    - 客服中心
    - 销售管理
    - 报表中心
    - 生产中心
    - 安全监管
    - 系统管理
</route>

<template>
  <div class="page">
    <ComSummary />
    <div class="pageContent">
      <el-card class="leftCard" shadow="hover">
        <el-tabs v-model="activeName" type="card" class="demo-tabs">
          <el-tab-pane label="实时交易数据" name="实时交易数据">
            <div class="card-header">
              <p class="card-header-desc">今天不同时间段的成交数据</p>
            </div>
          </el-tab-pane>
          <el-tab-pane label="周交易分析" name="周交易分析">
            <div class="card-header">
              <p class="card-header-desc">最近一周订单状态，包括订单数和成交金额</p>
            </div>
          </el-tab-pane>
        </el-tabs>
        <v-chart class="chart" :option="hourOptions" v-if="activeName == '实时交易数据'" />
        <v-chart class="chart" :option="weekOptions" v-if="activeName == '周交易分析'" />
      </el-card>
      <el-card class="rightCard" shadow="hover">
        <div class="card-header">
          <p class="card-header-title">商品销售分布</p>
          <p class="card-header-desc">最近一个月销售商品的情况</p>
        </div>
        <v-chart class="chart" :option="monthOptions" />
      </el-card>
    </div>
  </div>
</template>

<script setup>
import ComSummary from "./__com__/summary.vue"
import { BarChart, LineChart, MapChart, PieChart } from "echarts/charts"
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  VisualMapComponent,
} from "echarts/components"
import { use } from "echarts/core"
import { CanvasRenderer } from "echarts/renderers"
import VChart from "vue-echarts"
use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  LineChart,
  PieChart,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  VisualMapComponent,
  MapChart,
  ToolboxComponent,
])

const { fetch, message, router } = inject("global")
const activeName = ref("实时交易数据")
// 小时视图
const hourOptions = ref({
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      crossStyle: {
        color: "#999",
      },
    },
  },
  toolbox: {
    feature: {
      saveAsImage: { show: true },
    },
  },
  legend: {
    data: ["订单数", "成交金额"],
  },
  xAxis: [
    {
      type: "category",
      data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
      axisPointer: {
        type: "shadow",
      },
    },
  ],
  yAxis: [
    {
      type: "value",
      name: "订单数",
      min: 0,
      max: 5,
      interval: 1,
      axisLabel: {
        formatter: "{value} 单",
      },
    },
    {
      type: "value",
      name: "成交金额",
      min: 0,
      max: 25,
      interval: 5,
      axisLabel: {
        formatter: "{value} 元",
      },
    },
  ],
  series: [
    {
      name: "订单数",
      type: "bar",
      tooltip: {
        valueFormatter: function (value) {
          return value + " 单"
        },
      },
      data: [], // 需要改动
    },
    {
      name: "成交金额",
      type: "line",
      yAxisIndex: 1,
      tooltip: {
        valueFormatter: function (value) {
          return value + " 元"
        },
      },
      data: [], // 需要改动
    },
  ],
})
// 获取小时的数据
function getHourData() {
  fetch.get("/statistics/order/dayStatistics").then((res) => {
    let maxOrderCount = Math.max(...res.map((v) => v.orderCount))
    maxOrderCount = Math.floor(maxOrderCount - (maxOrderCount % 5) + 5)
    const orderCountInterval = Math.ceil(maxOrderCount / 5)
    hourOptions.value.yAxis[0].max = maxOrderCount
    hourOptions.value.yAxis[0].interval = orderCountInterval
    hourOptions.value.series[0].data = res.map((v) => v.orderCount)

    let maxTotalPrice = Math.max(...res.map((v) => v.totalPrice))
    maxTotalPrice = Math.floor(maxTotalPrice - (maxTotalPrice % 5) + 5)
    const totalPriceInterval = Math.ceil(maxTotalPrice / 5)
    hourOptions.value.yAxis[1].max = maxTotalPrice
    hourOptions.value.yAxis[1].interval = totalPriceInterval
    hourOptions.value.series[1].data = res.map((v) => v.totalPrice)
  })
}

// 周视图
const weekOptions = ref({
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      crossStyle: {
        color: "#999",
      },
    },
  },
  toolbox: {
    feature: {
      saveAsImage: { show: true },
    },
  },
  legend: {
    data: ["订单数", "成交金额"],
  },
  xAxis: [
    {
      type: "category",
      data: [],
      axisPointer: {
        type: "shadow",
      },
    },
  ],
  yAxis: [
    {
      type: "value",
      name: "订单数",
      min: 0,
      max: 5,
      interval: 1,
      axisLabel: {
        formatter: "{value} 单",
      },
    },
    {
      type: "value",
      name: "成交金额",
      min: 0,
      max: 25,
      interval: 5,
      axisLabel: {
        formatter: "{value} 元",
      },
    },
  ],
  series: [
    {
      name: "订单数",
      type: "bar",
      tooltip: {
        valueFormatter: function (value) {
          return value + " 单"
        },
      },
      data: [], // 需要改动
    },
    {
      name: "成交金额",
      type: "line",
      yAxisIndex: 1,
      tooltip: {
        valueFormatter: function (value) {
          return value + " 元"
        },
      },
      data: [], // 需要改动
    },
  ],
})
// 获取周的数据（因为不确定是不是这个图，所以先分开处理）
function getWeekData() {
  fetch.get("/statistics/order/sevenDayStatistics").then((res) => {
    let maxOrderCount = Math.max(...res.map((v) => v.orderCount))
    maxOrderCount = Math.floor(maxOrderCount - (maxOrderCount % 5) + 5)
    const orderCountInterval = Math.ceil(maxOrderCount / 5)
    weekOptions.value.yAxis[0].max = maxOrderCount
    weekOptions.value.yAxis[0].interval = orderCountInterval
    weekOptions.value.series[0].data = res.map((v) => v.orderCount)

    let maxTotalPrice = Math.max(...res.map((v) => v.totalPrice))
    maxTotalPrice = Math.floor(maxTotalPrice - (maxTotalPrice % 5) + 5)
    const totalPriceInterval = Math.ceil(maxTotalPrice / 5)
    weekOptions.value.yAxis[1].max = maxTotalPrice
    weekOptions.value.yAxis[1].interval = totalPriceInterval
    weekOptions.value.series[1].data = res.map((v) => v.totalPrice)

    weekOptions.value.xAxis[0].data = res.map((v) => v.date)
  })
}

const monthOptions = ref({
  legend: {
    bottom: "1%",
    left: "center",
  },
  color: ["#3f51b5", "#009688", "#f44336", "#00bcd4", "#1ABC9C"],
  series: [
    {
      type: "pie",
      radius: ["40%", "70%"],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: "#fff",
        borderWidth: 2,
      },
      data: [
        { value: 1048, name: "钢瓶" },
        { value: 735, name: "液化气" },
        { value: 580, name: "软管" },
      ],
    },
  ],
})
// 获取月的数据
function getMonthData() {
  fetch.get("/statistics/order/monthProductStatistics").then((res) => {
    monthOptions.value.series[0].data = res.map((v) => ({ value: v.count, name: `${v.productName}（${v.count}）` }))
  })
}

onMounted(() => {
  getHourData()
  getWeekData()
  getMonthData()
})
</script>

<style lang="less" scoped>
.pageContent {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .leftCard {
    flex-grow: 1;
    margin-right: 10px;
  }
  .rightCard {
    width: 300px;
  }
}
.chart {
  width: 100%;
  height: 400px;
}

.card-header {
  padding-left: 10px;
  margin-bottom: 20px;
}

.card-header-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.card-header-desc {
  font-size: 14px;
  color: #999;
}

.timeline-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  color: #000;
}

.timeline-time,
.timeline-desc {
  font-size: 12px;
  color: #787878;
}

.rank-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.rank-item-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f2f2f2;
  text-align: center;
  line-height: 40px;
  margin-right: 10px;
}

.rank-item-content {
  flex: 1;
}

.rank-item-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #343434;
  margin-bottom: 10px;
}

.rank-item-desc {
  font-size: 14px;
  color: #999;
}
.map-chart {
  width: 100%;
  height: 350px;
}
</style>
