<template>
  <div class="tabs-container">
    <el-icon class="collapse" @click="switchCollapse">
      <expand v-if="isCollapse" />
      <fold v-else />
    </el-icon>
    <el-tabs v-model="activePath" class="tabs" type="card" closable @tab-click="clickTabls" @tab-remove="closeTabs">
      <el-tab-pane
        v-for="item in tabs.list"
        :key="item.path"
        :label="item.title"
        :name="item.path"
        @click="setTags(item)"
      ></el-tab-pane>
    </el-tabs>
    <div class="Tabs-close-box">
      <el-dropdown @command="handleTags">
        <el-button size="small" type="primary" plain>
          标签选项
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu size="small">
            <el-dropdown-item command="other">关闭其他</el-dropdown-item>
            <el-dropdown-item command="current">关闭当前</el-dropdown-item>
            <el-dropdown-item command="all">关闭所有</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { useTabsStore } from "@/store/tabs"
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router"
import { menuPathTitleMap } from "@/provider/menu"
import { isCollapse, switchCollapse } from "@/provider/menu"

const route = useRoute()
const router = useRouter()
const activePath = ref(route.fullPath)
const tabs = useTabsStore()

// 设置标签
const setTags = (route) => {
  const isExist = tabs.list.some((item) => {
    return item.path === route.fullPath
  })
  if (!isExist) {
    const title = route.meta.title || menuPathTitleMap[route.fullPath]
    if (!title) return
    tabs.setTabsItem({
      name: route.name,
      title: title,
      path: route.fullPath,
    })
  }
}
setTags(route)

// 关闭全部标签
const closeAll = () => {
  tabs.clearTabs()
  router.push("/")
}
// 关闭其他标签
const closeOther = () => {
  const curItem = tabs.list.filter((item) => {
    return item.path === route.fullPath
  })
  tabs.closeTabsOther(curItem)
}
const handleTags = (command) => {
  switch (command) {
    case "current":
      // 关闭当前页面的标签页
      tabs.closeCurrentTag({
        $router: router,
        $route: route,
      })
      break
    case "all":
      closeAll()
      break

    case "other":
      closeOther()
      break
  }
}

const clickTabls = (item) => {
  router.push(item.props.name)
}
const closeTabs = (path) => {
  const index = tabs.list.findIndex((item) => item.path === path)
  tabs.delTabsItem(index)
  const item = tabs.list[index] || tabs.list[index - 1]
  router.push(item ? item.path : "/")
}

watch(
  () => route.fullPath,
  (newVal, oldVal) => {
    activePath.value = newVal
    setTags(route)
  },
)
</script>

<style lang="less" scoped>
.tabs-container {
  position: relative;
  overflow: hidden;
  background: #fff;
  padding: 2px 120px 0 0;
  height: 30px;
  display: flex;
  align-items: end;
  .collapse {
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
      background-color: var(--color-primary);
      color: white;
    }
  }
}

.tabs {
  &:deep(.el-tabs__header) {
    margin-bottom: 0;
  }

  &:deep(.el-tabs__nav) {
    height: 28px;
  }

  &:deep(.el-tabs__nav-next),
  &:deep(.el-tabs__nav-prev) {
    line-height: 30px;
  }

  &.el-tabs {
    --el-tabs-header-height: 28px;
  }
}

.Tabs-close-box {
  position: absolute;
  right: 0;
  top: 0;
  box-sizing: border-box;
  padding-top: 1px;
  text-align: center;
  width: 110px;
  height: 30px;
  background: #fff;
  box-shadow: -3px 0 15px 3px rgba(0, 0, 0, 0.1);
  z-index: 10;
}
</style>
