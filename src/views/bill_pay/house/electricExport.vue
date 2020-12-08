<template>
  <div class="app-container">
    <!-- excel导出功能 -->
    <div>
      <FilenameOption v-model="filename" />
      <el-button
        :loading="downloadLoading"
        style="margin: 0 0 20px 20px"
        type="primary"
        icon="el-icon-document"
        @click="handleDownload"
      >
        导出Excel
      </el-button>
      <el-button
        :loading="meterLoading"
        style="margin: 0 0 20px 20px"
        type="primary"
        @click="handleStartMeter"
      >
        开始抄表
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="tableData"
      style="width: 100%"
      height="1000"
      border
      stripe
      highlight-current-row
    >
      <el-table-column label="ID" prop="id" align="center" fixed />
      <el-table-column label="房号" prop="houseId" align="center" fixed>
        <template slot-scope="scope">
          <el-tag @click="getHouseLog(scope.row.houseId)">{{
            scope.row.houseId
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="房间状态"
        prop="saleStatus"
        align="center"
        fixed
      />
      <el-table-column label="房间类型" prop="houseAttribute" align="center" fixed />
      <el-table-column label="业主姓名" prop="userName" align="center" fixed />
      <el-table-column
        label="业主手机号"
        prop="userPhone"
        align="center"
        fixed
      />
      <el-table-column label="电表号" prop="electricMeterId" align="center" />
      <el-table-column label="当前余额" prop="account" align="center" />
      <el-table-column label="抄表日期" prop="watchStartTime" align="center" />
      <el-table-column label="用电次数" prop="electricNum" align="center" />
      <el-table-column label="总用电金额" prop="electricMoney" align="center" />
      <el-table-column label="剩余金额" prop="electricSurMoney" align="center" />
      <el-table-column label="总用电量" prop="electricTotal" align="center" />
      <!-- <el-table-column label="用电信息" prop="dsp" align="center" /> -->
      <el-table-column label="备注" prop="remark" align="center" />
    </el-table>
    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery_search.page" @pagination="getList" /> -->

  </div>
</template>

<script>
import {
  electricExportAll,
  electricExportStartMeter
} from '@/api/electricExport'
import { parseTime } from '@/utils'
import FilenameOption from '@/views/excel/components/FilenameOption'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  components: { FilenameOption ,Pagination},
  data() {
    return {
      downloadLoading: false,
      meterLoading: false,
      filename: '',
      tableData: [],
      listLoading: false,
      listQuery_search:{page:1},
      total:0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      electricExportAll(this.listQuery_search)
        .then((res) => {
          this.listLoading = false
          this.tableData = res.data
          this.total=res.total
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    handleStartMeter() {
      this.meterLoading = true
      electricExportStartMeter()
        .then((res) => {
          this.meterLoading = false
          if (res.code == 200) {
            this.$message.success('操作成功')
          }
        })
        .catch((err) => {
          this.meterLoading = false
        })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        const tHeader = [
          'Id',
          '房号',
          '房间状态',
          '房间类型',
          '业主姓名',
          '业主手机号',
          '电表号',
          '当前余额',
          '抄表日期',
          '用电次数',
          '总用电金额',
          '剩余金额',
          '总用电量',
          '备注'
        ]
        const filterVal = [
          'id',
          'houseId',
          'saleStatus',
          'houseAttribute',
          'userName',
          'userPhone',
          'electricMeterId',
          'account',
          'watchStartTime',
          'electricNum',
          'electricMoney',
          'electricSurMoney',
          'electricTotal',
          'remark'
        ]
        const list = this.tableData
        console.log(list)
        const data = this.formatJson(filterVal, list)
        console.log(data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    }
  }
}
</script>

<style>
</style>
