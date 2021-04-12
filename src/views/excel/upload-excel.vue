<!--
 * @Author: 周鹏飞
 * @Date: 2021-03-15 11:44:47
 * @LastEditors: 周鹏飞
 * @LastEditTime: 2021-04-12 17:59:25
 * @Description: file content
-->
<template>
  <div class="app-container">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'

export default {
  name: 'UploadExcel',
  components: { UploadExcelComponent },
  data() {
    return {
      // 表格内容
      tableData: [],
      tableHeader: []
    }
  },
  methods: {
    beforeUpload(file) {
      // 限制上传的excel表格大小
      const isLt1M = file.size / 1024 / 1024 < 1

      // 如果上传的excel大小小于1M返回true
      if (isLt1M) {
        return true
      }

      this.$message({
        message: '请不要上传文件大小超过1M的表格',
        type: 'warning'
      })
      return false
    },
    // 成功回调
    handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
    }
  }
}
</script>
