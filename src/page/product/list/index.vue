<route lang="yaml">
meta:
  title: 商品管理
  pageId: productManage
  order: 1
  categoryList:
    - 销售管理/商品管理
</route>

<template lang="pug">
.page
  el-card
    el-form(inline)
      el-form-item(label="商品编号")
        el-input(v-model="filter.code", placeholder="请输入完整的商品编号")
      el-form-item(label="商品名称")
        el-input(v-model="filter.name", placeholder="请输入商品名称")
      el-form-item(label="单位名称")
        el-select(v-model="filter.unit", placeholder="请选择商品单位", style="width: 150px")
          el-option(v-for="item in productUnitList", :key="item", :label="item", :value="item")
      el-form-item
        el-button(type="info", @click="handleReset") 重置
        el-button(type="primary", @click="handleSearch") 查询
  el-card
    template(#header)
      el-button(type="success", @click="handleAdd") 添加商品
    el-table(:data="list", row-class-name="tableRowWithAction")
      el-table-column(label="默认商品", fixed="left")
        template(#default="{ row }")
          el-icon(size="20", color="var(--color-primary)", v-if="row.isDefault")
            StarFilled
      el-table-column(label="商品编号", prop="code", fixed="left")
      el-table-column(label="商品名称", prop="name", fixed="left")
      el-table-column(label="类型", prop="productType")
        template(#default="{ row }")
          span {{ row.productType?.name || "-" }}
      el-table-column(label="净重", prop="weight")
        template(#default="{ row }")
          span {{ row.weight || "-" }}Kg
      el-table-column(label="单位", prop="unit")
      el-table-column(label="钢瓶规格", prop="bottleSpecific", width="140px", align="center")
        template(#default="{ row }")
          el-tag(type="info") {{ row.bottleSpecific?.name || "-" }}
      el-table-column(label="状态", align="left", width="140px")
        template(#default="{ row }")
          el-checkbox(:modelValue="row.isShowInOrder", size="small") 下单显示
          el-checkbox(:modelValue="row.isShowInWarehousing", size="small") 出入库显示
          el-checkbox(:modelValue="row.isShowInWechat", size="small") 微信显示
          el-checkbox(:modelValue="row.isShowInVoiceAuto", size="small") 自助订气使用
      el-table-column(label="照片", prop="imgList")
        template(#default="{ row }")
          yy-imageList(v-model="row.imgList", size="50px")
      el-table-column(label="使用期限（月）", prop="timeLimit", align="center")
      el-table-column(label="备注", prop="remark")
      el-table-column(label="创建人", prop="author")
        template(#default="{ row }")
          yy-accountChip(:detail="row.author")
      el-table-column(label="操作时间")
        template(#default="{ row }")
          span {{ formatTime(row.updateTime) }}
      el-table-column(label="操作", width="220px", align="left", fixed="right")
        template(#default="{ row }")
          el-button(type="warning", plain, size="small", @click="handleSetDefault(row)", v-if="!row.isDefault") 设为默认
          el-button(type="primary", plain, size="small", @click="handleEdit(row._id)") 编辑
          .extendAction
            el-button(type="danger", plain, size="small", @click="handleDelete(row._id)") 删除
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
import { ensureCacheData, productUnitList } from "@/provider/cache"
import { useEditDialog, useListPage } from "@/provider/listPage"
import { ElMessageBox } from "element-plus"
import ComEdit from "./__com__/edit.vue"
const { fetch, message, router } = inject("global")
const { formatTime } = inject("format")

const { list, pagination, filter, getList, handleSearch, handleReset } = useListPage({
  url: "/product",
  filter: {
    name: "",
    code: "",
    unit: "",
  },
})

const { isShowEdit, currentEditId, handleAdd, handleEdit } = useEditDialog()

// 删除商品
const handleDelete = async (id) => {
  ElMessageBox.confirm("确定删除该商品吗？", "提示", {
    type: "warning",
  }).then(() => {
    fetch
      .delete(`/product/${id}`)
      .then(() => {
        message.success("删除成功")
        getList()
      })
      .catch(() => {
        message.error("删除失败")
      })
  })
}

function handleSetDefault(row) {
  if (!row._id) return
  ElMessageBox.confirm("确定把当前商品设为默认吗？默认商品只能为1个，操作会取消其它商品的默认设置", "提示", {
    type: "warning",
  }).then(() => {
    fetch
      .put(`/product/${row._id}/setDefault`)
      .then(() => {
        message.success("设置成功")
        getList()
      })
      .catch((err) => {
        message.error(err?.msg || err)
      })
  })
}

onBeforeMount(() => {
  ensureCacheData("productUnitList")
})
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
