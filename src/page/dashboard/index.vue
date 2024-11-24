<route lang="yaml">
meta:
  title: 系统首页
  pageId: dashboard
  order: -100
  categoryList:
    - 系统管理
</route>

<template>
  <div class="page">
    <ComSummary />
    <div class="pageContent">
      <el-card class="leftCard" shadow="hover" v-loading="weekLoading">
        <v-chart class="chart" :option="weekOptions" v-if="!weekLoading" :style="weekStyle" />
      </el-card>
    </div>
  </div>
</template>

<script setup>
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
import ComSummary from "./__com__/summary.vue"
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

// 周视图
const weekOptions = ref({
  title: {
    text: "销售排名",
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  legend: {},
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    type: "value",
    boundaryGap: [0, 0.01],
  },
  yAxis: {
    type: "category",
    data: ["Brazil", "Indonesia", "USA", "India", "China", "World"],
  },
  series: [
    {
      name: "销售额",
      type: "bar",
      data: [100, 100, 100, 100, 100, 100],
    },
    {
      name: "订单数",
      type: "bar",
      data: [2, 2, 2, 1, 1, 1],
    },
  ],
})

const weekStyle = ref({ height: "400px" })
const weekLoading = ref(true)
// 获取周的数据（因为不确定是不是这个图，所以先分开处理）
function getWeekData() {
  fetch
    .get("/statistics/order/sevenDayStatisticsForCompanyRank")
    .then((res) => {
      weekStyle.value = { height: `${res.length * 100}px` }
      weekOptions.value.yAxis.data = res.map((v) => v.name)
      weekOptions.value.series[0].data = res.map((v) => v.totalPrice)
      weekOptions.value.series[1].data = res.map((v) => v.orderCount)
    })
    .finally(() => {
      weekLoading.value = false
    })
}

onMounted(() => {
  getWeekData()
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
