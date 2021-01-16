<template>
  <!-- 科目编码 -->
  <div class="app-container">
    <div class="filter-container">
      <!-- 时间选择器 -->
      <el-date-picker
        v-model="listQuery_search.dateRange"
        class="filter-item"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
    </div>

    <!-- excel导出功能 -->
    <div>
      <FilenameOption v-model="filename" />
      <el-button
        :loading="downloadLoading"
        style="margin:0 0 20px 20px;"
        type="primary"
        icon="el-icon-document"
        @click="handleDownload"
      >
        导出Excel
      </el-button>
    </div>

    <!-- 表格 -->
    <div class="printTable">
      <el-table
        :data="tableData"
        highlight-current-row
        stripe
        border
        fit
        max-height="800px"
      >
        <el-table-column label="ID" prop="id" align="center" />
        <el-table-column label="制单日期" prop="billsMadeDate" align="center" />
        <el-table-column label="凭证类别" prop="voucherType" align="center" />
        <el-table-column label="凭证编号" prop="voucherId" align="center" />
        <el-table-column label="摘要" prop="abstract" align="center" />
        <el-table-column label="科目编码" prop="subjectCode" align="center" />
        <el-table-column label="币种" prop="moneyType" align="center" />
        <el-table-column
          label="借贷方向"
          prop="lendingDirection"
          align="center"
        />
        <el-table-column label="本币" prop="localCurrency" align="center" />
        <el-table-column
          label="往来单位编码"
          prop="contactUnitCode"
          align="center"
        />
      </el-table>
    </div>
  </div>
</template>

<script>
import { fetchExportList, fetchExportSearch } from '@/api/subjectCode'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import FilenameOption from '@/views/excel/components/FilenameOption'

export default {
  name: 'ExportSubjectCode',
  components: { FilenameOption },
  directives: { waves },
  data() {
    return {
      downloadLoading: false,
      listLoading: true,
      // 定义导出excel默认选项
      filename: '',
      autoWidth: true,
      // 定义搜索按钮的query字段
      listQuery_search: {
        dateRange: null
      },
      // 声明下api变量
      tableData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      fetchExportList().then(response => {
        this.tableData = response.data
      })
    },
    // 根据选定信息搜索
    fetchListSearch() {
      fetchExportSearch(this.listQuery_search).then(response => {
        this.tableData = response.data.items
      })
    },
    handleFilter() {
      // 搜索功能调用
      this.fetchListSearch()
    },
    // excel导出
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [
          'Id',
          '制单日期',
          '凭证类别',
          '凭证编号',
          '摘要',
          '科目编码',
          '币种',
          '借贷方向',
          '本币',
          '往来单位编码'
        ]
        const filterVal = [
          'id',
          'billsMadeDate',
          'voucherType',
          'voucherId',
          'abstract',
          'subjectCode',
          'moneyType',
          'lendingDirection',
          'localCurrency',
          'contactUnitCode'
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
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            if (v === null) {
              return ''
            } else {
              return v[j]
            }
          }
        })
      )
    },
    // 测试打印功能
    handelPrint() {
      var newStr = document.getElementsByClassName('printTable')[0].innerHTML
      document.body.innerHTML = newStr
      // 调用打印功能
      window.print()
      // 点击取消后刷新页面
      window.location.reload()
    }
  }
}
</script>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.show-sms {
  position: absolute;
  right: 10px;
  top: 82px;
  font-size: 15px;
  color: $light_gray;
  cursor: pointer;
  user-select: none;
}

body .el-table th.gutter {
  display: table-cell !important;
}
.el-table {
  th.gutter,
  colgroup.gutter {
    display: block !important;
    width: 6px !important;
  }
}
</style>
