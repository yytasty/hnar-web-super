import { dayjs } from "element-plus"

export function isMobilePhone(value) {
  return /^1[3456789]\d{9}$/.test(value)
}

export function isContactNumber(value) {
  return /^(\d{3,4}-)?\d{7,8}$|^1[3-9]\d{9}$/.test(value)
}

export function isEmail(value) {
  return /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(value)
}

export function isIdCard(value) {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)
}

export function isNumber(value) {
  return /^[0-9]*$/.test(value)
}

export function isDateTime(value) {
  return dayjs(value).isValid()
}
