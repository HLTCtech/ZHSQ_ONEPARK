<template>
  <!-- 费用总览界面 -->
  <div class="app-container">
    <div class="filter-container">
      <!-- 时间选择器 -->
      <el-date-picker
        v-model="listQuery.dateRange"
        class="filter-item"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">
        生成统计数据
      </el-button>
    </div>

    <!-- excel导出功能 -->
    <div>
      <FilenameOption v-model="filename" />
      <el-button :loading="downloadLoading" style="margin:0 0 20px 20px;" type="primary" icon="el-icon-document" @click="handleDownload">
        导出Excel
      </el-button>
    </div>

    <!-- 测试打印功能 -->
    <!-- <div>
      <el-button :loading="downloadLoading" style="margin:0 0 20px 20px;" type="primary" icon="el-icon-document" @click="handelPrint">
        打印
      </el-button>
    </div> -->

    <!-- 表格 -->
    <el-card class="box-card">
      <el-card style="margin-top: 20px; height: 50px;width:400px; text-align:center; vertical-align:middle">
        选择的本周周期：{{ billDateRange }}
      </el-card>
      <br>
      <div class="printTable">
        <el-table :data="tableData" highlight-current-row border fit max-height="900px" style="width:800px">
          <el-table-column label="费用\周期" prop="billItem" align="center" />
          <el-table-column label="本周" prop="billByWeek" align="center" />
          <el-table-column label="本周代金券" prop="voucherByWeek" align="center" />
          <el-table-column label="本月" prop="billByMonth" align="center" />
          <el-table-column label="本月代金券" prop="voucherByMonth" align="center" />
          <el-table-column label="本年" prop="billByYear" align="center" />
          <el-table-column label="本年代金券" prop="voucherByYear" align="center" />
        </el-table>
      </div>
    </el-card>

  </div>

</template>

<script>
import { fetchBillList } from '@/api/billOverall'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import FilenameOption from '@/views/excel/components/FilenameOption'

export default {
  name: 'ExportPropertyWaterBill',
  components: { FilenameOption },
  directives: { waves },
  data() {
    return {
      downloadLoading: false,
      listLoading: true,
      total: 0,
      // 定义导出excel默认选项
      filename: '',
      autoWidth: true,
      // list接口请求参数
      listQuery: {
        dateRange: null
      },
      // 声明下api变量
      tableData: [],
      // 时间选择器返回数据
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  computed: {
    billDateRange: function() {
      var weekRange
      weekRange = this.listQuery.dateRange
      return weekRange
    }
  },
  methods: {
    getList() {
      fetchBillList(this.listQuery).then(response => {
        this.tableData = response.data.items
      })
    },
    // excel导出
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['费用\周期', '本周', '本周代金券', '本月', '本月代金券', '本年', '本年代金券']
        const filterVal = ['billItem', 'billByWeek', 'voucherByWeek', 'billByMonth', 'voucherByMonth', 'billByYear', 'voucherByYear']
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
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
    // 测试打印功能
    // handelPrint() {
    //   var newStr = document.getElementsByClassName('printTable')[0].innerHTML
    //   document.body.innerHTML = newStr
    //   // 调用打印功能
    //   window.print()
    //   // 点击取消后刷新页面
    //   window.location.reload()
    // }
  }
}
</script>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

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
    width: 6px !important
  }
}

</style>
