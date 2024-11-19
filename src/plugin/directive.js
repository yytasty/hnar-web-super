import { ElMessage } from "element-plus"

function handleDrag(el, bind) {
  if (!bind.value) return
  el.onmousedown = (e) => {
    let x = 0
    let y = 0
    let disX = e.clientX - el.offsetLeft
    let disY = e.clientY - el.offsetTop
    document.onmousemove = (e) => {
      x = e.clientX - disX
      y = e.clientY - disY
      el.style.left = x + "px"
      el.style.top = y + "px"
    }
    el.onmouseup = (e) => {
      document.onmousemove = null
      document.onmouseup = null
      if (x) {
        bind.value.x = x
      }
      if (y) {
        bind.value.y = y
      }
    }
  }
}
function handleDragY(el, bind) {
  if (!bind.value) return
  el.ontouchstart = (e) => {
    let y = 0
    let disY = e.targetTouches[0].pageY - el.offsetTop
    el.ontouchmove = (e) => {
      y = e.targetTouches[0].pageY - disY
      el.style.top = y + "px"
      e.preventDefault()
    }
    el.ontouchend = (e) => {
      if (y) {
        bind.value = y
      }
      el.ontouchmove = null
      el.ontouchend = null
    }
  }
}

function handleBackground(el, bind) {
  el.style.backgroundImage = `url(${bind.value})`
  el.style.backgroundRepeat = `no-repeat`
  el.style.backgroundPosition = `center`
  el.style.backgroundSize = `cover`
  if (bind.modifiers.cover) {
    el.style.backgroundSize = `cover`
  } else if (bind.modifiers.contain) {
    el.style.backgroundSize = `contain`
  } else if (bind.modifiers.center) {
    el.style.backgroundSize = `center`
  }
}

function handleAuth(el, bind) {
  let isAllow = false
  if (typeof bind.value === "undefined") {
    console.error(">>>>>>> authId is undefined")
    return
  }
  if (typeof bind.value === "string") {
    isAllow = checkAuthActionIn(bind.value)
  } else {
    isAllow = checkAuthActionSome(bind.value)
  }
  if (!isAllow) {
    if (bind.modifiers.disabled) {
      el.style.cursor = "not-allowed"
      el.setAttribute("disabled", true)
      if (bind.modifiers.toast) {
        el.onclick = () => {
          ElMessage.warning("没有权限")
        }
      }
    } else if (bind.modifiers.remove) {
      el.remove()
    } else {
      el.style.display = "none"
    }
  }
}

export default {
  install(app) {
    if (!app) return
    app.directive("bg", {
      mounted: handleBackground,
      updated: handleBackground,
    })
    app.directive("drag", {
      mounted: handleDrag,
      updated: handleDrag,
    })
    app.directive("dragY", {
      mounted: handleDragY,
    })
    app.directive("auth", { mounted: handleAuth, updated: handleAuth })
  },
}
