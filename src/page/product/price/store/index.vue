<route lang="yaml">
meta:
  title: 商品门店价格
  pageId: productStorePrice
  order: 13
  categoryList:
    - 销售管理/价格管理
</route>

<template lang="pug">
.page
  el-card
    el-form(inline)
      el-form-item(label="商品")
        yy-productSelect(v-model="filter.product", @change="handleSearch")
      el-form-item
        el-button(type="info", @click="handleReset") 重置
        el-button(type="primary", @click="handleSearch") 查询
  el-card
    template(#header)
      el-button(type="success", @click="handleAdd") 添加
      //- el-button(type="danger", @click="handleAdd") 批量删除
    el-table(:data="list")
      el-table-column(label="商品名称", prop="product.name")
      el-table-column(label="所属门店", prop="storeList")
        template(#default="{ row }")
          div(v-for="item in row.storeList", :key="item._id") {{ item?.name || "-" }}
      //- el-table-column(label="所属门店", prop="type")
      el-table-column(label="客户类型", prop="customerType")
      //- el-table-column(label="公斤单价", prop="type")
      el-table-column(label="单价", prop="price")
        template(#default="{ row }")
          span {{ formatPrice(row.price) }}
      //- el-table-column(label="生效时间", prop="effectiveTime")
        template(#default="{ row }")
            span {{ formatTime(row.effectiveTime) }}
      el-table-column(label="创建人")
        template(#default="{ row }")
          yy-accountChip(:detail="row.author")
      //- el-table-column(label="备注", prop="remark")
      el-table-column(label="创建时间")
        template(#default="{ row }")
          span {{ formatTime(row.createTime) }}
      el-table-column(label="操作")
        template(#default="{ row }")
          el-button(type="primary", size="small", @click="handleEdit(row._id)") 修改
          el-button(type="danger", size="small", @click="handleDelete(row._id)") 删除
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

  ComEdit(v-model:isShow="isShowEdit", :currentId="currentEditId", @success="handleReset")
</template>

<script setup>
import { useEditDialog, useListPage } from "@/provider/listPage"
import { ElMessageBox } from "element-plus"
import ComEdit from "./__com__/edit.vue"
const { fetch, message, router } = inject("global")
const { formatTime, formatPrice } = inject("format")

const { list, pagination, filter, getList, handleSearch, handleReset } = useListPage({
  url: "/productStorePrice",
  filter: {
    product: "",
  },
})

const { isShowEdit, currentEditId, handleAdd, handleEdit } = useEditDialog()

const handleDelete = async (id) => {
  ElMessageBox.confirm("确定删除该门店价格设置吗？", "提示", {
    type: "warning",
  }).then(() => {
    fetch
      .delete(`/productStorePrice/${id}`)
      .then(() => {
        message.success("删除成功")
        getList()
      })
      .catch(() => {
        message.error("删除失败")
      })
  })
}

onMounted(() => {
  handleReset()
})
</script>

<style lang="less" scoped>
.page {
  width: 100%;
}
.el-table {
  height: calc(100vh - 300px);
}
</style>
