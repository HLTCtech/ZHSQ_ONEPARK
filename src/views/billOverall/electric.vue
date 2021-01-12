<template>
  <div class="app-container">
    <el-row style="margin-bottom:10px">
      <el-select v-model="searchType">
        <el-option
          v-for="(item, i) of option"
          :key="i"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-row>
    <div class="filter-container" v-if="searchType === 'statistical'">
      <el-date-picker
        v-model="listQuery_search.date"
        type="month"
        value-format="yyyy-MM"
        class="filter-item"
        placeholder="选择月"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="getList((listQuery_search.page = 1))"
      >
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
          >导出Excel</el-button
        >
        <el-button
          :loading="downloadLoading"
          style="margin:0 0 20px 20px;"
          type="primary"
          icon="el-icon-document"
          @click="handleDownload('muban')"
          >导出模板</el-button
        >
      </div>
    </div>
    <div v-else>
      <FilenameOption v-model="filename" />
      <el-button
        :loading="downloadLoading"
        style="margin:0 0 20px 20px;"
        type="primary"
        icon="el-icon-document"
        @click="handleDownload"
        >导出Excel</el-button
      >
    </div>
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      border
      fit
      stripe
      key="100001"
      highlight-current-row
      v-if="searchType === 'statistical'"
    >
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
    <!-- 电费欠费表格 -->
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      border
      fit
      stripe
      key="100002"
      highlight-current-row
      v-else-if="searchType === 'owe'"
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
      <el-table-column
        label="房间类型"
        prop="houseAttribute"
        align="center"
        fixed
      />
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
      <el-table-column label="备注" prop="remark" align="center" />
      <el-table-column label="电表状态" prop="electricStatus" align="center">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.electricStatus == '欠费' ? 'warning' : 'danger'"
            disable-transitions
            >{{ scope.row.electricStatus }}</el-tag
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 电费统计数据表格 -->
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      border
      fit
      stripe
      key="100003"
      highlight-current-row
      v-else
    >
      <template>
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
        <el-table-column
          label="房间类型"
          prop="houseAttribute"
          align="center"
          fixed
        />
        <el-table-column
          label="业主姓名"
          prop="userName"
          align="center"
          fixed
        />
        <el-table-column
          label="业主手机号"
          prop="userPhone"
          align="center"
          fixed
        />
        <el-table-column label="电表号" prop="electricMeterId" align="center" />
        <el-table-column label="当前余额" prop="account" align="center" />
        <el-table-column
          label="抄表日期"
          prop="watchStartTime"
          align="center"
        />
        <el-table-column label="用电次数" prop="electricNum" align="center" />
        <el-table-column
          label="总用电金额"
          prop="electricMoney"
          align="center"
        />
        <el-table-column
          label="剩余金额"
          prop="electricSurMoney"
          align="center"
        />
        <el-table-column label="总用电量" prop="electricTotal" align="center" />
        <!-- <el-table-column label="用电信息" prop="dsp" align="center" /> -->
        <el-table-column label="备注" prop="remark" align="center" />
      </template>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery_search.page"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import FilenameOption from '@/views/excel/components/FilenameOption'
import { upload, electricStatisticsAll } from '@/api/electricStatistics'
import { electricBlance } from '@/api/electricitycharge'
import { electricExportAll } from '@/api/electricExport'
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination, FilenameOption },
  data() {
    return {
      searchType: 'statistical',
      option: [
        {
          label: '电费统计数据',
          value: 'statistical' //统计
        },
        {
          label: '电费欠费',
          value: 'owe' //欠费
        },
        {
          label: '月度电费统计',
          value: 'export' //欠费
        }
      ],
      filename: '',
      downloadLoading: false,
      tableLoading: false,
      listQuery: { page: 1 },
      listQuery_search: { date: null, page: 1 },
      total: 0,
      tableData: []
    }
  },
  created() {
    this.getList()
  },
  watch: {
    searchType() {
      this.getList()
    }
  },
  methods: {
    handleRequest(param) {
      const fileObj = param.file
      // FormData 对象
      const form = new FormData()
      // 文件对象
      form.append('file', fileObj)
      upload(form).then(res => {
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
      let api = null
      let data = null
      this.tableData = []
      if (this.searchType === 'statistical') {
        api = electricStatisticsAll
        data = this.listQuery_search
      } else if (this.searchType === 'owe') {
        api = electricBlance
        data = this.listQuery
      } else {
        api = electricExportAll
        data = this.listQuery
      }
      api(data).then(res => {
        this.tableLoading = false
        this.tableData = res.data
        if (res.total) {
          this.total = res.total
        }
      })
    },
    handleDownload(type) {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        let tHeader = null
        let filterVal = null
        if (this.searchType === 'statistical') {
          tHeader = [
            'id',
            '电表号',
            '采集器编号',
            '通讯地址',
            '用户姓名',
            '备注',
            '时间',
            '总',
            '时间',
            '总',
            '总(差值)',
            '倍率',
            '单位',
            '月份'
          ]
          filterVal = [
            'id',
            'houseId',
            'collectorId',
            'address',
            'userName',
            'remark',
            'startTime',
            'startElect',
            'endTime',
            'endElect',
            'totalElect',
            'rate',
            'sign',
            'yearMonth'
          ]
        } else if (this.searchType === 'owe') {
          tHeader = [
            '表头',
            'ID',
            '房号',
            '房间状态',
            '房间类型',
            '业主姓名',
            '业主手机号',
            '电表号',
            '当前余额',
            '抄表日期',
            '备注',
            '电表状态'
          ]
          filterVal = [
            'key',
            'id',
            'houseId',
            'saleStatus',
            'houseAttribute',
            'userName',
            'userPhone',
            'electricMeterId',
            'account',
            'watchStartTime',
            'remark',
            'electricStatus'
          ]
        } else {
          tHeader = [
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
          filterVal = [
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
        }
        const list = type == 'muban' ? [] : this.tableData
        const data = this.formatJson(filterVal, list)
        let exportData = {
          header: tHeader,
          data,
          filename: this.filename
        }
        if (this.searchType === 'statistical') {
          exportData.multiHeader = [
            [
              '',
              '',
              '',
              '',
              '',
              '',
              '正向有功总电能 开始',
              '',
              '正向有功总电能 结束',
              '',
              '正向有功总电能 统计结果',
              '',
              '',
              ''
            ]
          ]
          exportData.merges = ['G1:H1', 'I1:J1', 'K1:M1'] //合并单元格
        } else {
          if (exportData.multiHeader) {
            delete exportData.multiHeader
            delete exportData.merges //
          }
        }
        excel.export_json_to_excel(exportData)
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j]
        })
      )
    }
  }
}
</script>

<style>
.upload-demo {
  display: inline-flex;
  margin-left: 20px;
}
</style>
