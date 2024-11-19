import Axios from "axios"
import ImageCompressor from "compressorjs"
import ExcelJS from "exceljs"
import SparkMD5 from "spark-md5"

const fileAcceptMap = {
  image: "image/*",
  staticImage: "image/jpeg,image/jpg,image/png",
  excel: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  audio: "audio/*",
  video: "video/*",
  svga: ".svga,.mp4",
  all: "*/*",
}
export function pickExcel() {
  return pickFileList({ count: 1, type: "excel" }).then((fileList) => fileList[0])
}

export function getExcelSheet(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const buffer = e.target.result
      const workbook = new ExcelJS.Workbook()
      await workbook.xlsx.load(buffer)
      const worksheet = workbook.getWorksheet(workbook.worksheets[0].name)
      const data = []
      const header = worksheet.columns.map((i) => i.values[1])
      worksheet
        .getSheetValues()
        .filter((temp) => !!temp?.length)
        .forEach((row, index) => {
          row.shift()
          if (index === 0) {
            return
          } else {
            const item = {}
            row.forEach((value, index) => {
              item[header[index]] = value
            })
            data.push(item)
          }
        })
      resolve({ header, data })
    }
    reader.readAsArrayBuffer(file)
  })
}

const isNewApiReady = window.hasOwnProperty("showOpenFilePicker")

export function pickAndUploadFile({ type = "image" } = { type: "image" }) {
  return pickFileList({ count: 1, type }).then((fileList) => {
    return upload(fileList[0])
  })
}
export function pickAndUploadFileList({ count = 9, type = "image" } = { count: 9, type: "image" }) {
  return pickFileList({ count, type }).then((fileList) => {
    return Promise.all(fileList.map((file) => upload(file)))
  })
}
export function pickFileList({ count = 9, type = "image" } = { count: 9, type: "image" }) {
  if (isNewApiReady) {
    return pickListByFilePicker({ count, type })
  } else {
    return pickListByInput({ count, type })
  }
}

async function upload(file, isImage = true) {
  const payloadFile = isImage ? await imgCompress(file) : file
  const fileHash = await getFileHash(payloadFile)
  const res = await fetch.get("/upload/sts", {
    params: {
      key: fileHash,
      dir: "image",
    },
  })
  let formData = new FormData()
  formData.append("OSSAccessKeyId", res.accessKeyId)
  formData.append("x-oss-security-token", res.stsToken)
  formData.append("policy", res.policy)
  formData.append("signature", res.signature)
  formData.append("key", res.key)
  formData.append("success_action_status", "200")
  formData.append("file", payloadFile)

  await Axios.post(res.host, formData)
  return res.url
}

async function imgCompress(file) {
  return new Promise((resolve, reject) => {
    if (file.type.substring(0, 5) === "image" && file.type !== "image/gif") {
      new ImageCompressor(file, {
        checkOrientation: true,
        success: (res) => {
          const beforeSize =
            file.size > 1048576
              ? Number(file.size / 1024 / 1024).toFixed(2) + "Mb"
              : Number(file.size / 1024).toFixed(2) + "Kb"
          const afterSize =
            res.size > 1048576
              ? Number(res.size / 1024 / 1024).toFixed(2) + "Mb"
              : Number(res.size / 1024).toFixed(2) + "Kb"
          console.log(`压缩前：${beforeSize}`)
          const r = Number(((file.size - res.size) / file.size) * 100).toFixed(2) + "%"
          console.log(`压缩后：${afterSize}，压缩率${r}`)
          resolve(res)
        },
        error: (err) => {
          console.log("图片压缩出现错误", err)
          reject(err)
        },
      })
    } else {
      resolve(file)
    }
  })
}

function getFileHash(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const hash = SparkMD5.ArrayBuffer.hash(e.target.result)
      resolve(hash)
    }
    reader.onerror = (err) => {
      reject(err)
    }
    reader.readAsArrayBuffer(file)
  })
}

function pickListByFilePicker({ count, type }) {
  return window
    .showOpenFilePicker({
      multiple: count > 1,
      excludeAcceptAllOption: true,
      types: [filePickerTypeMap[type]],
    })
    .then((fileHandleList) => {
      return Promise.all(
        fileHandleList.map((fileHandle) => {
          return fileHandle.getFile()
        }),
      )
    })
}

function pickListByInput({ count, type }) {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input")
    input.setAttribute("id", `__file_${Math.trunc(Math.random() * 100000)}`)
    input.setAttribute("type", "file")
    if (count > 1) {
      input.setAttribute("multiple", true)
    }
    input.setAttribute("accept", fileAcceptMap[type])
    input.style.display = "none"
    input.addEventListener(
      "change",
      () => {
        if (input.files) {
          resolve(Array.from(input.files))
          input.remove()
        }
      },
      { once: true },
    )
    input.click()
  })
}

const filePickerTypeMap = {
  image: {
    description: "Images",
    accept: {
      "image/*": [".png", ".gif", ".jpeg", ".jpg"],
    },
  },
  staticImage: {
    description: "Images",
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
    },
  },
  excel: {
    description: "Excel",
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
  },
  docx: {
    description: "Word",
    accept: {
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
  },
  audio: {
    description: "Audio",
    accept: {
      "audio/*": [".mp3"],
    },
  },
  video: {
    description: "Video",
    accept: {
      "video/*": [".mp4"],
    },
  },
}
