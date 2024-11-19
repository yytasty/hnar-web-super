<template lang="pug">
el-card(header="客户购气记录")
  el-table(:data="list")
    el-table-column(type="expand")
      template(#default="{ row }")
        el-descriptions(:column="1")
          el-descriptions-item(label="ID") {{ row._id }}
          el-descriptions-item(label="创建时间") {{ formatTime(row.createTime) }}
          el-descriptions-item(label="商品详情") 
            el-table(:data="row.productList", style="display: inline-block")
              el-table-column(label="商品名称", prop="productName")
              el-table-column(label="商品数量", prop="num")
              el-table-column(label="商品单价", prop="price")
              el-table-column(label="楼层价", prop="floorPrice")
    el-table-column(label="下单时间", width="170px")
      template(#default="{ row }")
        span {{ formatTime(row.createTime) }}
    el-table-column(label="总金额", prop="totalPrice")
    el-table-column(label="商品数量", prop="productList.length")
    el-table-column(label="订单状态", prop="status")
    el-table-column(label="来源", prop="source")
    el-table-column(label="操作人", prop="operator")
</template>

<script setup>
import { useListPage } from "@/provider/listPage"
import mitt from "@/provider/mitt"

const { fetch, message, router } = inject("global")
const { formatTime } = inject("format")
const customerInfo = inject("customerInfo")

const { list, pagination, filter, getList, handleSearch, handleReset } = useListPage({
  url: "/order",
  filter: {
    customer: customerInfo.value?._id,
    size: 10,
  },
})

onMounted(() => {
  handleReset()
  mitt.on("refreshOrderLog", handleReset)
})
</script>

<style lang="less" scoped></style>
