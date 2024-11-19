<template lang="pug">
el-card.comCustomerInfo
  .filter
    el-form(inline, @submit.prevent, label-width="6em")
      el-form-item(v-for="i in filterTypeList", :label="i.label")
        el-input(
          v-model="filter[i.value]",
          clearable,
          @clear="handleReset",
          @keyup.enter.prevent="handleSearch(i.value)",
          style="width: 200px"
        )
          template(#append)
            el-icon(@click="handleSearch(i.value)")
              Search
    .rightAction
      el-button(type="warning", plain, @click="handleReset") 清空数据
      el-button(type="success", plain, @click="handlePick(null)") 新建客户资料
  .resultList(v-if="resultList?.length")
    el-table(:data="resultList")
      el-table-column(label="客户编号")
        template(#default="{ row }")
          span {{ row.code || row._id }}
      el-table-column(label="客户名称", prop="name")
      el-table-column(label="客户电话", prop="phone")
      el-table-column(label="所属配送员", prop="courier")
        template(#default="{ row }")
          yy-accountChip(:detail="row.courier")
      el-table-column(label="操作")
        template(#default="{ row }")
          el-button(type="primary", @click="handlePick(row)") 选择
  .addForm(v-if="isShowForm")
    .title(v-if="isExistData") 查看或编辑客户资料
    .title(v-else) 添加客户资料
    el-form(inline, label-width="6em")
      el-form-item(label="编号", v-if="customerInfo._id") 
        el-input(:modelValue="customerInfo?.code || customerInfo._id", disabled, style="width: 150px")
      el-form-item(label="客户名称", required) 
        el-input(v-model="customerInfo.name", style="width: 150px")
    el-form.form(inline, label-width="6em")
      el-form-item(label="客户电话", required)
        el-input(v-model="customerInfo.phone", style="width: 150px")
      el-form-item(label="付款方式")
        el-select.select(v-model="customerInfo.payType", style="width: 150px")
          el-option(v-for="item in customerPayTypeList", :label="item", :value="item")
    el-form.form(inline, label-width="6em")
      el-form-item(label="客户类型", required)
        el-select.select(v-model="customerInfo.type", clearable, style="width: 150px")
          el-option(v-for="item in customerTypeList", :label="item", :value="item")
      el-form-item(label="客户性质")
        el-select.select(v-model="customerInfo.quality", clearable, style="width: 150px")
          el-option(v-for="item in customerNatureList", :label="item", :value="item")
    el-form.form(inline, label-width="6em")
      el-form-item(label="所属门店")
        yy-storeSelect(v-model="customerInfo.store")
      el-form-item(label="所属配送员")
        el-input(:modelValue="customerInfo.courier?.name || customerInfo.courier", disabled, style="width: 230px")
          template(#append)
            el-button(@click="isShowStaffPicker = true") 选择配送员
    el-form.form(label-width="6em")
      el-form-item(label="地图位置", v-if="customerInfo.addressInfo?.mapImage")
        yy-image(:src="customerInfo.addressInfo.mapImage", width="300px", height="200px")
      el-form-item(label="详细地址")
        el-input(v-model="customerInfo.addressInfo.address", style="width: 400px")
    el-form.form(inline, label-width="6em")
      el-form-item(label="所在楼层")
        el-input(v-model="customerInfo.addressInfo.floor", type="number")
      el-form-item(label="楼梯类型")
        el-radio-group(v-model="customerInfo.addressInfo.stairType")
          el-radio(value="楼梯") 楼梯
          el-radio(value="电梯") 电梯
    el-form(label-width="6em")
      el-form-item(label="备注")
        el-input(v-model="customerInfo.remark", type="textarea", style="width: 400px")
    .formAction
      el-button(v-if="isExistData", type="primary", plain, @click="handleSubmit") 更新客户资料
      el-button(v-else, type="success", @click="handleSubmit") 保存客户资料

ComStaffPicker(
  v-model="isShowStaffPicker",
  :store="customerInfo.store?._id || customerInfo.store",
  @success="onStaffPick"
)
ComMapPicker(v-model="isShowMapPicker", @success="onLocationPick")
</template>

<script setup>
import { customerPayTypeList } from "@/provider/dict"
import ComMapPicker from "@/component/picker/map.vue"
import ComStaffPicker from "@/component/picker/staff.vue"
import { useRouteQuery } from "@vueuse/router"
import { customerNatureList, customerSourceList, customerTypeList, ensureCacheData } from "@/provider/cache"

const { fetch, message, router } = inject("global")
const customerInfo = inject("customerInfo")

const queryCustomerId = useRouteQuery("customerId", "", { transform: String })

const isExistData = computed(() => {
  return !!customerInfo.value?._id
})

const baseName = "客户资料"
const basePath = `/customer`

const isShowForm = ref(false)

const filter = ref({ type: "phone", content: "" })
const filterTypeList = ref([
  { label: "客户电话", value: "phone" },
  { label: "客户名称", value: "name" },
  { label: "身份证号", value: "idCard" },
  { label: "客户编号", value: "code" },
  { label: "ID", value: "_id" },
])
const filterTypeName = computed(() => {
  return filterTypeList.value.find((item) => item.value == filter.value.type)?.label
})
function onFilterTypeChange(command) {
  filter.value.type = command
  filter.value.content = ""
}
const resultList = ref([])
function handleSearch(key) {
  if (!filter.value?.[key]) {
    message.error("请先输入查询内容")
    return
  }
  filter.value.type = key
  filter.value.content = filter.value[key]
  customerInfo.value = {
    addressInfo: {},
    idCardInfo: {},
    businessLicenseInfo: {},
    contractInfo: {},
    bottleInfo: {},
  }
  isShowForm.value = false
  fetch
    .get("/customer/searchByWorkspace", { params: { [filter.value.type]: filter.value.content, size: -1 } })
    .then((res) => {
      if (!res?.list?.[0]) {
        isShowForm.value = true
        customerInfo.value[filter.value.type] = filter.value.content
        return Promise.reject("查不到客户信息")
      }
      if (res?.list?.length === 1) {
        handlePick(res.list[0])
      } else {
        resultList.value = res.list
        filter.value.content = ""
      }
    })
    .catch((err) => {
      message.error(err?.msg || err)
    })
}

function handlePick(val) {
  if (val) {
    customerInfo.value = val
  } else {
    customerInfo.value = {
      addressInfo: {},
      idCardInfo: {},
      businessLicenseInfo: {},
      contractInfo: {},
      bottleInfo: {},
    }
  }
  if (!customerInfo.value.addressInfo) {
    customerInfo.value.addressInfo = {}
  }
  resultList.value = []
  filter.value.content = ""
  isShowForm.value = true
}

function handleReset() {
  customerInfo.value = {
    addressInfo: {},
    idCardInfo: {},
    businessLicenseInfo: {},
    contractInfo: {},
    bottleInfo: {},
  }
  filter.value.type = "phone"
  filter.value.content = ""
  isShowForm.value = false
}

function handleSubmit() {
  Promise.resolve()
    .then(() => {
      if (isExistData.value) {
        return fetch.put(`${basePath}/${customerInfo.value._id}`, customerInfo.value)
      } else {
        return fetch.post(`${basePath}`, customerInfo.value)
      }
    })
    .then((res) => {
      message.success(customerInfo.value._id ? `修改${baseName}成功` : `添加${baseName}成功`)
      return fetch.get(`${basePath}/${customerInfo.value._id}`)
    })
    .then((res) => {
      handleReset()
      customerInfo.value = { ...res, courier: customerInfo.value.courier || res.courier }
      if (!customerInfo.value.addressInfo) {
        customerInfo.value.addressInfo = {}
      }
      isShowForm.value = true
    })
}

// 获取门店列表
const storeList = ref([])
function getStoreList() {
  fetch
    .get(`/store`, {
      page: 1,
      size: 1000,
    })
    .then((res) => {
      storeList.value = res?.list || []
    })
}
const isShowMapPicker = ref(false)
function onLocationPick(val) {
  customerInfo.value.addressInfo.lat = val.lat
  customerInfo.value.addressInfo.lon = val.lon
  customerInfo.value.addressInfo.address = val.address
  customerInfo.value.addressInfo.name = val.name
}

const isShowStaffPicker = ref(false)
function onStaffPick(val) {
  customerInfo.value.courier = { _id: val._id, name: val.name }
}

onBeforeMount(async () => {
  Promise.all([
    ensureCacheData("customerTypeList"),
    ensureCacheData("customerNatureList"),
    ensureCacheData("customerSourceList"),
  ])
  getStoreList()
})

watch(
  () => queryCustomerId.value,
  () => {
    if (queryCustomerId.value) {
      filter.value._id = queryCustomerId.value
      handleSearch("_id")
    }
  },
  { immediate: true },
)
</script>

<style lang="less" scoped>
.comCustomerInfo {
  .title {
    padding-left: 10px;
    padding-bottom: 10px;
    line-height: 26px;
  }
  .el-form-item {
    margin-bottom: 6px;
  }
}
.filter {
  display: flex;
  justify-content: space-between;
}
.addForm {
  border: 1px solid #ccc;
  padding: 10px;
  margin-top: 20px;
  position: relative;
  .formAction {
    position: absolute;
    right: 10px;
    bottom: 10px;
  }
}
.rightAction {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
</style>
