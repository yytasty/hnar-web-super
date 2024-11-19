<route lang="yaml">
meta:
  title: 文章管理
  pageId: articleManage
  order: 1
  categoryList:
    - 系统管理
</route>

<template lang="pug">
.page
  el-card
    el-form(inline)
      el-form-item(label="Key")
        el-input(v-model="filter.article_key")
      el-form-item(label="标题")
        el-input(v-model="filter.title")
      el-form-item
        el-button(type="primary", @click="handleSearch") 查询

  el-card
    template(#header)
      el-button(type="success", @click="handleAdd") 添加
    el-table(:data="list", row-class-name="tableRowWithAction")
      el-table-column(prop="title", label="标题")
      el-table-column(prop="category", label="分组")
      el-table-column(prop="article_key", label="Key")
      el-table-column(label="创建人")
        template(#default="{ row }")
          yy-accountChip(:detail="row.author")
      el-table-column(prop="created_at", label="创建时间")
        template(#default="{ row }")
          span {{ formatTime(row.createTime) }}
      el-table-column(label="操作", width="200px")
        template(#default="{ row }")
          el-button(type="success", plain, size="small", @click="handleGetLink(row)") 获取链接
          el-button(type="primary", plain, size="small", @click="handleEdit(row)")
            el-icon
              Edit
          .extendAction
            el-popconfirm(title="确定删除当前行？", @confirm="handleDelete(row)", width="200px")
              template(#reference)
                el-button(type="danger", plain, size="small")
                  el-icon
                    Delete
</template>

<script setup>
import { companyInfo } from "@/provider/account"
import { useEditDialog, useListPage } from "@/provider/listPage"

const { fetch, message, router, t } = inject("global")
const { formatTime } = inject("format")

const { list, pagination, filter, getList, handleSearch, handleReset } = useListPage({
  url: "/article",
  filter: {
    article_key: "",
    title: "",
  },
})

function handleEdit(row) {
  router.push(`/article/edit?id=${row._id}`)
}
function handleAdd() {
  router.push(`/article/edit?mode=new`)
}

function handleGetLink(row) {
  const url = `https://customer.hnar.top/page/article/index?company=${companyInfo.value?._id}&id=${row._id}`
  message.success(`链接已复制到剪贴板: ${url}`)
  navigator.clipboard.writeText(url)
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
