<template lang="pug">
.sidebar(:class="{ isCollapse }")
  el-menu.sidebar-el-menu(
    v-if="showMenu",
    router="",
    text-color="#bfcbd9",
    background-color="#324157",
    :default-openeds="defaultOpened",
    :collapse="isCollapse",
    :default-active="onRoutes"
  )
    template(v-for="(item, n) in menuData[menuGroup]")
      template(v-if="item.children")
        el-sub-menu(:index="`n-${n}`")
          template(#title="")
            el-icon
              component(:is="item.icon")
            span {{ item.title }}
          template(v-for="(subItem, m) in item.children")
            el-sub-menu(:index="m", v-if="subItem.children")
              template(#title="") {{ subItem.title }}
              el-menu-item(:index="threeItem.index", :key="i", v-for="(threeItem, i) in subItem.children") {{ threeItem.title }} {{ threeItem.index }}
            el-menu-item(:index="subItem.index", v-else="") {{ subItem.title }}
      template(v-else="")
        el-menu-item(:index="item.index")
          el-icon
            component(:is="item.icon")
          template(#title="") {{ item.title }}
</template>

<script setup>
import { menuData, menuGroup, isCollapse } from "@/provider/menu"

const route = useRoute()
const onRoutes = computed(() => {
  return decodeURI(route.fullPath)
})

const defaultOpened = ref([])
const showMenu = ref(false)
function handleShowMenu() {
  setTimeout(() => {
    showMenu.value = true
  }, 1)
}

onMounted(() => {
  for (let key in menuData.value) {
    for (let index in menuData.value[key]) {
      let item = menuData.value[key][index]
      if (item.index == decodeURI(route.fullPath)) {
        menuGroup.value = key
        handleShowMenu()
        return
      }
      if (item.children) {
        for (const childrenItem of item.children) {
          if (childrenItem.index == decodeURI(route.fullPath)) {
            menuGroup.value = key
            defaultOpened.value = [`n-${index}`]
            handleShowMenu()
            return
          }
        }
      }
    }
  }
  handleShowMenu()
})
</script>

<style lang="less" scoped>
.sidebar {
  overflow-y: scroll;
  height: 100%;
  width: var(--size-side-width);
  flex-shrink: 0;
  user-select: none;
  transition: all 0.3s;
  &.isCollapse {
    width: 65px;
  }
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu {
  min-height: 100%;
  &:deep(.el-menu--inline) {
    background-color: #57606f;
    .el-menu-item {
      &:before {
        display: inline-block;
        content: "-";
        margin-right: 10px;
      }
    }
  }
}
</style>
