<template>
  <div class="header">
    <div class="header-left">
      <img class="logo" src="@/assets/img/logo.svg" alt="" />
      <div class="web-title">华诺安燃超管平台</div>
      <div class="menuGroup">
        <div class="menuItem" :class="{ isActive: menuGroup === i }" v-for="i in menuGroupList" @click="menuGroup = i">
          {{ i }}
        </div>
      </div>
    </div>
    <div class="header-right">
      <div class="navLink">
        <el-dropdown class="user-name" trigger="click" @command="handleCommandLink">
          <span class="el-dropdown-link">
            常用链接
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="staff">员工端（手机）</el-dropdown-item>
              <el-dropdown-item command="customer">客户端（微信）</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="header-user-con">
        <div class="btn-icon" @click="setFullScreen">
          <el-tooltip effect="dark" content="全屏" placement="bottom">
            <i class="el-icon-lx-full"></i>
          </el-tooltip>
        </div>
        <el-avatar class="user-avator" :size="30" :src="accountInfo.avatar || imgurl" />
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ accountInfo?.name }}
            <span v-if="companyInfo?.name" style="font-size: 12px; margin-left: 10px"> @ {{ companyInfo?.name }} </span>
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">个人中心</el-dropdown-item>
              <el-dropdown-item divided></el-dropdown-item>
              <el-dropdown-item command="clearCache">清除缓存</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script setup>
import imgurl from "@/assets/img/img.jpg"
import { accountInfo, companyInfo, logout } from "@/provider/account"
import { clearAllCache } from "@/provider/cache"
import { menuGroup, menuGroupList } from "@/provider/menu"

const { message, router } = inject("global")

const handleCommand = (command) => {
  if (command == "logout") {
    logout().then(() => {
      router.push("/login")
    })
  } else if (command == "profile") {
    router.push("/account/profile")
  } else if (command == "clearCache") {
    clearAllCache()
    window.location.reload()
  }
}

function handleCommandLink(command) {
  let url = ``
  if (command == "staff") {
    url = `https://oo.hnar.top?company=${companyInfo.value?._id}`
  } else if (command == "customer") {
    url = `https://qq.hnar.top?company=${companyInfo.value?._id}`
  }
  if (!url) return
  navigator.clipboard.writeText(url)
  message.success(`链接已复制到剪贴板: ${url}`)
}

const setFullScreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    document.body.requestFullscreen.call(document.body)
  }
}

onMounted(() => {})
</script>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: var(--size-header-height);
  color: var(--header-text-color);
  background-color: var(--header-bg-color);
  border-bottom: 1px solid #ddd;
}

.header-left {
  display: flex;
  align-items: center;
  padding-left: 20px;
  height: 100%;
  .logo {
    width: 35px;
  }
  .web-title {
    margin: 0 40px 0 10px;
    font-size: 22px;
  }
}

.menuGroup {
  display: flex;
  align-items: center;
  .menuItem {
    font-size: 14px;
    padding: 10px;
    cursor: pointer;
    border-radius: 0;
    transition: all 0.3s;
    &:hover {
      border-radius: 20px;
      background-color: #f2f2f2;
      color: #242f42;
    }
    &.isActive {
      color: var(--color-primary);
    }
  }
}

.collapse-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 0 10px;
  cursor: pointer;
  opacity: 0.8;
  font-size: 22px;
}

.collapse-btn:hover {
  opacity: 1;
}

.header-right {
  float: right;
  padding-right: 10px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  .navLink {
    margin-right: 50px;
  }
}

.header-user-con {
  display: flex;
  height: var(--size-header-height);
  align-items: center;
}

.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}

.btn-icon {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: var(--header-text-color);
  margin: 0 5px;
  font-size: 20px;
}

.btn-bell-badge {
  position: absolute;
  right: 4px;
  top: 0px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: var(--header-text-color);
}

.user-avator {
  margin: 0 10px 0 20px;
  flex-shrink: 0;
}

.el-dropdown-link {
  color: var(--header-text-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.el-dropdown-menu__item {
  text-align: center;
}
</style>
