<template>
  <!-- 操作记录---收费记录 -->
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery_search.payItem"
        placeholder="选择费用类型"
        clearable
        style="width: 140px"
        class="filter-item"
      >
        <el-option
          v-for="item in payItemOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-input
        v-model="listQuery_search.houseId"
        type="text"
        placeholder="输入房间号"
        style="width: 130px"
        class="filter-item"
        clearable
      />
      <el-input
        v-model="listQuery_search.operator"
        type="text"
        placeholder="输入操作人姓名"
        style="width: 150px"
        class="filter-item"
        clearable
      />
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
    <el-table
      v-loading="listLoading"
      :data="tableData"
      highlight-current-row
      stripe
      border
      fit
      max-height="900px"
    >
      <el-table-column label="ID" prop="id" align="center" />
      <el-table-column label="房号" prop="houseId" align="center" />
      <el-table-column label="业主姓名" prop="houseName" align="center" />
      <el-table-column label="缴费项目" prop="payItem" align="center" />
      <el-table-column label="缴费周期" prop="payDateRange" align="center" />
      <el-table-column label="支付宝金额" prop="alipayNum" align="center" />
      <el-table-column label="微信金额" prop="wechatNum" align="center" />
      <el-table-column label="现金金额" prop="cashNum" align="center" />
      <el-table-column label="代金券金额" prop="voucherNum" align="center" />
      <el-table-column label="其他" prop="othersNum" align="center" />
      <el-table-column label="特批" prop="specialNum" align="center" />
      <el-table-column label="转存" prop="turnNum" align="center" />
      <el-table-column label="总金额" prop="moneyGet" align="center" />
      <!-- <el-table-column label="备注" prop="remark" align="center" /> -->
      <el-table-column label="缴费时间" prop="paidDate" align="center" />
      <el-table-column label="操作人" prop="operator" align="center" />
    </el-table>

    <!-- 分页功能实现标签 -->
    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery_search.page" @pagination="fetchListSearch" /> -->
  </div>
</template>

<script>
import { listMoneyGetLog, searchMoneyGetLog } from '@/api/operationLog'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
// import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import FilenameOption from '@/views/excel/components/FilenameOption'

export default {
  name: 'MoneyGetLog',
  // components: { Pagination },
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
      // 定义搜索按钮的query字段
      listQuery_search: {
        page: 1,
        houseId: null,
        operator: null,
        dateRange: null,
        payItem: null
      },
      // 定义收费费用类型
      payItemOptions: [
        '电费',
        '水费',
        '物业费',
        '停车场维护费',
        '装修保证金',
        '暖气费',
        '垃圾清运费',
        '出入证工本费',
        '出入证押金',
        '有限电视',
        '智能卡工本费',
        '蓝牙卡工本费',
        '对外保洁',
        '电动车充电',
        '温泉水卡补卡',
        '车位锁工本费',
        '室内开荒'
      ],
      titles: [{ ID: 'id' }, { 房号: 'houseId' }, { 业主姓名: 'houseName' }],
      // list接口请求参数
      listQuery_all: {
        page: 1
      },
      // 声明下api变量
      tableData: [],
      // 时间选择器返回数据
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
      //   date_picker: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listMoneyGetLog(this.listQuery_all).then(response => {
        this.tableData = response.data.items
        this.total = response.total
        this.listLoading = false
      })
    },
    // 分页按钮绑定
    fetchListSearch() {
      this.listLoading = true
      searchMoneyGetLog(this.listQuery_search).then(response => {
        this.tableData = response.data.items
        this.listLoading = false
      })
    },
    // 搜索按钮绑定
    handleFilter() {
      this.listLoading = true
      this.listQuery_search.page = 1
      searchMoneyGetLog(this.listQuery_search).then(response => {
        this.tableData = response.data.items
        this.listLoading = false
      })
    },
    // excel导出
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [
          'Id',
          '房号',
          '缴费项目',
          '缴费周期',
          '支付宝金额',
          '微信金额',
          '现金金额',
          '代金券金额',
          '其他',
          '特批',
          '备注',
          '缴费时间',
          '操作人'
        ]
        const filterVal = [
          'id',
          'houseId',
          'payItem',
          'payDateRange',
          'alipayNum',
          'wechatNum',
          'cashNum',
          'voucherNum',
          'otherNum',
          'specialNum',
          'remark',
          'paidDate',
          'operator'
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
            return v[j]
          }
        })
      )
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
