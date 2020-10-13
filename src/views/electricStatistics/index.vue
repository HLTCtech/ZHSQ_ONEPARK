<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        v-model="listQuery_search.date"
        type="month"
        value-format="yyyy-MM"
        class="filter-item"
        placeholder="选择月"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getList(listQuery_search.page=1)">
        搜索
      </el-button>
      <el-upload
        class="upload-demo"
        action
        :http-request="handleRequest"
        multiple
        accept=".xlsx, .xls"
      >
        <el-button type="primary" class="filter-item">上传文件</el-button>
      </el-upload>
      <!-- excel导出功能 -->
      <div>
        <FilenameOption v-model="filename" />
        <el-button
          :loading="downloadLoading"
          style="margin:0 0 20px 20px;"
          type="primary"
          icon="el-icon-document"
          @click="handleDownload"
        >导出Excel</el-button>
      </div>
    </div>
    <el-table v-loading="tableLoading" :data="tableData" highlight-current-row border fit>
      <el-table-column label="id" prop="id" align="center" />
      <el-table-column label="电表号" prop="houseId" align="center" />
      <el-table-column label="采集器编号" prop="collectorId" align="center" />
      <el-table-column label="通讯地址" prop="address" align="center" />
      <el-table-column label="用户姓名" prop="userName" align="center" />
      <el-table-column label="备注" prop="remark" align="center" />
      <el-table-column label="正向有功总电能 开始" align="center">
        <el-table-column label="时间" prop="startTime" align="center" />
        <el-table-column label="总" prop="startElect" align="center" />
      </el-table-column>
      <el-table-column label="正向有功总电能 结束" align="center">
        <el-table-column label="时间" prop="endTime" align="center" />
        <el-table-column label="总" prop="endElect" align="center" />
      </el-table-column>
      <el-table-column label="正向有功总电能 统计结果" align="center">
        <el-table-column label="总(差值)" prop="totalElect" align="center" />
        <el-table-column label="倍率" prop="rate" align="center" />
        <el-table-column label="单位" prop="sign" align="center" />
      </el-table-column>
      <el-table-column label="月份" prop="yearMonth" align="center" />
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery_search.page" @pagination="getList" />
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import FilenameOption from '@/views/excel/components/FilenameOption'
import { upload, electricStatisticsAll } from '@/api/electricStatistics'
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination, FilenameOption },
  data() {
    return {
      filename: '',
      downloadLoading: false,
      tableLoading: false,
      listQuery_search: { date: null, page: 1 },
			total: 0,
      tableData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleRequest(param) {
      const fileObj = param.file
      // FormData 对象
      const form = new FormData()
      // 文件对象
      form.append('file', fileObj)
      upload(form).then((res) => {
        console.log(res)
        if (res.code == 200 && res.msg != '重复上传') {
          this.$message.success('上传成功')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    getList() {
      this.tableLoading = true
      electricStatisticsAll(this.listQuery_search).then(res => {
        this.tableLoading = false
        this.tableData = res.data
        // this.total = res.total
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        const multiHeader = [['', '', '', '', '', '', '正向有功总电能 开始', '', '正向有功总电能 结束', '', '正向有功总电能 统计结果', '', '', '']] // 前一行的表头数据，二维数组，不够的用空白补全
        const tHeader = ['id', '电表号', '采集器编号', '通讯地址', '用户姓名', '备注', '时间', '总', '时间', '总', '总(差值)', '倍率', '单位', '月份']

        const filterVal = ['id', 'houseId', 'collectorId', 'address', 'userName', 'remark', 'startTime', 'startElect', 'endTime', 'endElect', 'totalElect', 'rate', 'sign', 'yearMonth']
        const list = this.tableData
        const merges = ['G1:H1', 'I1:J1', 'K1:M1']// 合并单元格
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          multiHeader,
          header: tHeader,
          merges,
          data,
          filename: this.filename
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          return v[j]
        })
      )
    }
  }
}
</script>

<style>
.upload-demo{
  display: inline-flex;
  margin-left: 20px;
}
</style>
