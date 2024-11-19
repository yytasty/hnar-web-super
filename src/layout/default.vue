<template lang="pug">
.defaultLayout(:class="{ isCollapse }")
  com-header
  .mainContent
    com-sideBar
    .pageContent
      com-breadcrumb
      .innerPage
        router-view
</template>

<script setup>
import ComBreadcrumb from "@/component/layout/breadcrumb.vue"
import ComHeader from "@/component/layout/header.vue"
import ComSideBar from "@/component/layout/sideBar.vue"

import { isCollapse } from "@/provider/menu"
</script>

<style lang="less" scoped>
.defaultLayout {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  &.isCollapse {
    .content-box {
      left: 65px;
    }
  }
}
.mainContent {
  width: 100vw;
  height: calc(100vh - var(--size-header-height));
  display: flex;
  align-items: flex-start;
}
.pageContent {
  flex-grow: 1;
  width: calc(100vw - var(--size-side-width));
}
.innerPage {
  height: calc(100vh - 100px);
  overflow-y: auto;
  overflow-x: hidden;
}
.innerPage::-webkit-scrollbar {
  width: 10px;
  background-color: #f9f9f9;
}

/* 设置滚动条滑块的样式 */
.innerPage::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #9e9e9e;
}

.content-box {
  position: absolute;
  left: 180px;
  right: 0;
  top: 70px;
  bottom: 0;
  padding-bottom: 30px;
  -webkit-transition: left 0.3s ease-in-out;
  transition: left 0.3s ease-in-out;
  background: #eef0fc;
  overflow: hidden;
}

.content {
  width: auto;
  height: 100%;
  padding: 10px;
  overflow-y: scroll;
  box-sizing: border-box;
}

.content::-webkit-scrollbar {
  width: 0;
}
</style>
