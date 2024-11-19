export const loginTypeList = ["电脑", "手机"]

export const accountStaffTypeList = ["操作员", "配送员", "司机", "押运员", "充装工", "检测员", "坐席", "客服"]

export const screenPopUpList = ["新盒子推送方式", "云坐席方式", "呼叫中心"]

export const stationTypeList = ["售气站", "检测站", "充气站"]

export const storeTypeList = ["直营", "挂靠"]

export const productTypeList = ["个人", "公司"]

export const customerPayTypeList = ["现金", "月结", "预存"]

export const systemDictList = [
  { name: "报修类型", configId: "repairTypeList" },
  { name: "咨询类型", configId: "consultTypeList" },
  { name: "投诉类型", configId: "complaintTypeList" },
  { name: "客户性质", configId: "customerNatureList" },
  { name: "客户类型", configId: "customerTypeList" },
  { name: "客户来源", configId: "customerSourceList" },
  { name: "供应商类型", configId: "supplierTypeList" },
  { name: "客户退户原因", configId: "customerCancelReasonList" },
  { name: "充装介质", configId: "fillMediumList" },
  { name: "采购类型", configId: "purchaseTypeList" },
  { name: "附加费用类型", configId: "additionalCostTypeList" },
  { name: "销售类型", configId: "saleTypeList" },
  { name: "通知类型", configId: "noticeTypeList" },
  { name: "车辆类型", configId: "carTypeList" },
  { name: "车辆使用状态", configId: "carStatusList" },
  { name: "个人证件类型", configId: "certificateTypeList" },
  { name: "公司证件类型", configId: "companyCertificateTypeList" },
  { name: "押瓶收租方式", configId: "rentTypeList" },
  { name: "商品单位", configId: "productUnitList" },
  { name: "订单来源", configId: "orderSourceList" },
]

export const bottleStatusList = ["正常", "检测中", "充气中", "作废", "库存", "其它"]

export const aMapPickerUrl = `https://m.amap.com/picker/?keywords=店&key=${import.meta.env.VITE_amap_key}&jscode=${import.meta.env.VITE_jscode}&total=50`

export const aMapNavUrl = `https://m.amap.com/navi/?hideRouteIcon=1&key=${import.meta.env.VITE_amap_key}&jscode=${import.meta.env.VITE_jscode}`

export const securityRiskColorMap = {
  0: "#4cd964",
  1: "#ffcc00",
  2: "#ff2d55",
}

export const customerRiskGradeList = ["绿码", "黄码", "红码"]

export const orderStatusList = ["待处理", "未派工", "已派工", "已配送", "已完成", "已作废"]
export const orderSourceList = ["坐席", "客户", "其他"]

export const deliveryStatusList = ["未派工", "已派工", "已完成", "已作废"]
export const repairStatusList = ["待处理", "已完成", "已作废"]
