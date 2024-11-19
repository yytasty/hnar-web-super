<route lang="yaml">
meta:
  title: 员工管理
  pageId: staffManage
  order: 6
  categoryList:
    - 系统管理/员工管理
</route>

<template lang="pug">
.page
  el-card
    el-form(inline)
      el-form-item(label="姓名")
        el-input(v-model="filter.name")
      el-form-item(label="登录类型")
        el-select.select(v-model="filter.loginTypeList", clearable, @change="handleSearch", @clear="handleSearch")
          el-option(label="全部", value="")
          el-option(v-for="item in loginTypeList", :label="item", :value="item")
      el-form-item
        el-button(type="primary", @click="handleSearch") 查询
  el-card
    template(#header)
      el-button(type="success", @click="handleAdd") 添加
    el-table(:data="list", row-class-name="tableRowWithAction")
      el-table-column(label="编号", prop="code")
      el-table-column(label="头像", prop="avatar")
        template(#default="{ row }")
          yy-image(:src="row.avatar", fit="cover", style="width: 50px; height: 50px")
      el-table-column(label="姓名", prop="name")
      el-table-column(label="电话", prop="phone")
      el-table-column(label="账号类型")
        template(#default="{ row }")
          el-tag(v-if="row.type === '管理员'", size="small", type="danger") {{ row.type }}
          el-tag(v-else, size="small", type="info") {{ row.type }}
      el-table-column(label="登录类型", prop="loginTypeList")
        template(#default="{ row }")
          el-tag(
            size="small",
            v-for="i in row.loginTypeList",
            type="warning",
            style="margin-right: 5px; margin-bottom: 5px"
          ) {{ i }}
      el-table-column(label="部门", prop="station")
        template(#default="{ row }")
          el-tag(v-if="row.station", size="small", type="primary", style="margin-right: 5px; margin-bottom: 5px") {{ row.station?.name || row.station }}
      el-table-column(label="门店")
        template(#default="{ row }")
          el-tag(
            v-for="i in (row.storeList || [])",
            size="small",
            type="info",
            style="margin-right: 5px; margin-bottom: 5px"
          ) {{ i?.name || i }}
      el-table-column(label="角色", prop="roleList")
        template(#default="{ row }")
          el-tag(
            size="small",
            v-for="i in row.roleList",
            type="success",
            style="margin-right: 5px; margin-bottom: 5px"
          ) {{ i?.name || i }}
      el-table-column(label="备注", prop="remark")
      el-table-column(label="创建时间")
        template(#default="{ row }")
          span {{ formatTime(row.createTime) }}
      el-table-column(label="更新时间")
        template(#default="{ row }")
          span {{ formatTime(row.updateTime) }}
      el-table-column(label="操作", width="200px;")
        template(#default="{ row }")
          el-button(type="warning", plain, size="small", @click="handleResetPassword(row._id)") 重设密码
          el-button(type="primary", size="small", @click="handleEdit(row._id)") 
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
  ComEdit(v-model:isShow="isShowEdit", :currentId="currentEditId", @success="handleReset")
</template>

<script setup>
import { loginTypeList } from "@/provider/dict"
import { useEditDialog, useListPage } from "@/provider/listPage"
import { ElForm, ElFormItem, ElInput, ElMessageBox } from "element-plus"
import ComEdit from "./__com__/edit.vue"

const { fetch, message, router, loading } = inject("global")
const { formatTime } = inject("format")

const { list, pagination, filter, getList, handleSearch, handleReset, handleDelete } = useListPage({
  url: "/account",
  filter: {
    loginTypeList: "",
    name: "",
  },
})

const { isShowEdit, currentEditId, handleAdd, handleEdit } = useEditDialog()

const newPassword = ref("")
function handleResetPassword(id) {
  newPassword.value = ""
  ElMessageBox({
    title: "重设密码",
    message: h(ElForm, { labelWidth: "80px" }, () => [
      h(ElFormItem, { label: "新密码" }, () => [
        h(ElInput, {
          modelValue: newPassword.value,
          placeholder: "请输入新密码",
          clearable: true,
          type: "password",
          showPassword: true,
          onInput: (val) => (newPassword.value = val),
        }),
      ]),
    ]),
    confirmButtonText: "确定",
    showCancelButton: true,
    cancelButtonText: "取消",
  }).then(() => {
    if (newPassword.value === "") {
      message.error("密码不能为空")
      return
    }
    fetch
      .post(`/account/${id}/resetPassword`, {
        password: newPassword.value,
      })
      .then(() => {
        message.success("重设密码成功")
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
