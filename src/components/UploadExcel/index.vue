<template>
  <div>
    <!-- 上传物业表格 -->
    <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClick">
    <div class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      请将表格拖到此处或者点击右侧按钮
      <el-button :loading="loading" style="margin-left:16px;" size="mini" type="primary" @click="handleUpload">
        点击上传
      </el-button>
    </div>
  </div>
</template>

<script>
// import XLSX from 'xlsx'
import { Message } from 'element-ui'

export default {
  props: {
    beforeUpload: Function, // eslint-disable-line
    onSuccess: Function// eslint-disable-line
  },
  data() {
    return {
      loading: false,
      excelData: {
        header: null,
        results: null
      }
    }
  },
  methods: {
    generateData({ header, results }) {
      this.excelData.header = header
      this.excelData.results = results
      this.onSuccess && this.onSuccess(this.excelData)
    },
    handleDrop(e) {
      e.stopPropagation()
      e.preventDefault()
      if (this.loading) return
      const files = e.dataTransfer.files
      if (files.length !== 1) {
        // this.$message.error('Only support uploading one file!')
        return
      }
      const rawFile = files[0] // only use files[0]

      if (!this.isExcel(rawFile)) {
        // this.$message.error('仅支持上传.xlsx，xls格式的excel')
        // this.$message.error('Only supports upload .xlsx, .xls, .csv suffix files')
        return false
      }
      this.upload(rawFile)
      e.stopPropagation()
      e.preventDefault()
    },
    handleDragover(e) {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },
    handleUpload() {
      this.$refs['excel-upload-input'].click()
    },
    handleClick(e) {
      const files = e.target.files
      const rawFile = files[0] // only use files[0]
      if (!rawFile) return
      this.upload(rawFile)
    },
    upload(rawFile) {
      this.$refs['excel-upload-input'].value = null // fix can't select the same excel

      // if (!this.beforeUpload) {
      //   this.readerData(rawFile)
      //   return
      // }
      // const before = this.beforeUpload(rawFile)
      // if (before) {
      //   this.readerData(rawFile)
      // }

      // 测试阿里云oss接口
      const OSS = require('ali-oss')

      const client = new OSS({
        // region以杭州为例（oss-cn-hangzhou），其他region按实际情况填写。
        region: 'oss-cn-beijing',
        // 阿里云主账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM账号进行API访问或日常运维，请登录 https://ram.console.aliyun.com 创建RAM账号。
        accessKeyId: 'LTAI4FgSpxAu8qrgZ9rePVoz',
        accessKeySecret: 'OUwPlikf0QdYfPCEtxjf2Qt6evN1L2',
        bucket: 'zhsq-vue'
        // secure: true
      })

      // 支持File对象、Blob数据、以及OSS Buffer。
      const data = rawFile
      // or const data = new Blob('content');
      // or const data = new OSS.Buffer('content'));

      async function putObject() {
        try {
          // object-key可以自定义为文件名（例如file.txt）或目录（例如abc/test/file.txt）的形式，实现将文件上传至当前Bucket或Bucket下的指定目录。
          // const result = await client.put('object-key', data)
          const result = await client.put('electricData.xls', data)
          console.log(result)
          console.log('-----------------------------------')
          // Message.success('上传成功')
          Message({
            showClose: false,
            message: '上传成功',
            type: 'success',
            duration: 3000
          })
        } catch (e) {
          console.log(e)
          // Message.success('上传失败，请刷新页面重试')
          Message({
            showClose: false,
            message: '上传失败，请刷新页面重试',
            type: 'error',
            duration: 3000
          })
        }
      }
      putObject()
      //
      //
      // Todo
      // 上传之后是否要给后台post一个信号？并且根据后台显示进行前端返回？
      //
      //
      //
    },
    // readerData(rawFile) {
    //   this.loading = true
    //   return new Promise((resolve, reject) => {
    //     const reader = new FileReader()
    //     reader.onload = e => {
    //       const data = e.target.result
    //       const workbook = XLSX.read(data, { type: 'array' })
    //       const firstSheetName = workbook.SheetNames[0]
    //       const worksheet = workbook.Sheets[firstSheetName]
    //       const header = this.getHeaderRow(worksheet)
    //       const results = XLSX.utils.sheet_to_json(worksheet)
    //       this.generateData({ header, results })
    //       this.loading = false
    //       resolve()
    //     }
    //     reader.readAsArrayBuffer(rawFile)
    //   })
    // },
    // getHeaderRow(sheet) {
    //   const headers = []
    //   const range = XLSX.utils.decode_range(sheet['!ref'])
    //   let C
    //   const R = range.s.r
    //   /* start in the first row */
    //   for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
    //     const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
    //     /* find the cell in the first row */
    //     let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
    //     if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
    //     headers.push(hdr)
    //   }
    //   return headers
    // },
    isExcel(file) {
      return /\.(xlsx|xls|csv)$/.test(file.name)
    }
  }
}
</script>

<style scoped>
.excel-upload-input{
  display: none;
  z-index: -9999;
}
.drop{
  border: 2px dashed #bbb;
  width: 600px;
  height: 160px;
  line-height: 160px;
  margin: 0 auto;
  font-size: 24px;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
}
</style>
