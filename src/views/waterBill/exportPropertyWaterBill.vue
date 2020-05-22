<template>
  <!-- 导出物业流水 -->
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery_search.moneyType" placeholder="选择费用类型" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in moneyTypeOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-input v-model="listQuery_search.houseId" type="text" placeholder="输入房间号" style="width: 130px" class="filter-item" clearable />
      <el-input v-model="listQuery_search.houseName" type="text" placeholder="输入业主姓名" style="width: 130px" class="filter-item" clearable />
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
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <!-- excel导出功能 -->
    <div>
      <FilenameOption v-model="filename" />
      <el-button :loading="downloadLoading" style="margin:0 0 20px 20px;" type="primary" icon="el-icon-document" @click="handleDownload">
        导出Excel
      </el-button>
    </div>

    <!-- 表格 -->
    <div class="printTable">
      <el-table :data="tableData" highlight-current-row stripe border fit max-height="900px">
        <el-table-column label="ID" prop="id" align="center" />
        <el-table-column label="房号" prop="houseId" align="center" />
        <el-table-column label="业主姓名" prop="houseName" align="center" />
        <el-table-column label="缴费项目" prop="payItem" align="center" />
        <el-table-column label="周期开始" prop="dateRangeStart" align="center" />
        <el-table-column label="周期结束" prop="dateRangeEnd" align="center" />
        <el-table-column label="支付宝" prop="alipayNum" align="center" />
        <el-table-column label="微信" prop="wechatNum" align="center" />
        <el-table-column label="现金" prop="cashNum" align="center" />
        <el-table-column label="代金券" prop="voucherNum" align="center" />
        <el-table-column label="其他" prop="otherNum" align="center" />
        <el-table-column label="特批" prop="specialNum" align="center" />
        <el-table-column label="缴费时间" prop="paidDate" align="center" />
        <el-table-column label="备注" prop="remark" align="center" />
      </el-table>
    </div>

  </div>
</template>

<script>
import { fetchExportList, fetchExportSearch } from '@/api/waterBill'
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
      moneyTypeOptions: ['物业费', '暖气费', '暖气费退款', '装修保证金', '装修保证金退款', '垃圾清运费', '出入证押金', '出入证押金退款', '出入证工本费', '地下车位', '住宅物业费', '住宅暖气'],
      listLoading: true,
      // 定义导出excel默认选项
      filename: '',
      autoWidth: true,
      // 定义搜索按钮的query字段
      listQuery_search: {
        houseId: null,
        houseName: null,
        dateRange: null
      },
      titles: [{ 'ID': 'id' }, { '房号': 'houseId' }, { '业主姓名': 'houseName' }],
      // 年份选择
      yearOptions: ['2020', '2019', '2018', '2017', '2016', '2015'],
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
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    //   date_picker: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      fetchExportList().then(response => {
        this.tableData = response.data.items
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
        const tHeader = ['Id', '房号', '业主姓名', '缴费项目', '周期开始', '周期结束', '支付宝', '微信', '现金', '代金券', '其他', '特批', '缴费时间', '备注']
        const filterVal = ['id', 'houseId', 'houseName', 'payItem', 'dateRangeStart', 'dateRangeEnd', 'alipayNum', 'wechatNum', 'cashNum', 'voucherNum', 'otherNum', 'specialNum', 'paidDate', 'remark']
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
