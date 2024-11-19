<template lang="pug">
yy-dialog(:modelValue="isShow", @close="emits('update:isShow', false)", :title="title" @submit="handleSubmit")
  el-form(label-width="12em")
    el-form-item(label="账号类型")
      el-input(v-model="formData.type", disabled)
    el-form-item(label="员工类型", required)
      el-tag(v-for="i in formData.roleList", closable, @close="onDeleteRole(i)", style="margin-right: 10px") {{ i.name || i }}
      el-tag(type="success", @click="isShowRolePick = true")
        el-icon
          plus
    el-form-item(label="所属部门", required)
      yy-stationSelect(v-model="formData.station", :isShowAll="false" :isShowNone="true")
    el-form-item(label="所属门店", required)
      yy-storeMultipleSelect(v-model="formData.storeList", :station="formData.station?._id || formData.station")
    el-form-item(label="登录类型")
      el-checkbox-group(v-model="formData.loginTypeList")
        el-checkbox(label="电脑", value="电脑") 
        el-checkbox(label="手机", value="手机") 
    el-form-item(label="员工编号", required)
      el-input(v-model="formData.code")
    el-form-item(label="员工姓名", required)
      el-input(v-model="formData.name")
    el-form-item(label="员工登录名", required)
      el-input(v-model="formData.loginName")
    el-form-item(label="员工电话")
      el-input(v-model="formData.phone")
    el-form-item(label="员工头像")
      yy-imageListUpload(v-model="formData.avatar", :multiple="false")
      div(style="margin-left: 20px")
        el-button(v-if="!formData.avatar", type="warning", link  @click="handleRandomAvatar") 随机
    el-form-item(label="备注")
      el-input(v-model="formData.remark", type="textarea", style="width: 300px")

ComRolePick(v-model="isShowRolePick", @success="onRolePickSuccess")
</template>

<script setup>
import ComRolePick from "@/component/picker/role.vue"

const { fetch, message, router } = inject("global")

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
  currentId: {
    type: String,
    default: "",
  },
})
const emits = defineEmits(["update:isShow", "success"])

const baseName = "员工资料"
const basePath = `/account`
const title = computed(() =>
  props.isViewMode ? `${baseName}详情` : props.currentId ? `修改${baseName}` : `添加${baseName}`,
)

const formData = ref({
  type: "员工",
  loginTypeList: ["手机"],
  storeList: [],
  roleList: [],
  station: "",
  code: "",
  name: "",
  phone: "",
  avatar: "",
  loginName: "",
  remark: "",
})

function handleSubmit() {
  if (formData.value.phone) {
    const telReg = /^(\d{3,4}-)?\d{7,8}$|^1[3-9]\d{9}$/
    if (!telReg.test(formData.value.phone)) {
      message.error("请填写正确的员工电话（手机号码/座机号码）")
      return
    }
  }
  Promise.resolve()
    .then(() => {
      if (formData.value._id) {
        return fetch.put(`${basePath}/${formData.value._id}`, formData.value)
      } else {
        return fetch.post(`${basePath}`, formData.value)
      }
    })
    .then(() => {
      message.success(formData.value._id ? `修改${baseName}成功` : `添加${baseName}成功`)
      emits("update:isShow", false)
      emits("success")
    })
}

const isShowRolePick = ref(false)
function onRolePickSuccess(val) {
  if (!val._id) return
  if (!formData.value.roleList) {
    formData.value.roleList = []
  }
  if (formData.value.roleList.find((i) => i._id === val._id)) {
    message.error("已存在该角色")
    return
  }
  formData.value.roleList.push(val)
}

function onDeleteRole(val) {
  const index = formData.value.roleList.findIndex((i) => i._id === val._id)
  formData.value.roleList.splice(index, 1)
}

function handleRandomAvatar() {
  formData.value.avatar = `https://api.multiavatar.com/${new Date().getTime()}.png`
}

watch(
  () => props.isShow,
  (val) => {
    if (val) {
      if (props.currentId) {
        fetch.get(`${basePath}/${props.currentId}`).then((res) => {
          formData.value = { ...res }
          if (!formData.value.roleList) {
            formData.value.roleList = []
          }
        })
      } else {
        formData.value = {
          type: "员工",
          loginTypeList: ["手机"],
          storeList: [],
          roleList: [],
          station: "",
          code: "",
          name: "",
          phone: "",
          avatar: "",
          loginName: "",
          remark: "",
        }
      }
    }
  },
  { immediate: true },
)
</script>

<style lang="less" scoped></style>
