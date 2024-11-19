import { dayjs } from "element-plus"

export const datePickShortcutBefore = [
  {
    text: "今天",
    value: [dayjs().startOf("day").toDate(), new Date()],
  },
  {
    text: "本周",
    value: [dayjs().startOf("week").add(1, "day").toDate(), dayjs().endOf("week").add(1, "day").toDate()],
  },
  {
    text: "本月",
    value: [dayjs().startOf("month").toDate(), dayjs().endOf("month").toDate()],
  },
  {
    text: "本年",
    value: [dayjs().startOf("year").toDate(), dayjs().endOf("year").toDate()],
  },
  {
    text: "过去7天",
    value: [dayjs().subtract(7, "day").toDate(), new Date()],
  },
  {
    text: "过去30天",
    value: [dayjs().subtract(30, "day").toDate(), new Date()],
  },
  {
    text: "过去100天",
    value: [dayjs().subtract(100, "day").toDate(), new Date()],
  },
]
