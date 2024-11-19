<route lang="yaml">
meta:
  title: 安检模板详情
  pageId: securityTemplateDetail
</route>

<template lang="pug">
.page
  .pageTitle
    h1(style="text-align: center") {{ detail.company?.name || detail.company }}液化气用户安全风险告知书（用户联）
    .code(style="text-align: right") 编号：{{ detail.code }}
    p(style="display: flex")
      span(style="flex-basis: 50%") 客户名称：___________
      span(style="flex-basis: 50%") 联系电话：___________
    p 客户地址：___________
  el-card(style="margin: 20px 0")
    template(#header)
      el-button(type="success", @click="handleAdd") 添加安检项目
    el-table(:data="list")
      el-table-column(label="安检项大类", prop="category")
      el-table-column(label="安检项名称", prop="name")
      el-table-column(label="安检项类型", prop="type")
      el-table-column(label="安检项内容", prop="children")
        template(#default="{ row }")
          .subList
            .subItem(v-for="sub in row.children", :class="'sub-' + sub.riskLevel") {{ sub.name }}
      el-table-column(label="启用拍照", prop="isAllowCamera")
        template(#default="{ row }")
          el-switch(:modelValue="row.isAllowCamera")
      el-table-column(label="操作")
        template(#default="{ row, $index }")
          el-button(size="small", type="primary", @click="handleEdit($index)") 编辑
          el-button(size="small", type="danger", @click="handleDelete($index)") 删除
          el-button(size="small", type="success", @click="handleCopy($index)") 复制
  .extendInfo
    p 安检状态：___________
    p 安检人员：___________
    p 企业盖章：___________
    p 电话：___________

  yy-dialog(v-model="isShowEditDialog", title="编辑安检项目")
    el-form(label-width="12em")
      el-form-item(label="安检项大类", required)
        el-input(v-model="editForm.category")
      el-form-item(label="安检项名称", required)
        el-input(v-model="editForm.name")
      el-form-item(label="安检项类型", required)
        el-radio-group(v-model="editForm.type")
          el-radio(value="单选") 单选
          el-radio(value="多选") 多选
          el-radio(value="图片") 图片
          el-radio(value="输入") 文本输入
          el-radio(value="说明") 说明文字
    el-form(label-width="12em", inline)
      //- el-form-item(label="启用拍照")
      //-   el-switch(v-model="editForm.isAllowCamera")
      //- el-form-item(label="必须拍照")
      //-   el-switch(v-model="editForm.isNeedCamera")
    el-form(label-width="12em", inline)
      el-form-item(label="是否必填")
        el-switch(v-model="editForm.isRequire")
      el-form-item(label="启用安检浓度")
        el-switch(v-model="editForm.isAllowGasCheck")
    el-form(label-width="12em")
      el-form-item(label="默认值", v-if="editForm.type !== '图片'")
        el-select(v-model="editForm.defaultValue", clearable)
          el-option(v-for="i in editForm.children", :key="i.name", :label="i.name", :value="i.name")
      el-form-item(label="最小数量", v-else)
        el-input-number(v-model="editForm.minLength")
      el-form-item(label="建议")
        el-input(v-model="editForm.advice", type="textarea", :autosize="{ minRows: 2, maxRows: 8 }")
      el-form-item(label="安检项内容", v-if="editForm.type === '单选' || editForm.type === '多选'")
        el-button(type="primary", @click="handleAddSub") 添加子项目
        el-table(:data="editForm.children")
          el-table-column(label="名称", prop="name")
            template(#default="{ row }")
              el-input(v-model="row.name")
          el-table-column(label="风险等级", prop="riskLevel")
            template(#default="{ row }")
              el-select(v-model="row.riskLevel")
                el-option(label="红码", :value="2")
                el-option(label="黄码", :value="1")
                el-option(label="绿码", :value="0")
          el-table-column(label="操作")
            template(#default="{ row, $index }")
              el-button(size="small", type="danger", @click="handleDeleteSub($index)") 删除
    template(#footer)
      el-button(type="primary", @click="handelSubmitEdit") 确定
      el-button(type="default", @click="isShowEditDialog = false") 取消
</template>

<script setup>
const { fetch, message, router } = inject("global")
const route = useRoute()

const detail = ref({
  company: {},
  checkItemList: [],
})
const list = ref([])
function getData() {
  fetch.get(`/security/template/${route.query.id}`).then((res) => {
    detail.value = res
    list.value = res?.checkItemList || []
  })
}

const isShowEditDialog = ref(false)
const currentEditIndex = ref(-1)
const editForm = ref({
  category: "",
  name: "",
  type: "单选",
  children: [],
  isAllowCamera: false,
  isNeedCamera: false,
  isRequire: false,
  isAllowGasCheck: false,
  minLength: 0,
  defaultValue: "",
  advice: "",
})
function handleAdd() {
  editForm.value = {
    category: "",
    name: "",
    type: "单选",
    children: [],
    isAllowCamera: false,
    isNeedCamera: false,
    isRequire: false,
    isAllowGasCheck: false,
    minLength: 0,
    defaultValue: "",
    advice: "",
  }
  currentEditIndex.value = -1
  isShowEditDialog.value = true
}
function handleEdit(n) {
  currentEditIndex.value = n
  editForm.value = JSON.parse(JSON.stringify({ ...list.value[n] }))
  isShowEditDialog.value = true
}
function handleDelete(n) {
  list.value.splice(n, 1)
  fetch.put(`/security/template/${route.query.id}`, { checkItemList: list.value }).then(() => {
    message.success("更新成功")
    isShowEditDialog.value = false
  })
}
function handleCopy(n) {
  list.value.splice(n, 0, { ...list.value[n], name: `${list.value[n].name} - 复制` })
  fetch.put(`/security/template/${route.query.id}`, { checkItemList: list.value }).then(() => {
    message.success("更新成功")
    isShowEditDialog.value = false
  })
}

function handleAddSub() {
  editForm.value.children.push({
    name: "",
    riskLevel: 0,
  })
}
function handleDeleteSub(n) {
  editForm.value.children.splice(n, 1)
}

function handelSubmitEdit() {
  if (currentEditIndex.value >= 0) {
    list.value.splice(currentEditIndex.value, 1, { ...editForm.value })
  } else {
    list.value.push({ ...editForm.value })
  }
  fetch.put(`/security/template/${route.query.id}`, { checkItemList: list.value }).then(() => {
    message.success("编辑成功")
    isShowEditDialog.value = false
  })
}

onMounted(() => {
  getData()
})
</script>

<style lang="less" scoped>
.page {
  border: 1px solid #ccc;
  margin: 20px 40px;
  background-color: white;
}
.subList {
  display: flex;
  flex-direction: column;
  .subItem {
    padding: 5px 0;
    &.sub-0 {
      color: var(--color-green);
    }
    &.sub-1 {
      color: var(--color-yellow);
    }
    &.sub-2 {
      color: var(--color-red);
    }
  }
}
</style>
