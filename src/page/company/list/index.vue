<route lang="yaml">
meta:
  title: 组织架构
  pageId: companyManage
  order: 4
  categoryList:
    - 系统管理/公司管理
</route>

<template lang="pug">
.page
  el-card.left
    el-tree(style="max-width: 600px", :data="list", node-key="_id", default-expand-all, :expand-on-click-node="false")
      template(#default="{ data }")
        .treeNode(@click="currentPick = data", :class="{ active: currentPick._id == data._id }") 
          img(:src="imgMap[data.type]")
          .name {{ data.name }}
          template(v-if="!!data._id")
            el-icon(v-if="data.type === '公司'", @click.stop="handleAddStation(data)") 
              CirclePlus
            el-icon(v-else-if="data.type === '气站'", @click.stop="handleAddStore(data)") 
              CirclePlus
  el-card.right
    ComCompany(v-if="currentPick.type == '公司'")
    ComStation(v-else-if="currentPick.type == '气站'")
    ComStore(v-else-if="currentPick.type == '门店'")
</template>
<script setup>
import ComCompany from "./__com__/company.vue"
import ComStation from "./__com__/station.vue"
import ComStore from "./__com__/store.vue"

import storeImg from "/src/assets/img/门店.png"
import stationImg from "/src/assets/img/气站.png"
import companyImg from "/src/assets/img/公司.png"
const imgMap = { 门店: storeImg, 气站: stationImg, 公司: companyImg }

import { CirclePlus } from "@element-plus/icons-vue"

const { fetch, message, loading } = inject("global")

const list = ref([])

const currentPick = ref({ type: "", _id: "", name: "", company: "", station: "" })

provide("currentPick", currentPick)

function getData() {
  loading.lock()
  fetch
    .get(`/company/tree`)
    .then((res) => {
      if (!res) return
      list.value = [res].map((i) => {
        i.type = "公司"
        i.children = i.children?.map((j) => {
          j.type = "气站"
          j.children = j.children?.map((k) => {
            k.type = "门店"
            return k
          })
          return j
        })
        return i
      })
      if (list.value.length && !currentPick.value?._id) {
        currentPick.value = list.value[0]
      }
    })
    .finally(() => {
      loading.hide()
    })
}
provide("handleReset", getData)

function handleAddStation(data) {
  const station = {
    _id: "",
    company: data._id,
    children: [],
    type: "气站",
    name: `子气站${data.children.length + 1}`,
  }
  data.children.push(station)
  currentPick.value = station
}
function handleAddStore(data) {
  const store = {
    _id: "",
    station: data._id,
    type: "门店",
    name: `子门店${data.children.length + 1}`,
  }
  data.children.push(store)
  currentPick.value = store
}

onMounted(() => {
  getData()
})
</script>
<style lang="less" scoped>
.page {
  width: 100%;
  height: calc(100vh - 100px);
  display: flex;
  .left {
    width: 300px;
    margin-right: 20px;
    overflow-y: auto;
  }
  .right {
    flex: 1;
    overflow-y: auto;
  }
}
.treeNode {
  display: flex;
  align-items: center;
  width: 100%;
  padding-left: 10px;
  &.active {
    background-color: #eee;
  }
  &:hover {
    .deleteIcon {
      display: block !important;
    }
  }
  .name {
    margin: 6px;
  }
}
</style>
