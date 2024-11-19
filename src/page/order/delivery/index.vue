<route lang="yaml">
meta:
  title: 配送单
  pageId: deliveryList
  order: 1
  categoryList:
    - 客服中心/订单管理
    - 销售管理/订单管理
</route>

<template lang="pug">
.page
  el-card
    el-form(inline)
      el-form-item(label="客户")
        yy-customerSelect(v-model="filter.toCustomer", @change="handleSearch")
      el-form-item(label="配送门店")
        yy-storeSelect(v-model="filter.store", @change="handleSearch")
      el-form-item(label="配送员")
        yy-staffSelect(v-model="filter.courier", @change="handleSearch")
      el-form-item(label="配送单状态")
        el-select.value(v-model="filter.status", clearable, @change="handleSearch", @clear="handleSearch")
          el-option(label="全部", value="")
          el-option(v-for="i in deliveryStatusList", :label="i", :value="i")
      el-form-item(label="订单时间")
        yy-dateRange(v-model="filter.createTimeRange", @change="handleSearch")
      el-form-item
        el-button(type="primary", @click="handleSearch") 查询
        el-button(type="warning", plain, @click="handleReset") 重置
        el-button(type="primary", plain, @click="handleExport") 导出
  el-card
    el-table(:data="list")
      el-table-column(label="订单", prop="fromOrder", fixed="left")
        template(#default="{ row }")
          span {{ row.fromOrder?.code || row.fromOrder?._id }}
      el-table-column(label="客户", prop="toCustomer", fixed="left")
        template(#default="{ row }")
          yy-customerChip(:detail="row.toCustomer")
      el-table-column(label="配送员", prop="courier")
        template(#default="{ row }")
          yy-accountChip(:detail="row.courier")
      el-table-column(label="预约时间", prop="planTime")
        template(#default="{ row }")
          span {{ formatTime(row.planTime) }}
      el-table-column(label="派工时间", prop="setCourierTime")
        template(#default="{ row }")
          span {{ formatTime(row.setCourierTime) }}
      el-table-column(label="送达时间", prop="deliveryTime")
        template(#default="{ row }")
          span {{ formatTime(row.deliveryTime) }}
      el-table-column(label="空瓶")
        template(#default="{ row }")
          .tagList
            el-tag(v-for="i in row.emptyBottleList") {{ i.sn }}
      el-table-column(label="重瓶")
        template(#default="{ row }")
          .tagList
            el-tag(v-for="i in row.filledBottleList") {{ i.sn }}
      el-table-column(label="状态", prop="status")
        template(#default="{ row }")
          el-tag(v-if="row.status === '已作废'", type="danger") 已作废
          el-tag(v-else-if="row.status === '已完成'", type="success") 已完成
          el-tag(v-else-if="row.status === '已派工'", type="primary") 已派工
          el-tag(v-else, type="info") {{ row.status }}
      el-table-column(label="创建时间", prop="createTime")
        template(#default="{ row }")
          span {{ formatTime(row.createTime) }}
      el-table-column(label="操作", width="150px", fixed="right")
        template(#default="{ row }")
          el-button(v-if="!row.courier", type="primary", plain, size="small", @click="onCommand('派工', row)") 派工
          el-dropdown(@command="onCommand($event, row)")
            el-button(type="primary", size="small", style="margin-left: 20px") 更多
            template(#dropdown)
              el-dropdown-menu
                el-dropdown-item(command="取消派工", v-if="row.courier?._id") 取消派工
                el-dropdown-item(command="编辑") 编辑
                el-dropdown-item(command="作废") 作废
                el-dropdown-item(command="转派门店", v-if="row.company?._id") 转派门店
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

ComAssign(v-model:isShow="isShowAssign", :deliveryId="currentEditId", @success="getList")
ComEdit(v-model:isShow="isShowEdit", :deliveryId="currentEditId", @success="getList")
ComPickerCompany(v-model="isShowPickCompany", @success="onCompanyPick")
</template>

<script setup>
import ComPickerCompany from "@/component/picker/company.vue"
import { deliveryStatusList } from "@/provider/dict"
import { useListPage } from "@/provider/listPage"
import ComAssign from "./__com__/assign.vue"
import ComEdit from "./__com__/edit.vue"
import { dayjs } from "element-plus"

const { fetch, message, router } = inject("global")
const { formatTime } = inject("format")

const { list, pagination, filter, getList, handleSearch, handleReset, handleExport } = useListPage({
  url: "/delivery",
  filter: {
    toCustomer: "",
    store: "",
    courier: "",
    status: "",
    createTimeRange: [dayjs().startOf("day").toDate(), dayjs().endOf("day").toDate()],
  },
})

const isShowAssign = ref(false)
const isShowEdit = ref(false)
const currentEditId = ref("")
const currentEditItem = computed(() => list.value.find((v) => v._id === currentEditId.value))

function onCommand(command, row) {
  currentEditId.value = row._id
  switch (command) {
    case "派工":
      isShowAssign.value = true
      break
    case "取消派工":
      fetch.post(`/delivery/${row._id}/unassign`).then(() => {
        message.success("操作成功")
        getList()
      })
      break
    case "编辑":
      isShowEdit.value = true
      break
    case "作废":
      break
    case "转派门店":
      isShowPickCompany.value = true
      break
  }
}

const isShowPickCompany = ref(false)
function onCompanyPick(val) {
  if (!val) return
  if (currentEditItem.value?.company?._id === val._id) {
    message.warning("已经是当前门店")
    return
  }
  fetch.put(`/delivery/${currentEditId.value}`, { company: val._id, courier: "" }).then(() => {
    message.success("操作成功")
    getList()
  })
}

onMounted(() => {
  handleReset()
})
</script>

<style lang="less" scoped>
.el-table {
  height: calc(100vh - 250px);
}
</style>
