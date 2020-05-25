<template>
  <!-- 住宅物业费收费界面 -->
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery_search.houseId" type="text" placeholder="输入房间号" style="width: 130px" class="filter-item" clearable />
      <el-input v-model="listQuery_search.houseName" type="text" placeholder="输入业主姓名" style="width: 130px" class="filter-item" clearable />
      <!-- 时间选择器 -->
      <el-date-picker
        v-model="listQuery_search.datePicker"
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
    <el-table v-loading="listLoading" :data="tableData" style="width: 100%" height="1000" border stripe highlight-current-row>
      <el-table-column label="ID" prop="id" align="center" fixed />
      <el-table-column label="房号" prop="houseId" align="center" fixed>
        <template slot-scope="scope">
          <el-tag @click="getHouseLog(scope.row.houseId)">{{ scope.row.houseId }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="houseType" align="center" fixed />
      <el-table-column label="业主姓名" prop="houseName" align="center" fixed />
      <el-table-column label="房屋状况" prop="houseStatus" align="center" fixed />
      <el-table-column label="交款日期" prop="paidDate" align="center" />
      <el-table-column label="面积" prop="area" align="center" />
      <el-table-column label="收费标准(元/㎡)" prop="chargingStandard" align="center" />
      <el-table-column label="应缴费日期" prop="houseShallPayDate" align="center" />
      <el-table-column label="截止日期" prop="houseDeadline" align="center" />
      <el-table-column label="到期验证" prop="houseClosingVerify" align="center" />
      <el-table-column label="逾期天数" prop="houseOverdueDays" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.houseOverdueDays >= 0 ? 'danger' : 'success'" disable-transitions>{{ scope.row.houseOverdueDays }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" align="center" />
      <!-- <el-table-column label="费用收缴" align="center" width="80" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleMoneyGet(row.houseId)">
            收缴
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <!-- 点击houseId弹出信息变更历史模态框 -->
    <el-dialog :visible.sync="dialogHouseLog" title="房屋信息变更历史">
      <el-table :data="pvData_all" fit highlight-current-row style="width: 100%">
        <el-table-column prop="houseId" label="房间号" />
        <el-table-column prop="houseName" label="业主姓名" />
        <el-table-column prop="housePhone" label="业主手机号" />
        <el-table-column prop="houseArea" label="住宅面积" />
        <el-table-column prop="basementArea" label="地下室面积" />
        <el-table-column prop="changeTime" label="变更时间" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogHouseLog = false">确定</el-button>
      </span>
    </el-dialog>

    <!-- 分页功能实现标签 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery_search.page" @pagination="fetchListSearch" />
  </div>
</template>

<script>
import { fetchShopListAll, fetchShopSearch } from '@/api/payProperty'
import waves from '@/directive/waves' // waves directive
import { getLogByHouseId } from '@/api/operationLog'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import FilenameOption from '@/views/excel/components/FilenameOption'

export default {
  name: 'ShopStandingBook',
  components: { Pagination, FilenameOption },
  directives: { waves },
  data() {
    return {
      listLoading: true,
      total: 0,
      pvData_all: [],
      dialogHouseLog: false,
      // 定义搜索按钮的query字段
      listQuery_search: {
        page: 1,
        houseId: null,
        houseName: null,
        datePicker: null
      },
      // 定义导出excel默认选项
      filename: '',
      autoWidth: true,
      downloadLoading: false,
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
      this.listLoading = true
      fetchShopListAll(this.listQuery_all).then(response => {
        this.tableData = response.data.items
        this.total = response.total
        this.listLoading = false
      })
    },
    // 绑定分页按钮
    fetchListSearch() {
      this.listLoading = true
      fetchShopSearch(this.listQuery_search).then(response => {
        this.tableData = response.data.items
        this.listLoading = false
      })
    },
    // 绑定搜索按钮
    handleFilter() {
      this.listLoading = true
      this.listQuery_search.page = 1
      fetchShopSearch(this.listQuery_search).then(response => {
        this.tableData = response.data.items
        this.listLoading = false
      })
    },
    // 点击houseId获取房间变更历史
    getHouseLog(houseId) {
      getLogByHouseId(houseId).then(response => {
        this.pvData_all = response.data.pvData
        this.dialogHouseLog = true
      })
    },
    // excel导出
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['Id', '房号', '类型', '业主姓名', '房屋状况', '交款日期', '面积', '收费标准(元/㎡)', '应缴费日期', '截止日期', '到期验证', '逾期天数', '备注']
        const filterVal = ['id', 'houseId', 'houseType', 'houseName', 'houseStatus', 'paidDate', 'area', 'chargingStandard', 'houseShallPayDate', 'houseDeadline', 'houseClosingVerify', 'houseOverdueDays', 'remark']
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
  }
}
</script>
