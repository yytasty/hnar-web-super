<route lang="yaml">
meta:
  title: 角色管理
  pageId: roleManage
  categoryList:
    - 系统管理/员工管理
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
    el-table(:data="list", row-class-name="tableRowWithAction")
      el-table-column(label="ID", prop="_id")
      el-table-column(label="名称", prop="name")
      el-table-column(label="备注", prop="remark")
      el-table-column(label="后台页面权限")
        template(#default="{ row }")
          el-popover(:width="400", trigger="click", @show="handleShowPageList(row)")
            template(#reference)
              el-tag(type="primary", style="cursor: pointer") {{ row.authPageList?.length || 0 }}
            el-table(:data="row.authPageListInfo || []")
              el-table-column(label="名称", prop="name")
              el-table-column(prop="pageId", label="页面ID")
      el-table-column(label="手机端页面权限")
        template(#default="{ row }")
          el-popover(:width="400", trigger="click", @show="handleShowPageListForStaff(row)")
            template(#reference)
              el-tag(type="primary", style="cursor: pointer") {{ row.authPageListForStaff?.length || 0 }}
            el-table(:data="row.authPageListInfoForStaff || []")
              el-table-column(label="名称", prop="name")
              el-table-column(prop="pageId", label="页面ID")
      el-table-column(label="成员")
        template(#default="{ row }")
          el-popover(:width="400", trigger="click", @show="handleShowAccountList(row)")
            template(#reference)
              el-tag(type="success", style="cursor: pointer") {{ row.accountCount }}
            el-table(:data="row.accountListInfo || []")
              el-table-column(label="编号", prop="code")
              el-table-column(label="姓名", prop="name")
              el-table-column(label="头像")
                template(#default="{ row }")
                  yy-image(:src="row.avatar", fit="cover", style="width: 50px; height: 50px")
      el-table-column(label="创建人")
        template(#default="{ row }")
          yy-accountChip(:detail="row.author")
      el-table-column(label="创建时间")
        template(#default="{ row }")
          span {{ formatTime(row.createTime) }}
      el-table-column(label="操作", width="170")
        template(#default="{ row }")
          el-button(type="success", size="small", plain, @click="handelAssign(row)")
            el-icon
              Plus
          el-button(type="warning", size="small", plain, @click="handleEdit(row)")
            el-icon
              Edit
          .extendAction
            el-button(type="danger", size="small", plain, @click="handleDelete(row)")
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
ComAccountPicker(v-model="isShowAccountPicker", @success="onRolePickSuccess")
</template>

<script setup>
import ComAccountPicker from "@/component/picker/staff.vue"
import { useEditDialog, useListPage } from "@/provider/listPage"

const { fetch, router, message } = inject("global")
const { formatTime } = inject("format")

const { list, pagination, filter, getList, handleSearch, handleDelete, handleReset } = useListPage({
  url: "/auth/role",
  filter: {
    name: "",
  },
})

function handleAdd() {
  router.push("/auth/role/new")
}
function handleEdit(row) {
  router.push(`/auth/role/${row._id}`)
}

const isShowAccountPicker = ref(false)
const currentAssignId = ref(0)
function handelAssign(row) {
  currentAssignId.value = row._id
  isShowAccountPicker.value = true
}
function onRolePickSuccess(val) {
  if (!val._id) return
  return fetch
    .put(`/auth/role/${currentAssignId.value}/assign`, {
      account: val._id,
    })
    .then((res) => {
      message.success("提交成功")
      getList()
    })
}

function handleShowAccountList(row) {
  row.accountListInfo = []
  if (!row.accountCount) {
    return
  }
  fetch.get(`/auth/role/${row._id}/accountList`).then((res) => {
    row.accountListInfo = res || []
  })
}
function handleShowPageList(row) {
  row.authPageListInfo = []
  if (!row.authPageList?.length) {
    return
  }
  fetch.get(`/auth/role/${row._id}/pageList`).then((res) => {
    row.authPageListInfo = res || []
  })
}
function handleShowPageListForStaff(row) {
  row.authPageListInfoForStaff = []
  if (!row.authPageListForStaff?.length) {
    return
  }
  fetch.get(`/auth/role/${row._id}/pageListForStaff`).then((res) => {
    row.authPageListInfoForStaff = res || []
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
