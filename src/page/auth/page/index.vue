<route lang="yaml">
meta:
  title: 权限页面管理
  pageId: authPageManage
</route>

<template lang="pug">
.page
  el-card
    el-form(inline, @submit.prevent)
      el-form-item(label="名字")
        el-input(v-model.trim="filter.name")
      el-form-item(label="")
        el-button(type="primary", @click="handleSearch") 查询
        el-button(type="warning", plain, @click="handleReset") 重置
  el-card
    template(#header)
      el-button(type="success", @click="handleAdd") 添加
      el-button(type="danger", plain, @click="handleSyncPage") Auto Sync All Page
    el-table(:data="list", row-class-name="tableRowWithAction")
      el-table-column(prop="_id", label="ID")
      el-table-column(prop="app", label="应用")
      el-table-column(prop="category", label="分组")
      el-table-column(prop="name", label="名称")
      el-table-column(prop="pageId", label="页面ID")
      el-table-column(prop="pagePath", label="页面路径")
      el-table-column(prop="remark", label="备注")
      el-table-column(label="操作", width="170px", align="center")
        template(#default="{ row }")
          el-button(type="success", size="small", plain, @click="handelAssign(row)")
            el-icon
              Plus
          el-button(type="warning", size="small", plain, @click="handleEdit(row)")
            el-icon
              Edit
          .extendAction
            el-popconfirm(title="确定删除当前行？", @confirm="handleDelete(row)", width="200px")
              template(#reference)
                el-button(type="danger", size="small", plain)
                  el-icon
                    Delete
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

ComEdit(v-model:isShow="isShowEdit", :currentId="currentEditId", @success="getList")
ComRolePicker(v-model:="isShowRolePicker", @success="onRolePickSuccess")
</template>

<script setup>
import ComRolePicker from "@/component/picker/role.vue"
import { useEditDialog, useListPage } from "@/provider/listPage"
import { getPageId } from "@/util/auth"
import ComEdit from "./__com__/edit.vue"

const { fetch, message, router } = inject("global")
const { formatTime } = inject("format")

const { list, pagination, filter, getList, handleSearch, handleReset, handleDelete } = useListPage({
  url: "/auth/page",
  filter: {
    name: "",
  },
})
const { isShowEdit, currentEditId, handleAdd, handleEdit } = useEditDialog()

const isShowRolePicker = ref(false)
function handelAssign(row) {
  currentEditId.value = row._id
  isShowRolePicker.value = true
}
function onRolePickSuccess(val) {
  if (!val._id) return
  return fetch
    .put(`/auth/page/${currentEditId.value}/assign`, {
      role: val._id,
    })
    .then((res) => {
      message.success("提交成功")
    })
}

function handleSyncPage() {
  const routerList = router.getRoutes()
  for (let i = 0; i < routerList.length; i++) {
    const item = routerList[i]
    if (item.redirect) continue
    if (item.meta?.isPass) continue
    const pageId = getPageId(item)
    if (!pageId) continue
    const payload = {
      remark: "auto sync",
      pageId,
      pagePath: item.path,
      name: item.meta?.title || pageId,
    }
    fetch
      .post("/auth/page", payload)
      .then(() => {
        list.value.unshift(payload)
      })
      .catch((err) => {})
  }
  handleReset()
}

onMounted(() => {
  handleReset()
})
</script>

<style lang="less" scoped>
.page {
  width: 100%;
}
</style>
