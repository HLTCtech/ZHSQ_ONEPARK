<template>
  <!-- 住宅物业费收费界面 -->
  <div class="app-container">
    <div class="filter-container">
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
        <el-table-column label="缴费方式1" prop="payType1" align="center" />
        <el-table-column label="缴费金额1" prop="payNum1" align="center" />
        <el-table-column label="缴费方式2" prop="payType2" align="center" />
        <el-table-column label="缴费金额2" prop="payNum2" align="center" />
        <el-table-column label="备注" prop="remark" align="center" />
      </el-table>
    </div>

    <!-- 分页功能实现标签 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery_all.page" @pagination="getList" />
  </div>
</template>

<script>
import { fetchExportList, fetchExportSearch } from '@/api/waterBill'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import FilenameOption from '@/views/excel/components/FilenameOption'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ExportPropertyWaterBill',
  components: { Pagination, FilenameOption },
  directives: { waves },
  data() {
    return {
      downloadLoading: false,
      listLoading: true,
      total: 0,
      // 定义导出excel默认选项
      filename: '',
      autoWidth: true,
      // 定义搜索按钮的query字段
      listQuery_search: {
        page: 1,
        houseId: null,
        houseName: null,
        dateRange: null
      },
      titles: [{ 'ID': 'id' }, { '房号': 'houseId' }, { '业主姓名': 'houseName' }],
      // 年份选择
      yearOptions: ['2020', '2019', '2018', '2017', '2016', '2015'],
      // list接口请求参数
      listQuery_all: {
        page: 1
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
      fetchExportList(this.listQuery_all).then(response => {
        this.tableData = response.data.items
        this.total = response.total
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
        const tHeader = ['Id', '房号', '业主姓名', '缴费项目', '周期开始', '周期结束', '缴费方式1', '缴费金额1', '缴费方式2', '缴费金额2', '备注']
        const filterVal = ['id', 'houseId', 'houseName', 'payItem', 'dateRangeStart', 'dateRangeEnd', 'payType1', 'payNum1', 'payType2', 'payNum2', 'remark']
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
